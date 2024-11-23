from django.urls import path

from .views import (
    ImageUploadView,
    ListImageView,
    DeleteImageView,
    UpdateImageView,
    OrderChangeView,
)


urlpatterns = [
    path("upload/", ImageUploadView.as_view(), name="image-upload"),
    path("list-images/", ListImageView.as_view(), name="list-image"),
    path("delete-image/<int:pk>/", DeleteImageView.as_view(), name="delete-image"),
    path("update-image/<int:pk>/", UpdateImageView.as_view(), name="update-image"),
    path("order-change/", OrderChangeView.as_view(), name="order-change"),
]
