from django.urls import path
from . import views

urlpatterns = [
    # Customer Pages
    path('', views.index, name='index'),
    path('medicines/', views.medicines_page, name='medicines'),
    path('medicines/<str:medicine_id>/', views.medicine_detail_page, name='medicine_detail'),
    path('cart/', views.cart_page, name='cart'),
    path('orders/', views.orders_page, name='orders'),
    path('orders/<str:order_id>/', views.order_detail_page, name='order_detail'),
    path('login/', views.login_page, name='login'),
    path('register/', views.register_page, name='register'),
    path('profile/', views.profile_page, name='profile'),

    # Admin Pages
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/medicines/', views.admin_medicines, name='admin_medicines'),
    path('admin-dashboard/categories/', views.admin_categories, name='admin_categories'),
    path('admin-dashboard/orders/', views.admin_orders, name='admin_orders'),
    path('admin-dashboard/users/', views.admin_users, name='admin_users'),
]
