from django.urls import path
from . import views

urlpatterns = [
    # Auth API
    path('students/login/', views.login_view, name='login'),

    # Student APIs
    path('students/add/', views.students_list_or_add, name='student_add'),
    path('students/', views.students_list_or_add, name='students_list'),
    path('students/update/<str:pk>/', views.student_detail_update_delete, name='student_update'),
    path('students/delete/<str:pk>/', views.student_detail_update_delete, name='student_delete'),

    # Examination APIs
    path('exams/add/', views.exams_list_or_add, name='exam_add'),
    path('exams/', views.exams_list_or_add, name='exams_list'),
    path('exams/update/<str:pk>/', views.exam_detail_update_delete, name='exam_update'),
    path('exams/delete/<str:pk>/', views.exam_detail_update_delete, name='exam_delete'),

    # Question APIs
    path('questions/add/', views.questions_list_or_add, name='question_add'),
    path('questions/', views.questions_list_or_add, name='questions_list'),
    path('questions/update/<str:pk>/', views.question_detail_update_delete, name='question_update'),
    path('questions/delete/<str:pk>/', views.question_detail_update_delete, name='question_delete'),

    # Exam Submission APIs
    path('submissions/add/', views.submissions_list_or_add, name='submission_add'),
    path('submissions/', views.submissions_list_or_add, name='submissions_list'),
    path('submissions/update/<str:pk>/', views.submission_detail_update_delete, name='submission_update'),
    path('submissions/delete/<str:pk>/', views.submission_detail_update_delete, name='submission_delete'),

    # Result APIs
    path('results/add/', views.results_list_or_add, name='result_add'),
    path('results/', views.results_list_or_add, name='results_list'),
    path('results/update/<str:pk>/', views.result_detail_update_delete, name='result_update'),
    path('results/delete/<str:pk>/', views.result_detail_update_delete, name='result_delete'),
]
