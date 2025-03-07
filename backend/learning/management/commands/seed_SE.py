from django.core.management.base import BaseCommand
from learning.models import Lesson
import google.generativeai as genai

class Command(BaseCommand):
    help = 'Seed software engineering lessons using Gemini API covering a comprehensive Software Engineering program'

    def handle(self, *args, **options):
        genai.configure(api_key="AIzaSyCBOOI5YusSiv-bEURr4XeuOfZpYl9MEo4")
        model = genai.GenerativeModel('gemini-1.5-flash')

        lessons = [
            # Introduction to Software Engineering Program
            {
                'title': 'Welcome to Software Engineering',
                'prompt': 'Generate a detailed explanation (300-500 words) introducing a Software Engineering program, its goals (e.g., building practical skills), and key areas (e.g., coding, DevOps, networking). Include an example of a project roadmap. Provide a task to create /intro/goals.txt with three personal learning goals, expecting three lines of text in the output.',
                'order': 1,
                'section': 'intro',
                'tier': 'basic',
            },
            # Command Line Basics
            {
                'title': 'Command Line: Navigation and Files',
                'prompt': 'Generate a detailed explanation (300-500 words) of command line basics, focusing on navigation (cd, ls/dir, pwd) and file operations (mkdir, touch, rm). Include an example creating a directory and file. Provide a task to create /cli/setup.sh making a "projects" directory and "test.txt" file, expecting "dir projects" to list "test.txt" in the output.',
                'order': 1,
                'section': 'command_line',
                'tier': 'basic',
            },
            # Emacs Basics
            {
                'title': 'Emacs: Text Editing Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of Emacs, its role as a text editor, and basic commands (C-x C-f, C-x C-s). Include an example opening and saving a file. Provide a task to create /emacs/hello.txt in Emacs with "Hello Emacs", expecting "Hello Emacs" in the file output.',
                'order': 1,
                'section': 'emacs',
                'tier': 'basic',
            },
            # DevOps Basics
            {
                'title': 'Introduction to DevOps',
                'prompt': 'Generate a detailed explanation (300-500 words) of DevOps, its principles (people, process, products), and its role in continuous delivery. Include an example of a simple Azure DevOps pipeline configuration. Provide a task to create /devops/pipeline.yml defining a basic pipeline that echoes "Build Success", expecting "Build Success" in the output.',
                'order': 1,
                'section': 'devops',
                'tier': 'basic',
            },
            {
                'title': 'Continuous Integration with Azure Pipelines',
                'prompt': 'Generate a detailed explanation (300-500 words) of continuous integration (CI) in DevOps using Azure Pipelines, explaining triggers and steps. Include an example pipeline YAML file. Provide a task to create /devops/ci.yml with a CI pipeline echoing "CI Test", expecting "CI Test" in the output.',
                'order': 2,
                'section': 'devops',
                'tier': 'basic',
            },
            # Docker Basics
            {
                'title': 'Docker: Containers and Images',
                'prompt': 'Generate a detailed explanation (300-500 words) of Docker, containers, images, and basic commands (docker run, docker build). Include an example running an Nginx container. Provide a task to create /docker/run.sh running "nginx:latest" and curling localhost, expecting "Welcome to nginx!" in the output.',
                'order': 1,
                'section': 'docker',
                'tier': 'basic',
            },
            # Git and GitHub Basics
            {
                'title': 'Git Basics: Commits and Repositories',
                'prompt': 'Generate a detailed explanation (300-500 words) of Git basics, focusing on commits, repositories, and commands (git init, git add, git commit). Include an example initializing a repo and committing a file. Provide a task to create /git/repo_init.sh initializing a repo and committing "Hello Git", expecting "Hello Git" in the commit message output.',
                'order': 1,
                'section': 'git',
                'tier': 'basic',
            },
            {
                'title': 'GitHub: Remote Repositories',
                'prompt': 'Generate a detailed explanation (300-500 words) of GitHub, remote repositories, and commands (git push, git pull). Include an example pushing a local repo to GitHub. Provide a task to create /git/push.sh pushing a file "readme.txt" with "Tech-Learn" to a remote repo, expecting "Tech-Learn" in the GitHub file content.',
                'order': 2,
                'section': 'git',
                'tier': 'basic',
            },
            # Introduction to C Programming
            {
                'title': 'Introduction to C Programming',
                'prompt': 'Generate a detailed explanation (300-500 words) introducing C programming, its history, and basic structure (main(), printf). Include an example printing "Hello, C!". Provide a task to create /c/hello.c printing "Welcome to C", expecting "Welcome to C" in the output.',
                'order': 1,
                'section': 'c_programming',
                'tier': 'basic',
            },
            {
                'title': 'C: Variables and Pointers',
                'prompt': 'Generate a detailed explanation (300-500 words) of C programming basics, focusing on variables, data types (int, char), and pointers. Include an example printing a pointer address. Provide a task to create /c/pointer.c printing the address of an int variable, expecting a memory address in the output.',
                'order': 2,
                'section': 'c_programming',
                'tier': 'basic',
            },
            # System Calls Basics
            {
                'title': 'System Calls: Process IDs',
                'prompt': 'Generate a detailed explanation (300-500 words) of system calls in C, focusing on getpid() and getppid() for process IDs. Include an example printing both IDs. Provide a task to create /syscalls/pid.c printing the PID and PPID, expecting numeric IDs in the output.',
                'order': 1,
                'section': 'system_calls',
                'tier': 'basic',
            },
            # Networking Basics
            {
                'title': 'Networking: IP and Ports',
                'prompt': 'Generate a detailed explanation (300-500 words) of networking basics, focusing on IP addresses and ports (TCP/IP). Include an example explaining 127.0.0.1:5000. Provide a task to create /network/ping.sh pinging 127.0.0.1, expecting "64 bytes" or similar in the output.',
                'order': 1,
                'section': 'networking',
                'tier': 'basic',
            },
            # Databases Basics
            {
                'title': 'Databases: Introduction to SQLite',
                'prompt': 'Generate a detailed explanation (300-500 words) of databases, focusing on SQLite, tables, and basic SQL (CREATE, INSERT). Include an example creating a "users" table. Provide a task to create /db/users.sql making a "students" table and inserting "Alice", expecting "Alice" in a SELECT query output.',
                'order': 1,
                'section': 'databases',
                'tier': 'basic',
            },
            # Introduction to Web Servers
            {
                'title': 'Introduction to Web Servers',
                'prompt': 'Generate a detailed explanation (300-500 words) introducing web servers, their purpose (HTTP, serving content), and examples (Nginx, Apache). Include an example of a simple server concept. Provide a task to create /webserver/hello.txt with "Hello Server", expecting "Hello Server" in the file output.',
                'order': 1,
                'section': 'web_servers',
                'tier': 'basic',
            },
            {
                'title': 'Web Servers: Basics and Setup',
                'prompt': 'Generate a detailed explanation (300-500 words) of web servers, their role (e.g., Nginx, Apache), and basic setup. Include an example Nginx config serving "Hello". Provide a task to create /webserver/nginx.conf serving "Tech-Learn", expecting "Tech-Learn" in the response.',
                'order': 2,
                'section': 'web_servers',
                'tier': 'basic',
            },
            # APIs Basics
            {
                'title': 'APIs: REST Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of APIs, focusing on REST principles (GET, POST), and HTTP methods. Include an example of a GET request. Provide a task to create /api/get.sh curling "https://api.example.com/data", expecting a sample JSON response in the output.',
                'order': 1,
                'section': 'apis',
                'tier': 'basic',
            },
            # Debugging Basics
            {
                'title': 'Debugging: Tools and Techniques',
                'prompt': 'Generate a detailed explanation (300-500 words) of debugging basics, tools (gdb, logs), and techniques (checking assumptions). Include an example debugging a C segfault. Provide a task to create /debug/segfault.c with a segfault, expecting a gdb command to identify it in the output.',
                'order': 1,
                'section': 'debugging',
                'tier': 'basic',
            },
        ]

        for lesson in lessons:
            try:
                response = model.generate_content(lesson['prompt'])
                full_content = response.text.strip()
                # Split content into explanation, example, task, and expected output
                parts = full_content.split('\n\n')  # Adjust based on Gemini output structure
                content = '\n\n'.join(parts[:-3]) if len(parts) > 3 else full_content
                example_file = parts[-3] if len(parts) > 2 else ""
                task_desc = parts[-2] if len(parts) > 1 else ""
                expected_output = parts[-1] if parts else ""

                l = Lesson(
                    lesson['title'], content, lesson['order'], lesson['section'], lesson['tier'],
                    example_file, task_desc, expected_output
                )
                l.save()
                self.stdout.write(self.style.SUCCESS(f"Seeded: {lesson['title']}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to seed {lesson['title']}: {str(e)}"))

