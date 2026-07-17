from pathlib import Path
import os
import sys

# Add parent directory to sys.path so Backend is importable as a module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = 'django-insecure-ship-booking-system-key'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'corsheaders',
    'Backend',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'Backend.urls'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
USE_TZ = True
TIME_ZONE = 'UTC'
