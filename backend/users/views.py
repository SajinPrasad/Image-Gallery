from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_205_RESET_CONTENT, HTTP_400_BAD_REQUEST

from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    ResetPasswordSerializer,
)

User = get_user_model()

# Create your views here.


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    queryset = User.objects.all()


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if refresh_token:
                # Blacklist the token
                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response(HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response(HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(
            instance=request.user, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password updated successfully."})

        return Response(serializer.errors, status=400)
