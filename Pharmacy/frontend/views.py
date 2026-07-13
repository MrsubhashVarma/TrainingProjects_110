"""Frontend views — serve all HTML template pages."""

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'index.html')

def medicines_page(request):
    return render(request, 'medicines.html')

def medicine_detail_page(request, medicine_id):
    return render(request, 'medicine_detail.html', {'medicine_id': medicine_id})

def cart_page(request):
    return render(request, 'cart.html')

def orders_page(request):
    return render(request, 'orders.html')

def order_detail_page(request, order_id):
    return render(request, 'order_detail.html', {'order_id': order_id})

def login_page(request):
    return render(request, 'login.html')

def register_page(request):
    return render(request, 'register.html')

def profile_page(request):
    return render(request, 'profile.html')

# Admin pages
def admin_dashboard(request):
    return render(request, 'admin/dashboard.html')

def admin_medicines(request):
    return render(request, 'admin/medicines.html')

def admin_categories(request):
    return render(request, 'admin/categories.html')

def admin_orders(request):
    return render(request, 'admin/orders.html')

def admin_users(request):
    return render(request, 'admin/users.html')
