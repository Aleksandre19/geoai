from django.urls import path
from chat.views import chat, single_subject

urlpatterns = [
    path("", chat),
    path('single_subject/<slug>/', single_subject, name="single_subject" ),
]
