from django.urls import path
# from chat.views import chat
from chat.views import ChatView, CustomSetLang

urlpatterns = [
    path('custom-set-lang/', CustomSetLang.as_view(), name='custom_set_lang'),
    path("", ChatView.as_view(), name='chat_home'),
    path('<slug:slug>/', ChatView.as_view(), name="topic" ),
]
