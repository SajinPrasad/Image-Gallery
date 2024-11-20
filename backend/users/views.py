from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

from .serializers import UserRegistrationSerializer

User = get_user_model()

# Create your views here.


class UserRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    queryset = User.objects.all()
    