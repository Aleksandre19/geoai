from django.urls import path
from chat.views import chat, topic

urlpatterns = [
    path("", chat),
    path('topic/<slug>/', topic, name="topic" ),
]
