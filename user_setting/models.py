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
    mode_style = models.CharField(
        max_length=255, default='/static/geoai/css/pygments_styles/monokai.css')

    def __str__(self):
        return f"{self.user.username} setting"
    

class UserTokens(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='tokens'
    )
    value = models.PositiveIntegerField(default=0, db_index=True)
    used = models.PositiveIntegerField(default=0, db_index=True)
    token_id = models.CharField(max_length=225, default='')


