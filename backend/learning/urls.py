# backend/learning/urls.py
from django.urls import path
from .views import LessonListView, ProgressView, ExerciseListView, CheckAnswerView

urlpatterns = [
    path('lessons/', LessonListView.as_view(), name='lesson-list'),
    path('progress/', ProgressView.as_view(), name='progress'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
    path('check-answer/', CheckAnswerView.as_view(), name='check-answer'),
]
