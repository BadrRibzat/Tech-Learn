from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Lesson, UserProgress
from user.models import User
import subprocess

class LessonListView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        tier = 'basic' if not user.is_premium else None  # Premium logic TBD
        lessons = Lesson.get_all(section='frontend', tier=tier)  # Start with frontend
        return Response([{'id': str(l._id), 'title': l.title, 'content': l.content, 'example_file': l.example_file, 'task_description': l.task_description} for l in lessons])

class ProgressView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        progress = UserProgress.get_user_progress(user.token)
        return Response([{'lesson_id': str(p.lesson_id), 'completed': p.completed, 'output': p.output} for p in progress])

    def post(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        lesson_id = request.data.get('lesson_id')
        lesson = next((l for l in Lesson.get_all() if str(l._id) == lesson_id), None)
        if not lesson:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Execute in user's Docker terminal (pseudo-code, needs Docker setup)
        file_path = lesson.task_description.split(' ')[1]  # e.g., "/portfolio/index.html"
        try:
            output = subprocess.check_output(['docker', 'exec', f'user-{user.token}-terminal', 'cat', file_path], text=True)
            completed = output.strip().startswith(lesson.expected_output)
            progress = UserProgress(user.token, lesson_id, completed, [file_path], output)
            progress.save()
            return Response({'message': 'Task checked', 'completed': completed, 'output': output}, status=status.HTTP_201_CREATED)
        except subprocess.CalledProcessError as e:
            return Response({'error': 'Execution failed', 'output': e.output}, status=status.HTTP_400_BAD_REQUEST)
