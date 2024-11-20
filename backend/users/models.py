from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)

    groups = models.ManyToManyField(
        Group, related_name="customuser_set"
    )  # Add related_name
    user_permissions = models.ManyToManyField(
        Permission, related_name="customuser_set"
    )  # Add related_name

    def __str__(self):
        return f"{self.email}"
