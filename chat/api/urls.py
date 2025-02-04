from django.urls import path, include

from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from chat.api.views import (
    UserDetail,
    TopicViewSet,
    QuestionViewSet,
    UserSettingsViewSet,
)

router = DefaultRouter()
router.register("topics", TopicViewSet)
router.register("questions", QuestionViewSet)
router.register("user_settings", UserSettingsViewSet)

urlpatterns = [
    path('users/<int:id>', UserDetail.as_view(), name='api_user_detail'),
]

urlpatterns += [
    path('auth', include('rest_framework.urls')),
    path('token-auth/', views.obtain_auth_token),
    path("jwt/", TokenObtainPairView.as_view(), name="jwt_obtain_pair"),
    path("jwt/refresh/", TokenRefreshView.as_view(), name="jwt_refresh"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns += [
    path("", include(router.urls))
]