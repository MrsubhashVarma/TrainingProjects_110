from django.urls import path
from . import views

urlpatterns = [
    # Root API welcome endpoint
    path('', views.api_root, name='api_root'),

    # Passenger Endpoints
    path('passengers/add/', views.passenger_add, name='passenger_add'),
    path('passengers/', views.passenger_list, name='passenger_list'),
    path('passengers/update/<int:pk>/', views.passenger_update, name='passenger_update'),
    path('passengers/delete/<int:pk>/', views.passenger_delete, name='passenger_delete'),

    # Ship Endpoints
    path('ships/add/', views.ship_add, name='ship_add'),
    path('ships/', views.ship_list, name='ship_list'),
    path('ships/update/<int:pk>/', views.ship_update, name='ship_update'),
    path('ships/delete/<int:pk>/', views.ship_delete, name='ship_delete'),

    # Schedule Endpoints
    path('schedules/add/', views.schedule_add, name='schedule_add'),
    path('schedules/', views.schedule_list, name='schedule_list'),
    path('schedules/update/<int:pk>/', views.schedule_update, name='schedule_update'),
    path('schedules/delete/<int:pk>/', views.schedule_delete, name='schedule_delete'),

    # Booking Endpoints
    path('bookings/add/', views.booking_add, name='booking_add'),
    path('bookings/', views.booking_list, name='booking_list'),
    path('bookings/update/<int:pk>/', views.booking_update, name='booking_update'),
    path('bookings/delete/<int:pk>/', views.booking_delete, name='booking_delete'),

    # Payment Endpoints
    path('payments/add/', views.payment_add, name='payment_add'),
    path('payments/', views.payment_list, name='payment_list'),
    path('payments/update/<int:pk>/', views.payment_update, name='payment_update'),
    path('payments/delete/<int:pk>/', views.payment_delete, name='payment_delete'),
]
