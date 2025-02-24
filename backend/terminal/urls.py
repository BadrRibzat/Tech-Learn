# terminal/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.terminal_view, name='terminal_view'),
    path('execute/', views.execute_command, name='execute_command'),
]
