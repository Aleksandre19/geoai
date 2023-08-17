from django.db import models
from django.conf import settings

# Create your models here.
class UserSetting(models.Model):
    user = models.OneToOneField(
            settings.AUTH_USER_MODEL, 
            on_delete=models.CASCADE,
            related_name='setting'
        )
    light_mode = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} setting"
