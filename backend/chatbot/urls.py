# chatbot/urls.py
from django.urls import path, re_path
from channels.routing import URLRouter
from .routing import websocket_urlpatterns

urlpatterns = [
    # REST endpoints can go here later
    re_path(r'^ws/', URLRouter(websocket_urlpatterns)),  # WebSocket under /chatbot/ws/
]
