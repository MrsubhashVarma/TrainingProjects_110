from django.urls import path
import views

urlpatterns = [
    path('tasks/', views.get_all_tasks, name='get_all_tasks'),
    path('tasks/add/', views.add_task, name='add_task'),
    path('tasks/update/<str:id>/', views.update_task, name='update_task'),
    path('tasks/delete/<str:id>/', views.delete_task, name='delete_task'),
]
