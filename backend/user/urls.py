from django.urls import path
from .views import SignupView, SigninView, SignoutView

urlpatterns = [
    path('sign-up/', SignupView.as_view(), name='sign-up'),
    path('sign-in/', SigninView.as_view(), name='sign-in'),
    path('sign-out/', SignoutView.as_view(), name='sign-out'),
]
