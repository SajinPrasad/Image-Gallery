from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()


class Image(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="uploads/")
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]

    @classmethod
    def get_latest_order(cls, user):
        latest_image = cls.objects.filter(user=user).order_by("-order").first()
        return latest_image.order if latest_image else 0
