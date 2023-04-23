from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken import views

# from chat.api.views import TopicList, TopicDetail, UserDetail
from chat.api.views import TopicList, UserDetail, QuestionsByTopic, AnswerByQuestion, SingleTopic

urlpatterns = [
    path('topics/', TopicList.as_view(), name='api_topic_list'),
    path('topics/<int:pk>', SingleTopic.as_view(), name='api_single_topic'),
    path('users/<str:email>', UserDetail.as_view(), name='api_user_detail'),
    path('question/<int:pk>/', QuestionsByTopic.as_view(), name='api_questions_by_topic'),
    path('answer/<int:pk>/', AnswerByQuestion.as_view(), name='api_answer_by_question')
]

urlpatterns += [
    path('auth', include('rest_framework.urls')),
    path('token-auth/', views.obtain_auth_token),
]


urlpatterns = format_suffix_patterns(urlpatterns)