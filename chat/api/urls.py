from django.urls import path, include, re_path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
import os

from chat.api.views import (
    TopicList,
    UserDetail,
    SingleTopic,
    AnswerViewSet,
    TagViewSet,
    QuestionViewSet
)

router = DefaultRouter()
router.register("answers", AnswerViewSet)
router.register("tags", TagViewSet)
router.register("questions", QuestionViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="GeoAI API",
        default_version="v1",
        description="API for GeoAI",
    ),
    # url=f"https://{os.environ.get('CODIO_HOSTNAME')}-8000.codio.io/api/v1/",
    url="http://127.0.0.1:8000/api/",
    public=True,
)

urlpatterns = [
    path('topics/', TopicList.as_view(), name='api_topic_list'),
    path('topics/<int:pk>', SingleTopic.as_view(), name='api_single_topic'),
    path('users/<str:email>', UserDetail.as_view(), name='api_user_detail'),
]

urlpatterns += [
    path('auth', include('rest_framework.urls')),
    path('token-auth/', views.obtain_auth_token),
]


urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns += [
    path("auth/", include("rest_framework.urls")),
    path("token-auth/", views.obtain_auth_token),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ), path(
            "swagger/",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
    ),
    path("", include(router.urls)),
    path(
        "topics/by-time/<str:period_name>",
        TopicList.as_view(),
        name="topics-by-time"
    )
]