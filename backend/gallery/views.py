from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
import json
from django.db import transaction
from django.db.models import Max

from .models import Image
from .serializers import ImageSerializer, ImageOrderSerializer

# Create your views here.


class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        images = request.FILES.getlist("images")
        titles = request.data.getlist("titles")
        orders = request.data.getlist("orders", [])

        if len(images) != len(titles):
            raise ValidationError("Some fields are missing please verify.")

        if orders and len(orders) != len(images):
            raise ValidationError("Orders list length must match images list length.")

        # Convert orders to integers
        orders = list(map(int, orders)) if orders else []

        # Get the latest order value if no orders are provided
        latest_order = Image.get_latest_order(request.user)

        for index, (image, title) in enumerate(zip(images, titles)):
            order = orders[index] if orders else latest_order + 1
            latest_order = order

            serializer = ImageSerializer(
                data={
                    "user": request.user.id,
                    "title": title,
                    "image": image,
                    "order": latest_order,
                }
            )

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "Images uploaded successfully!"}, status=status.HTTP_201_CREATED
        )


class ListImageView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSerializer

    def get_queryset(self):
        user = self.request.user

        return Image.objects.filter(user=user)


class DeleteImageView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSerializer

    def get_queryset(self):
        user = self.request.user

        return Image.objects.filter(user=user)


class UpdateImageView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSerializer

    def get_queryset(self):
        user = self.request.user

        return Image.objects.filter(user=user)


class OrderChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        metadata = request.data.get("metadata", [])

        if isinstance(metadata, str):
            try:
                metadata = json.loads(metadata)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid metadata format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Validate basic metadata structure
        if not metadata:
            return Response(
                {"error": "No order values provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate all images exist and belong to the user
        image_ids = [item.get("id") for item in metadata]
        images = Image.objects.filter(id__in=image_ids, user=request.user)

        if images.count() != len(metadata):
            return Response(
                {"error": "One or more images not found or don't belong to the user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            with transaction.atomic():
                # Get all user's images for proper reordering
                all_user_images = Image.objects.filter(user=request.user).order_by(
                    "order"
                )

                # Create a list of all images with their new positions
                reordered_images = list(all_user_images)

                # Update positions for the changed images
                for new_order_data in metadata:
                    image = images.get(id=new_order_data["id"])
                    current_index = reordered_images.index(image)
                    desired_index = (
                        new_order_data["order"] - 1
                    )  # Convert to 0-based index

                    # Move the image to its new position
                    if current_index != desired_index:
                        image = reordered_images.pop(current_index)
                        reordered_images.insert(desired_index, image)

                # Update all orders sequentially
                for index, image in enumerate(reordered_images, start=1):
                    if image.order != index:
                        image.order = index
                        image.save()

            # Return updated images
            updated_images = Image.objects.filter(user=request.user).order_by("order")
            serializer = ImageSerializer(updated_images, many=True)

            return Response(
                {"message": "Images updated successfully!", "images": serializer.data},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
