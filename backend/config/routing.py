# config/routing.py
from django.urls import path
from terminal.consumers import TerminalConsumer

websocket_urlpatterns = [
    path('ws/terminal/', TerminalConsumer.as_asgi()),
]
