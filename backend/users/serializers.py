from rest_framework.serializers import ModelSerializer, CharField
from rest_framework.exceptions import ValidationError

from .models import CustomUser


def validate_email(email):
    try:
        email_address, email_domain = email.split("@")
        domain_name, domain_TLD = email_domain.split(".")
        return True
    except ValueError:
        return False


class UserRegistrationSerializer(ModelSerializer):
    password2 = CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ["username", "password", "password2", "email", "phone_number"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"required": False, "read_only": True},
            "email": {"required": True},
            "phone_number": {"required": True},
        }

    def validate(self, data):
        # Check if passwords match
        if data["password"] != data["password2"]:
            raise ValidationError({"password": "Passwords do not match."})

        if not validate_email(data["email"]):
            raise ValidationError({"email": "Invalid email."})
        
        if CustomUser.objects.filter(email=data["email"]).exists():
            raise ValidationError({"email": "User with email id exists."})

        if len(data["phone_number"]) != 10:
            raise ValidationError({"phone_number": "Invalid phone number."})

        if CustomUser.objects.filter(phone_number=data["phone_number"]).exists():
            raise ValidationError({"phone_number": "Phone number already exists."})

        return data

    def create(self, validated_data):
        # Remove password2 from validated data before creating user
        validated_data.pop("password2")

        email_address, email_domain = validated_data["email"].split("@")
        username = email_address

        # Create user
        user = CustomUser.objects.create_user(
            username=username,
            password=validated_data["password"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
        )
        return user
