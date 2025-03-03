from django.urls import path
from .views import LessonListView, ProgressView

urlpatterns = [
    path('lessons/', LessonListView.as_view(), name='lesson-list'),
    path('progress/', ProgressView.as_view(), name='progress'),
]
