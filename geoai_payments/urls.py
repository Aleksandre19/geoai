from django.urls import path
from .views import Checkout, Amount

urlpatterns = [
    path('checkout/<int:amount>/', Checkout.as_view(), name='checkout'),
    path('amount/', Amount.as_view(), name='Amount'),
]
