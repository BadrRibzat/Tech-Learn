# backend/learning/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Lesson, UserProgress, Exercise
from .lab_verifier import LabVerifier
from user.models import User
import subprocess

class LessonListView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        tier = 'basic' if not getattr(user, 'is_premium', False) else None
        lessons = Lesson.get_all(tier=tier)
        return Response([{
            'id': str(l._id), 'title': l.title, 'content': l.content,
            'example_file': l.example_file, 'task_description': l.task_description
        } for l in lessons])

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
        
        file_path = lesson.task_description.split(' ')[1]
        try:
            output = subprocess.check_output(['docker', 'exec', 'ubuntu-server', 'cat', file_path], text=True)
            completed = output.strip().startswith(lesson.expected_output)
            progress = UserProgress(user.token, lesson_id, completed, [file_path], output)
            progress.save()
            return Response({'message': 'Task checked', 'completed': completed, 'output': output}, status=status.HTTP_201_CREATED)
        except subprocess.CalledProcessError as e:
            return Response({'error': 'Execution failed', 'output': e.output}, status=status.HTTP_400_BAD_REQUEST)

class ExerciseListView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        lesson_id = request.GET.get('lesson_id')
        if not lesson_id:
            return Response({'error': 'Lesson ID required'}, status=status.HTTP_400_BAD_REQUEST)
        exercises = Exercise.get_by_lesson(lesson_id)
        return Response([{
            'id': str(e._id), 'text': e.text, 'options': e.options
        } for e in exercises])

class LabVerificationView(APIView):
    def post(self, request, lesson_id):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        verifier = LabVerifier()
        result = verifier.verify_lab(str(user.token), lesson_id)
        
        # Save progress
        progress = UserProgress(
            user_id=str(user.token),
            lesson_id=lesson_id,
            completed=result['completed'],
            output=result['output']
        )
        progress.save()

        return Response(result)

class CheckAnswerView(APIView):
    def post(self, request):
        token = request.headers.get('Authorization', '').replace('Token ', '')
        user = User.find_by_token(token)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        question_id = request.data.get('questionId')
        user_answer = request.data.get('answer')
        exercise = next((e for e in Exercise.get_by_lesson(request.data.get('lesson_id', '')) if str(e._id) == question_id), None)
        if not exercise:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        correct = user_answer == exercise.correct
        return Response({'correct': correct})
