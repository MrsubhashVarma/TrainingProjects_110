"""URL configuration for the Pharmacy API."""

from django.urls import path
from .views.auth_views import register, login, logout, profile
from .views.category_views import categories_list, category_detail
from .views.medicine_views import (
    medicines_list, medicine_detail, medicine_search,
    medicine_by_category, medicine_low_stock
)
from .views.cart_views import cart_view, cart_add, cart_update, cart_remove, cart_clear
from .views.order_views import orders_list, order_detail
from .views.dashboard_views import (
    dashboard, dashboard_revenue, dashboard_low_stock,
    dashboard_recent_orders, user_management, user_action
)

urlpatterns = [
    # Auth
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('logout', logout, name='logout'),
    path('profile', profile, name='profile'),

    # Categories
    path('categories', categories_list, name='categories-list'),
    path('categories/<str:category_id>', category_detail, name='category-detail'),

    # Medicines
    path('medicines', medicines_list, name='medicines-list'),
    path('medicines/search', medicine_search, name='medicine-search'),
    path('medicines/low-stock', medicine_low_stock, name='medicine-low-stock'),
    path('medicines/category/<str:category>', medicine_by_category, name='medicine-by-category'),
    path('medicines/<str:medicine_id>', medicine_detail, name='medicine-detail'),

    # Cart
    path('cart', cart_view, name='cart'),
    path('cart/add', cart_add, name='cart-add'),
    path('cart/update', cart_update, name='cart-update'),
    path('cart/remove/<str:medicine_id>', cart_remove, name='cart-remove'),
    path('cart/clear', cart_clear, name='cart-clear'),

    # Orders
    path('orders', orders_list, name='orders-list'),
    path('orders/<str:order_id>', order_detail, name='order-detail'),

    # Dashboard
    path('dashboard', dashboard, name='dashboard'),
    path('dashboard/revenue', dashboard_revenue, name='dashboard-revenue'),
    path('dashboard/low-stock', dashboard_low_stock, name='dashboard-low-stock'),
    path('dashboard/recent-orders', dashboard_recent_orders, name='dashboard-recent-orders'),

    # User Management (Admin)
    path('users', user_management, name='user-management'),
    path('users/<str:user_id>', user_action, name='user-action'),
]
