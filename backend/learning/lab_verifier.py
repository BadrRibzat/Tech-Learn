import docker
import paramiko
from pymongo import MongoClient
from django.conf import settings
import re

class LabVerifier:
    def __init__(self):
        self.client = docker.from_env()
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect('localhost', port=2222, 
                        username='root', password='rootpass', timeout=10)
        self.mongo_client = MongoClient(settings.MONGODB_URI)
        self.db = self.mongo_client['tech_learn']

    def _execute_commands(self, commands):
        channel = self.ssh.get_transport().open_session()
        channel.exec_command(' && '.join(commands))
        
        output = ""
        while not channel.exit_status_ready():
            if channel.recv_ready():
                output += channel.recv(1024).decode('utf-8')
            if channel.recv_stderr_ready():
                output += channel.recv_stderr(1024).decode('utf-8')
        
        exit_code = channel.recv_exit_status()
        return exit_code, output

    def verify_lab(self, user_id: str, lesson_id: str):
        lessons = self.db.lessons
        lesson = lessons.find_one({'_id': lesson_id})
        
        if not lesson:
            return {'error': 'Lesson not found'}

        # Create lab workspace
        lab_dir = f"/home/user/{user_id}/lab_{lesson_id}"
        commands = [
            f"mkdir -p {lab_dir}",
            f"cd {lab_dir}",
            lesson.get('validation_script', 'ls -la')
        ]

        exit_code, output = self._execute_commands(commands)
        
        # Advanced verification
        required_files = lesson.get('required_files', [])
        missing_files = [file for file in required_files if not re.search(rf'\b{file}\b', output)]
        
        expected_commands = lesson.get('expected_commands', [])
        missing_commands = [
            cmd for cmd in expected_commands 
            if not any(cmd in line for line in output.split('\n'))
        ]

        completed = not missing_files and not missing_commands

        return {
            'completed': completed,
            'exit_code': exit_code,
            'output': output,
            'missing_files': missing_files,
            'missing_commands': missing_commands,
            'lab_directory': lab_dir
        }
