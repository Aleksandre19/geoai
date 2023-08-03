from django.urls import path
# from chat.views import chat
from chat.views import ChatView

urlpatterns = [
    path("", ChatView.as_view(), name='chat_home'),
    path('<slug:slug>/', ChatView.as_view(), name="topic" ),
]
