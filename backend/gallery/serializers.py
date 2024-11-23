from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import ValidationError

from .models import Image


class ImageSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "user", "image", "title", "order"]
