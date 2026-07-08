from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_products, name='get_products'),
    path('add/', views.add_product, name='add_product'),
    path('update/<int:pk>/', views.update_product, name='update_product'),
    path('delete/<int:pk>/', views.delete_product, name='delete_product'),
]
