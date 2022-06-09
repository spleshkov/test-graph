from django.urls import path, include
from .views import (
    ApiView,
)

urlpatterns = [
    path('data', ApiView.as_view()),
]