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

        if len(images) != len(titles):
            raise ValidationError("Some fields are missing please verify.")

        latest_order = Image.get_latest_order()

        for image, title in zip(images, titles):
            latest_order += 1
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

    serializer_class = ImageSerializer

    def get_queryset(self):
        user = self.request.user

        return Image.objects.filter(user=user)
