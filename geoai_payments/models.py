from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Payments model.
class Payments(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_created=True)
    amount = models.IntegerField(
        validators=(MinValueValidator(0), MaxValueValidator(100)),
        default=50
    )
