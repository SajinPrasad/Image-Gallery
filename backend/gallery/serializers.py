from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import ValidationError
from PIL import Image as PILImage, UnidentifiedImageError

from .models import Image


class ImageSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "user", "image", "title", "order"]

    def to_internal_value(self, data):
        """
        Custom validation for fields before default field-level validation.
        """
        image = data.get("image")
        title = data.get("title")

        # Custom validation for title
        if not title:
            raise ValidationError({"title": "Title field is required."})

        # Custom validation for the image
        if not image:
            raise ValidationError({"image": "Image field is required."})

        try:
            img = PILImage.open(image)
            img.verify()  # Verify the file is an image
        except UnidentifiedImageError:
            raise ValidationError(
                {"image": f"{title}-Invalid image file. Please upload a valid image."}
            )
        except Exception as e:
            raise ValidationError(
                {
                    "image": f"{title}-An error occurred while processing the image: {str(e)}"
                }
            )

        # Optionally check allowed formats
        allowed_formats = ["JPEG", "PNG"]
        if img.format not in allowed_formats:
            raise ValidationError(
                {
                    "image": f"Unsupported image format: {img.format}. Allowed formats are {', '.join(allowed_formats)}."
                }
            )

        return super().to_internal_value(data)

    def validate(self, attrs):
        print(attrs)
        title = attrs.get("title", "")
        image = attrs.get("image", "")

        if not title:
            raise ValidationError("Title field is required.")

        if not image:
            raise ValidationError("Image field is reqired.")

        # Validate the image
        try:
            # Open the uploaded image
            img = PILImage.open(image)
            img.verify()  # Verify that it is, indeed, an image file
        except UnidentifiedImageError:
            raise ValidationError(
                f"{title} - Invalid image file. Please upload a valid image."
            )
        except Exception as e:
            raise ValidationError(
                f"An error occurred while processing the image - {title}: {str(e)}"
            )

        # Optionally, check image format
        allowed_formats = ["JPEG", "PNG"]
        if img.format not in allowed_formats:
            raise ValidationError(
                f"Unsupported image format: {img.format}. Allowed formats are {', '.join(allowed_formats)}."
            )

        return attrs
    

class ImageEditSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "user", "image", "title", "order"]


class ImageOrderChangeSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "order", "image"]
