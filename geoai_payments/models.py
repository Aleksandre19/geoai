from django.db import models
from django.conf import settings

# Payments model.
class Payments(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    payment_id = models.CharField(max_length=225, default='')
    amount = models.IntegerField()
