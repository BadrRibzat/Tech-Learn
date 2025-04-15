from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from social_django.utils import psa
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
@psa('social:complete')
def google_login(request, backend):
    user = request.user
    if user.is_authenticated:
        social_user = user.social_auth.get(provider='google-oauth2')
        existing_user = User.find_by_google_id(social_user.uid)
        if not existing_user:
            existing_user = User(
                username=user.username or social_user.extra_data['email'].split('@')[0],
                email=social_user.extra_data['email'],
                google_id=social_user.uid
            )
            existing_user.save()
        return Response({'token': existing_user.token}, status=status.HTTP_200_OK)
    return Response({'error': 'Authentication failed'}, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            if User.find_by_username(username) or User.find_by_email(email):
                return Response({'error': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save()
            return Response({'token': user.token}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SigninView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.find_by_email(email)
        if user and user.check_password(password):  # Check hashed password
            return Response({'token': user.token}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SignoutView(APIView):
    def post(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            user = User.find_by_token(token_key)
            if user:
                # Optionally regenerate token or mark as inactive in MongoDB
                return Response({'message': 'Signed out successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Authentication token required'}, status=status.HTTP_401_UNAUTHORIZED)
