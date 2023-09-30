from django.urls import path
from .views import GeoAIPayments 

urlpatterns = [
    path('', GeoAIPayments.as_view(), name='checkout'),
]
