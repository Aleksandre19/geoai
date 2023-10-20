from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from threading import local

from geoai_auth.models import User
from user_setting.models import UserTokens, UserSetting

# Instantiate thread-local storage.
_request_local = local()

class RequestMiddleware:
    """
    This class is a custom middleware designed to capture the request object 
    from the current thread and use it in the signal, as it is not 
    directly accessible within the signals.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _request_local.current_request = request
        response = self.get_response(request)
        return response


@receiver(post_save, sender=User)
def set_default_tokens(sender, instance, created, **kwargs):
    """
    This is a signal function that executes when a new user is created.
    It sets the default token for the user, sets the language, and finally creates
    a user setting object.
    """
    if created:
        # Set default tokens to the new user.
        UserTokens.objects.create(
            user=instance, value=settings.USER_DEFAULT_TOKENS)
        
        # Default language.
        lang = settings.DEFAULT_INTERFACE_LANG

        # Grab the request from the custom middleware (RequestMiddleware).
        request = getattr(_request_local, 'current_request', None)

        # Grab the django language from the cookies.
        if request:
            lang = request.COOKIES.get('django_language', None)

        # Settings for new user.
        UserSetting.objects.create(
                user=instance,
                chat_lang=lang,
                interface_lang=lang
            )