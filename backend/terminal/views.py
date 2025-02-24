# terminal/views.py
import docker
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

client = docker.from_env()

def terminal_view(request):
    return render(request, 'terminal/terminal.html')

@csrf_exempt
def execute_command(request):
    if request.method == 'POST':
        command = request.POST.get('command')
        try:
            container = client.containers.run(
                image='tech-learn-terminal',  # Your Docker image name
                command=command,
                detach=True,
                remove=True,
            )
            output = container.logs().decode('utf-8')
            return JsonResponse({'output': output})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'})
