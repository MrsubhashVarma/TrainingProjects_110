from django.contrib import admin
from django.urls import path
from Backend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/', views.get_all_books, name='get_all_books'),
    path('books/add/', views.add_book, name='add_book'),
    path('books/update/<int:book_id>/', views.update_book, name='update_book'),
    path('books/delete/<int:book_id>/', views.delete_book, name='delete_book'),
]
