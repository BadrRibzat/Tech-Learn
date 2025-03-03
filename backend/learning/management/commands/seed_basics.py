from django.core.management.base import BaseCommand
from learning.models import Lesson
import google.generativeai as genai

class Command(BaseCommand):
    help = 'Seed basic lessons using Gemini API for frontend, backend, API, and Docker'

    def handle(self, *args, **options):
        genai.configure(api_key="AIzaSyCBOOI5YusSiv-bEURr4XeuOfZpYl9MEo4")
        model = genai.GenerativeModel('gemini-1.5-flash')  # Updated model

        lessons = [
            # Frontend Basics
            {
                'title': 'HTML: Tags and Structure',
                'prompt': 'Generate a detailed explanation (300-500 words) of HTML tags (e.g., <h1>, <p>, <div>) and their purpose in structuring web content, including a simple example using at least 3 tags. Provide a task instruction to create a file named /frontend/html_task.html using these tags, and specify an expected output snippet.',
                'order': 1,
                'section': 'frontend',
                'tier': 'basic',
            },
            {
                'title': 'CSS: Styling Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of CSS basics, focusing on selectors and properties (e.g., color, font-size) for styling HTML. Include an example styling an <h1> and <p> tag. Provide a task to create /frontend/css_task.html with styled tags, expecting "color: red" in the output.',
                'order': 2,
                'section': 'frontend',
                'tier': 'basic',
            },
            {
                'title': 'JavaScript: Interactivity',
                'prompt': 'Generate a detailed explanation (300-500 words) of JavaScript basics for interactivity (e.g., console.log, variables). Include a script example logging a message. Provide a task to create /frontend/js_task.html logging "Tech-Learn", expecting that in the output.',
                'order': 3,
                'section': 'frontend',
                'tier': 'basic',
            },
            # Backend Basics
            {
                'title': 'Node.js: Server Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of Node.js for server-side basics, explaining http.createServer(). Include an example responding "Hi". Provide a task to create /backend/server.js responding "Tech-Learn", expecting that output.',
                'order': 1,
                'section': 'backend',
                'tier': 'basic',
            },
            {
                'title': 'Flask: Web Framework',
                'prompt': 'Generate a detailed explanation (300-500 words) of Flask basics, explaining routing (e.g., @app.route). Include an example returning "Hi". Provide a task to create /backend/app.py returning "Tech-Learn", expecting that output.',
                'order': 2,
                'section': 'backend',
                'tier': 'basic',
            },
            {
                'title': 'SQL: Database Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of SQL basics for relational databases (e.g., CREATE TABLE). Include an example creating a table. Provide a task to create /backend/sql_task.sql with a "students" table (id, name), expecting "CREATE TABLE students" in the output.',
                'order': 3,
                'section': 'backend',
                'tier': 'basic',
            },
            {
                'title': 'NoSQL: MongoDB Intro',
                'prompt': 'Generate a detailed explanation (300-500 words) of NoSQL basics with MongoDB (e.g., insertOne). Include an example inserting {"key": "value"}. Provide a task to create /backend/nosql_task.js inserting {"course": "Tech-Learn"}, expecting that in the output.',
                'order': 4,
                'section': 'backend',
                'tier': 'basic',
            },
            # API Basics
            {
                'title': 'API: What and Why',
                'prompt': 'Generate a detailed explanation (300-500 words) of APIs, their purpose (data sharing, scalability), and basic use (e.g., fetch). Include an example fetching and logging text. Provide a task to create /api/fetch_task.js logging "API Test", expecting that output.',
                'order': 1,
                'section': 'api',
                'tier': 'basic',
            },
            # Docker Basics
            {
                'title': 'Docker: Containers Intro',
                'prompt': 'Generate a detailed explanation (300-500 words) of Docker basics (containers, docker run, compose), benefits (consistency, isolation). Include a Dockerfile example echoing "Hi". Provide a task to create /docker/Dockerfile echoing "Tech-Learn", expecting that output.',
                'order': 1,
                'section': 'docker',
                'tier': 'basic',
            },
        ]

        for lesson in lessons:
            try:
                response = model.generate_content(lesson['prompt'])
                full_content = response.text.strip()
                # Split into content, example, task, output (assuming Gemini structures it)
                parts = full_content.split('\n\n')  # Adjust based on Gemini output
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
