from django.urls import path
from .consumers import ChatbotConsumer

websocket_urlpatterns = [
    path('', ChatbotConsumer.as_asgi()),
]
