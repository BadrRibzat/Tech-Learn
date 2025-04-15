from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Tech-Learn API",
        default_version='v1',
        description="API for Tech-Learn platform",
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('', include('social_django.urls', namespace='social')),
    path('learning/', include('learning.urls')),
    path('terminal/', include('terminal.urls')),
    path('chatbot/', include('chatbot.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
