from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import UserRegistrationView, LoginView, ResetPasswordView, LogoutView


urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
