from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken import views

from chat.api.views import TopicList, TopicDetail

urlpatterns = [
    path('topics/', TopicList.as_view(), name='api_topic_list'),
    path('topics/<int:pk>', TopicDetail.as_view(), name='api_topic_detail')
]

urlpatterns += [
    path('auth', include('rest_framework.urls')),
    path('token-auth/', views.obtain_auth_token),
]


urlpatterns = format_suffix_patterns(urlpatterns)