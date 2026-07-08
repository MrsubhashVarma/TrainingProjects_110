from django.contrib import admin
from django.urls import path
from Backend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('participants/', views.get_all_participants, name='get_all_participants'),
    path('participants/add/', views.add_participant, name='add_participant'),
    path('participants/update/<int:participant_id>/', views.update_participant, name='update_participant'),
    path('participants/delete/<int:participant_id>/', views.delete_participant, name='delete_participant'),
]
