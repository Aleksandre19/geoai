from django.urls import path
import home.views

urlpatterns = [
    path('', home.views.CustomLoginView.as_view(), name='home'),
]