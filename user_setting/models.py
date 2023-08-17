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
    mode_style = models.CharField(max_length=255, default='geoai/css/pygments_styles/sas.css')

    def __str__(self):
        return f"{self.user.username} setting"
