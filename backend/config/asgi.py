# config/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from terminal.routing import websocket_urlpatterns as terminal_patterns
from chatbot.routing import websocket_urlpatterns as chatbot_patterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Combine patterns explicitly
websocket_urlpatterns = terminal_patterns + chatbot_patterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
