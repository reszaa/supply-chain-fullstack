"""
Django settings for pracindo project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv() 

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================================================
# SECURITY & CORE SETTINGS
# =========================================================
# Mengambil variabel dari .env, jika tidak ada pakai nilai default
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-p6999%efa78r9a6=(&d8o#!$dd0&1g6+!#aoz^g9a^zn5#bzzt')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'api.pracindo-marshitek.company',
    'localhost',
    '127.0.0.1',
    'backend' 
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# DAFTAR DOMAIN YANG DIIZINKAN (ANTI ERROR 403 CSRF)
CSRF_TRUSTED_ORIGINS = [
    'https://api.pracindo-marshitek.company',
    'http://api.pracindo-marshitek.company',
    'https://pracindo-marshitek.company',
    'http://pracindo-marshitek.company',
    'http://192.168.1.13:5173',
    'http://192.168.1.13:8000',
    'http://100.113.40.84:5173',
    'http://localhost:5173',
]


CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'https://pracindo-marshitek.company',
    'https://www.pracindo-marshitek.company'
    'http://localhost:5173',
]


# =========================================================
# APPS & MIDDLEWARE
# =========================================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # LIBRARY
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'django_filters',

    # APPS PRACINDO
    'purchaseOrder',
    'salesOrder',
    'staffUser',
    'suplier',
    'customer',
    'stock_gudang',
    'stock_raw',
    'stock_retail',
    'retail_list',
    'tools',
    'docPayment',
    'produksi',
    'logistic',
    'belanja',
    'dompet',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pracindo_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pracindo_backend.wsgi.application'


# =========================================================
# DATABASE
# =========================================================
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}


# =========================================================
# PASSWORD VALIDATION & I18N
# =========================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# =========================================================
# STATIC & MEDIA FILES
# =========================================================
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# =========================================================
# REST FRAMEWORK & JWT
# =========================================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}