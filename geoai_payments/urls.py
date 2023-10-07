from django.urls import path
from .views import Checkout, Amount, CacheCheckoutData
from geoai_payments.webhooks import Webhook

urlpatterns = [
    path('checkout/<int:amount>/', Checkout.as_view(), name='checkout'),
    path('amount/', Amount.as_view(), name='Amount'),
    path('wh/', Webhook.as_view(), name='webhook'),
    path('cache-checkout-data/', CacheCheckoutData.as_view(), name='cache-checkout-data'),
]
