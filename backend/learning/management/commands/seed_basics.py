from django.core.management.base import BaseCommand
from learning.models import Lesson, Exercise
import google.generativeai as genai
from django.conf import settings
from pymongo import MongoClient
import random
import time
import traceback

class Command(BaseCommand):
    help = 'Seed basic lessons and exercises using Gemini API for frontend, backend, API, and Docker with 10 labs'

    def generate_lab_prompt(self, category, lab_number):
        categories = {
            'frontend': {
                'topics': ['HTML', 'CSS', 'JavaScript'],
                'tasks': ['Create component', 'Implement validation', 'Style layout']
            },
            'backend': {
                'topics': ['Node.js', 'Python', 'Database'],
                'tasks': ['Create API endpoint', 'Implement middleware', 'Optimize query']
            },
            'devops': {
                'topics': ['Docker', 'CI/CD', 'Infrastructure'],
                'tasks': ['Create Dockerfile', 'Implement pipeline', 'Configure monitoring']
            }
        }

        cat = category.lower()
        topic = random.choice(categories[cat]['topics'])
        task = random.choice(categories[cat]['tasks'])

        return f"""
        Generate a lab exercise for {topic} focusing on {task}. You must strictly follow this format and include all sections:
        
        INSTRUCTIONS:
        [Provide detailed step-by-step instructions for terminal operations to complete the task.]

        FILES:
        [List exactly 3 files to create, separated by commas, e.g., file1.js, file2.css, file3.html]

        COMMANDS:
        [List exactly 2 terminal commands to execute, separated by commas, e.g., npm install, node server.js]

        VALIDATION:
        [Provide a script or steps to verify the task completion, e.g., a bash script or manual check.]

        EXAMPLE:
        [Provide a complete example solution, e.g., code snippets for all files.]

        Ensure each section starts with its exact label (e.g., "INSTRUCTIONS:") followed by content. Do not deviate from this structure or omit any section.
        """

    def handle(self, *args, **options):
        # Configure Gemini with API key from .env
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Clear existing data
        client = MongoClient(settings.MONGODB_URI)
        db = client['tech_learn']
        db.lessons.drop()
        db.exercises.drop()
        self.stdout.write(self.style.SUCCESS("Cleared existing lessons and exercises"))

        lessons = [
            # Frontend Basics
            {
                'title': 'HTML: Tags and Structure',
                'prompt': 'Generate a detailed explanation (300-500 words) of HTML tags (e.g., <h1>, <p>, <div>) and their purpose in structuring web content, including a simple example using at least 3 tags. Provide a task instruction to create a file named /frontend/html_task.html using these tags, and specify an expected output snippet.',
                'order': 1,
                'section': 'frontend',
                'tier': 'basic',
                'exercises': [
                    {
                        'text': 'What does HTML stand for?',
                        'options': [
                            'Hot Typing Markup Language',
                            'Home Typing Modern Language',
                            'Hyper Text Markup Language',
                            'Home Testing Mixed Language'
                        ],
                        'correct': 'Hyper Text Markup Language'
                    },
                    {
                        'text': 'Which one of the following headers has the correct HTML syntax?',
                        'options': [
                            '<h1>Welcome</h1>',
                            '{{h1}}Welcome{{:h1}}',
                            '{h1:Welcome}'
                        ],
                        'correct': '<h1>Welcome</h1>'
                    }
                ]
            },
            {
                'title': 'CSS: Styling Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of CSS basics, focusing on selectors and properties (e.g., color, font-size) for styling HTML. Include an example styling an <h1> and <p> tag. Provide a task to create /frontend/css_task.html with styled tags, expecting "color: red" in the output.',
                'order': 2,
                'section': 'frontend',
                'tier': 'basic',
                'exercises': []
            },
            {
                'title': 'JavaScript: Interactivity',
                'prompt': 'Generate a detailed explanation (300-500 words) of JavaScript basics for interactivity (e.g., console.log, variables). Include a script example logging a message. Provide a task to create /frontend/js_task.html logging "Tech-Learn", expecting that in the output.',
                'order': 3,
                'section': 'frontend',
                'tier': 'basic',
                'exercises': []
            },
            # Backend Basics
            {
                'title': 'Node.js: Server Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of Node.js for server-side basics, explaining http.createServer(). Include an example responding "Hi". Provide a task to create /backend/server.js responding "Tech-Learn", expecting that output.',
                'order': 1,
                'section': 'backend',
                'tier': 'basic',
                'exercises': []
            },
            {
                'title': 'Flask: Web Framework',
                'prompt': 'Generate a detailed explanation (300-500 words) of Flask basics, explaining routing (e.g., @app.route). Include an example returning "Hi". Provide a task to create /backend/app.py returning "Tech-Learn", expecting that output.',
                'order': 2,
                'section': 'backend',
                'tier': 'basic',
                'exercises': []
            },
            {
                'title': 'SQL: Database Basics',
                'prompt': 'Generate a detailed explanation (300-500 words) of SQL basics for relational databases (e.g., CREATE TABLE). Include an example creating a table. Provide a task to create /backend/sql_task.sql with a "students" table (id, name), expecting "CREATE TABLE students" in the output.',
                'order': 3,
                'section': 'backend',
                'tier': 'basic',
                'exercises': []
            },
            {
                'title': 'NoSQL: MongoDB Intro',
                'prompt': 'Generate a detailed explanation (300-500 words) of NoSQL basics with MongoDB (e.g., insertOne). Include an example inserting {"key": "value"}. Provide a task to create /backend/nosql_task.js inserting {"course": "Tech-Learn"}, expecting that in the output.',
                'order': 4,
                'section': 'backend',
                'tier': 'basic',
                'exercises': []
            },
            # API Basics
            {
                'title': 'API: What and Why',
                'prompt': 'Generate a detailed explanation (300-500 words) of APIs, their purpose (data sharing, scalability), and basic use (e.g., fetch). Include an example fetching and logging text. Provide a task to create /api/fetch_task.js logging "API Test", expecting that output.',
                'order': 1,
                'section': 'api',
                'tier': 'basic',
                'exercises': []
            },
            # Docker Basics
            {
                'title': 'Docker: Containers Intro',
                'prompt': 'Generate a detailed explanation (300-500 words) of Docker basics (containers, docker run, compose), benefits (consistency, isolation). Include a Dockerfile example echoing "Hi". Provide a task to create /docker/Dockerfile echoing "Tech-Learn", expecting that output.',
                'order': 1,
                'section': 'docker',
                'tier': 'basic',
                'exercises': []
            },
        ]

        for lesson in lessons:
            try:
                response = model.generate_content(lesson['prompt'])
                full_content = response.text.strip()
                parts = full_content.split('\n\n')
                content = '\n\n'.join(parts[:-3]) if len(parts) > 3 else full_content
                example_file = parts[-3] if len(parts) > 2 else ""
                task_desc = parts[-2] if len(parts) > 1 else ""
                expected_output = parts[-1] if parts else ""

                l = Lesson(
                    lesson['title'], content, lesson['order'], lesson['section'], lesson['tier'],
                    example_file, task_desc, expected_output
                )
                l.save()
                self.stdout.write(self.style.SUCCESS(f"Seeded lesson: {lesson['title']}"))

                # Seed exercises for this lesson
                for ex in lesson.get('exercises', []):
                    exercise = Exercise(
                        lesson_id=str(l._id),
                        text=ex['text'],
                        options=ex['options'],
                        correct=ex['correct']
                    )
                    exercise.save()
                    self.stdout.write(self.style.SUCCESS(f"Seeded exercise: {ex['text']} for {lesson['title']}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to seed {lesson['title']}: {str(e)}"))

        # Generate 10 labs
        lab_categories = ['frontend', 'backend', 'devops']
        for i in range(1, 11):
            category = lab_categories[i % 3]
            lab_prompt = self.generate_lab_prompt(category, i)

            try:
                time.sleep(1)  # Rate limit protection
                response = model.generate_content(lab_prompt)
                if not response or not hasattr(response, 'text'):
                    self.stdout.write(self.style.WARNING(f"Skipping lab {i}: Invalid response from Gemini API"))
                    continue
                content = response.text.strip()

                # Validate response
                required_sections = ['INSTRUCTIONS:', 'FILES:', 'COMMANDS:', 'VALIDATION:', 'EXAMPLE:']
                if not all(section in content for section in required_sections):
                    self.stdout.write(self.style.WARNING(f"Skipping lab {i}: Response missing sections - {content[:100]}..."))
                    continue

                # Parse response
                sections = {key: '' for key in ['INSTRUCTIONS', 'FILES', 'COMMANDS', 'VALIDATION', 'EXAMPLE']}
                current_section = None
                for line in content.split('\n'):
                    line = line.strip()
                    if not line:
                        continue
                    if line.startswith('INSTRUCTIONS:'):
                        current_section = 'INSTRUCTIONS'
                    elif line.startswith('FILES:'):
                        current_section = 'FILES'
                    elif line.startswith('COMMANDS:'):
                        current_section = 'COMMANDS'
                    elif line.startswith('VALIDATION:'):
                        current_section = 'VALIDATION'
                    elif line.startswith('EXAMPLE:'):
                        current_section = 'EXAMPLE'
                    elif current_section:
                        if current_section == 'FILES':
                            sections['FILES'] = [f.strip() for f in line.split(',') if f.strip()]
                        elif current_section == 'COMMANDS':
                            sections['COMMANDS'] = [c.strip() for c in line.split(',') if c.strip()]
                        else:
                            sections[current_section] += line + '\n'

                # Ensure all sections have content
                if not all(sections.values()):
                    self.stdout.write(self.style.WARNING(f"Skipping lab {i}: Incomplete sections"))
                    continue

                lab = Lesson(
                    title=f"Lab {i}: {category.capitalize()} Practice",
                    content=sections['INSTRUCTIONS'].strip(),
                    order=i + 100,
                    section=category,
                    tier='basic',
                    lab_instructions=sections['INSTRUCTIONS'].strip(),
                    required_files=sections['FILES'],
                    expected_commands=sections['COMMANDS'],
                    validation_script=sections['VALIDATION'].strip(),
                    example_file=sections['EXAMPLE'].strip()
                )
                lab.save()
                self.stdout.write(self.style.SUCCESS(f"Created lab {i} in {category}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed lab {i}: {str(e)}\n{traceback.format_exc()}"))

