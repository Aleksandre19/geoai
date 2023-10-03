from django.contrib import admin
from geoai_payments.models import Payments

# Register your models here.
class PaymentsAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'date')

admin.site.register(Payments, PaymentsAdmin)
