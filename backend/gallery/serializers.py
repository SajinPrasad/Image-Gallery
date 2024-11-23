from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import ValidationError

from .models import Image


class ImageSerializer(ModelSerializer):
    def validate_order(self, value):
        if value <= 0:
            raise ValidationError("Order must be a positive integer.")

        # Check if this order already exists for the user
        if self.instance:  # Only check on updates
            existing = (
                Image.objects.filter(user=self.instance.user, order=value)
                .exclude(id=self.instance.id)
                .exists()
            )

            if existing:
                raise ValidationError(f"Order {value} is already taken for this user.")
        return value

    class Meta:
        model = Image
        fields = ["id", "user", "image", "title", "order"]


class ImageOrderSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "order"]
