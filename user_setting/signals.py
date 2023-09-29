from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from geoai_auth.models import User
from user_setting.models import UserTokens, UserSetting

@receiver(post_save, sender=User)
def set_default_tokens(sender, instance, created, **kwargs):

    if created:
        # Set default tokens to the new user.
        UserTokens.objects.create(
            user=instance, value=settings.USER_DEFAULT_TOKENS)      
        # Settings for new user.
        UserSetting.objects.create(user=instance)