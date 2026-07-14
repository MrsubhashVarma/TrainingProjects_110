from django.urls import path
from . import views

urlpatterns = [
    # Patient APIs
    path('patients/add/', views.add_patient),
    path('patients/', views.list_patients),
    path('patients/update/<int:id>/', views.update_patient),
    path('patients/delete/<int:id>/', views.delete_patient),

    # Doctor APIs
    path('doctors/add/', views.add_doctor),
    path('doctors/', views.list_doctors),
    path('doctors/update/<int:id>/', views.update_doctor),
    path('doctors/delete/<int:id>/', views.delete_doctor),

    # Appointment APIs
    path('appointments/add/', views.add_appointment),
    path('appointments/', views.list_appointments),
    path('appointments/update/<int:id>/', views.update_appointment),
    path('appointments/delete/<int:id>/', views.delete_appointment),

    # Medical Record APIs
    path('records/add/', views.add_record),
    path('records/', views.list_records),
    path('records/update/<int:id>/', views.update_record),
    path('records/delete/<int:id>/', views.delete_record),

    # Billing APIs
    path('bills/add/', views.add_bill),
    path('bills/', views.list_bills),
    path('bills/update/<int:id>/', views.update_bill),
    path('bills/delete/<int:id>/', views.delete_bill),

    # Dashboard API
    path('dashboard/', views.dashboard_stats),
]
