"""
Django settings for geoai project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from configurations import Configuration, values
import dj_database_url
from datetime import timedelta
import os

class Dev(Configuration):
    # Build paths inside the project like this: BASE_DIR / 'subdir'.
    BASE_DIR = Path(__file__).resolve().parent.parent


    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

    # SECURITY WARNING: keep the secret key used in production secret!
    SECRET_KEY = 'django-insecure-ddkw2q6*36=3wdvd@gxkyf(tek88$a0)tr0a$d=x+ups+j)j^b'

    # SECURITY WARNING: don't run with debug turned on in production!
    DEBUG = values.BooleanValue(True)

    ALLOWED_HOSTS = values.ListValue(['localhost', '127.0.0.1'])

    AUTH_USER_MODEL = 'geoai_auth.User'

    OPENAI_API_KEY = ''
    STRIPE_PUBLIC_KEY = ''
    STRIPE_SECRET_KEY = ''
    STRIPE_WH_SECRET = ''
    STRIPE_CURRENCY = 'gel'

    OPENAI_DEFAULT_MODEL = 'gpt-3.5-turbo'
    OPENAI_DEFAULT_PROMPT = 'You are a helpful assistant.'
    OPENAI_DEFAULT_MODEL_TOKENS = 4097
    USER_DEFAULT_TOKENS = 1200
    TOKEN_PRICE = 0.0004

    # Application definition
    INSTALLED_APPS = [
        'daphne',
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.sites',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'allauth',
        'allauth.account',
        'allauth.socialaccount',
        'allauth.socialaccount.providers.google',
        'geoai_auth',
        'chat',
        # 'debug_toolbar',
        'home',
        'rest_framework',
        'rest_framework.authtoken',
        'drf_yasg',
        'django_filters',
        'versatileimagefield',
        'geoai_openai',
        'geoai_translator',
        'channels',
        'user_setting',
        'geoai_payments',
    ]

    PASSWORD_HASHERS = [
        'django.contrib.auth.hashers.Argon2PasswordHasher',
        'django.contrib.auth.hashers.PBKDF2PasswordHasher',
        'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
        'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    ]

    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
            'LOCATION': '127.0.0.1:11211',
        }
    }

    REST_FRAMEWORK = {
        "DEFAULT_AUTHENTICATION_CLASSES": [
            "rest_framework.authentication.BasicAuthentication",
            "rest_framework.authentication.SessionAuthentication",
            "rest_framework.authentication.TokenAuthentication",
            "rest_framework_simplejwt.authentication.JWTAuthentication",
        ],
        "DEFAULT_PERMISSION_CLASSES": [
            "rest_framework.permissions.IsAuthenticated"
        ],
        "DEFAULT_THROTTLE_CLASSES": [
            "chat.api.throttling.AnonSustainedThrottle",
            "chat.api.throttling.AnonBurstThrottle",
            "chat.api.throttling.UserSustainedThrottle",
            "chat.api.throttling.UserBurstThrottle",          
        ],
        "DEFAULT_THROTTLE_RATES": {
            "anon_sustained": "10/day",
            "anon_burst": "10/hour",
            "user_sustained": "5000/day",
            "user_burst": "60/minute",
        },
        "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
        "PAGE_SIZE" : 100,
        "DEFAULT_FILTER_BACKENDS": [
            "django_filters.rest_framework.DjangoFilterBackend",
            "rest_framework.filters.OrderingFilter"
        ]
    }

    SIMPLE_JWT = {
        "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
        "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    }

    SWAGGER_SETTINGS = {
        "SECURITY_DEFINITIONS": {
            "Token": {"type": "apiKey", "name": "Authorization",
        "in": "header"},
            "Basic": {"type": "basic"},
        } 
    }


    INTERNAL_IPS = '127.0.0.1'

    MIDDLEWARE = [
        # 'debug_toolbar.middleware.DebugToolbarMiddleware',
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.locale.LocaleMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
        'user_setting.signals.RequestMiddleware',
        # 'chat.middlewares.JwtMiddleware',
    ]


    ROOT_URLCONF = 'geoai.urls'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [
                BASE_DIR / 'templates',
                BASE_DIR / 'geoai_auth'  / 'templates' / 'allauth',
            ],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'geoai.wsgi.application'
    ASGI_APPLICATION = 'geoai.asgi.application'

    # CHANNEL_LAYERS = {
    #     "default": {
    #         "BACKEND": "channels_redis.core.RedisChannelLayer",
    #         "CONFIG": {
    #             "hosts": [("127.0.0.1", 6379)],
    #         },
    #     },
    # }

    # Database
    # https://docs.djangoproject.com/en/4.2/ref/settings/#databases

    DATABASES = {
        "default": dj_database_url.config(default=f"sqlite:///{BASE_DIR}/db.sqlite3"),
        "alternative": dj_database_url.config(
            "ALTERNATIVE_DATABASE_URL",
            default=f"sqlite:///{BASE_DIR}/alternative_db.sqlite3",
        ),
    }


    # Password validation
    # https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]


    # Internationalization
    # https://docs.djangoproject.com/en/4.2/topics/i18n/


    # Internationalize settings.
    LANGUAGE_CODE = 'en-us'
    # LANGUAGE_CODE = 'ka'

    USE_I18N = True

    USE_L10N = True
    
    LANGUAGES = [
        ('en-us', 'English'),
        ('ka', 'Georgian'),
        # ('ru', 'Russian'),
        # ('es', 'Spanish'),
    ]

    DEFAULT_INTERFACE_LANG = 'en'

    LOCALE_PATHS = [
        os.path.join(BASE_DIR, 'locale'),
    ]

    # "Plural-Forms: nplurals=2; plural=(n!=1);\n"
    
    TIME_ZONE = values.Value('UTC')

    USE_TZ = True


    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/4.2/howto/static-files/

    MEDIA_ROOT = BASE_DIR / 'geoai/media'
    MEDIA_URL = '/media/'

    STATIC_URL = 'static/'
    STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)

    # Default primary key field type
    # https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

    DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

    # django-allauth
    SITE_ID = 1
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    LOGIN_REDIRECT_URL = '/chat/'
    ACCOUNT_USER_MODEL_USERNAME_FIELD = None
    ACCOUNT_EMAIL_REQUIRED = True
    ACCOUNT_USERNAME_REQUIRED = False
    ACCOUNT_AUTHENTICATION_METHOD = "email"

    # LOGGING = {
    #     "version": 1,
    #     "disable_existing_loggers": False,
    #     "formatters": {
    #         "verbose": {
    #             "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
    #             "style": "{",
    #         },
    #     },
    #     "handlers": {
    #         "console": {
    #             "class": "logging.StreamHandler",
    #             "stream": "ext://sys.stdout",
    #             "formatter": "verbose",
    #         }
    #     },
    #     "root": {
    #         "handlers": ["console"],
    #         "level": "DEBUG",
    #     },
    # }

class Prod(Dev):
    DEBUG = False
    SECRET_KEY = values.SecretValue()
