from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from chat.api.views import TopicList, TopicDetail

urlpatterns = [
    path('topics/', TopicList.as_view(), name='api_topic_list'),
    path('topics/<int:pk>', TopicDetail.as_view(), name='api_topic_detail')
]

urlpatterns = format_suffix_patterns(urlpatterns)