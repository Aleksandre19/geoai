from django.urls import path
from chat.views import chat

urlpatterns = [
    path("", chat, name='chat_home'),
    path('<slug:slug>/', chat, name="topic" ),
]
