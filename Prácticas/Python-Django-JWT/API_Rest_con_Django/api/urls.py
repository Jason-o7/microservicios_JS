from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('libros/', views.get_libros, name='get_libros'),
    path('libros/crear/', views.create_libro, name='create_libro'),
    path('libros/<int:pk>/', views.libro_detail, name='libro_detail'),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

