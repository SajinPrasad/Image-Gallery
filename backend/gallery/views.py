from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from .models import Image
from .serializers import ImageSerializer

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
        orders = request.data.get("orders", [])

        updated_images = []
        errors = []

        for order in orders:
            try:
                instance = Image.objects.get(id=order["id"])
            except Image.DoesNotExist:
                errors.append({"id": order["id"], "error": "Image not found"})
                continue  # Skip this order if the Image does not exist

            serializer = ImageSerializer(data=order, instance=instance, partial=True)

            if serializer.is_valid():
                serializer.save()
                updated_images.append(serializer.data)
            else:
                errors.append({"id": order["id"], "errors": serializer.errors})

        # Final response after processing all orders
        if errors:
            return Response(
                {
                    "message": "Some orders failed to update.",
                    "updated_images": updated_images,
                    "errors": errors,
                },
                status=status.HTTP_207_MULTI_STATUS,  # Multi-status for partial success
            )
        else:
            return Response(
                {
                    "message": "Images updated successfully!",
                    "updated_images": updated_images,
                },
                status=status.HTTP_200_OK,
            )
