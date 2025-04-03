# backend/learning/models.py
from pymongo import MongoClient
from django.conf import settings

client = MongoClient(settings.MONGODB_URI)
db = client['tech_learn']

class Lesson:
    collection = db['lessons']

    def __init__(self, title, content, order, section, tier="basic", example_file=None, task_description=None, expected_output=None, lab_instructions=None, required_files=None, 
                 expected_commands=None, validation_script=None, _id=None):
        self.title = title
        self.content = content
        self.order = order
        self.section = section
        self.tier = tier
        self.example_file = example_file
        self.task_description = task_description
        self.expected_output = expected_output
        self._id = _id
        self.lab_instructions = lab_instructions
        self.required_files = required_files or []
        self.expected_commands = expected_commands or []
        self.validation_script = validation_script

    def save(self):
        data = {
            'title': self.title, 'content': self.content, 'order': self.order,
            'section': self.section, 'tier': self.tier, 'example_file': self.example_file,
            'task_description': self.task_description, 'expected_output': self.expected_output,
            'lab_instructions': self.lab_instructions,
            'required_files': self.required_files,
            'expected_commands': self.expected_commands,
            'validation_script': self.validation_script
        }
        if self._id:
            self.collection.update_one({'_id': self._id}, {'$set': data})
        else:
            result = self.collection.insert_one(data)
            self._id = result.inserted_id

    @staticmethod
    def get_all(section=None, tier=None):
        query = {}
        if section:
            query['section'] = section
        if tier:
            query['tier'] = tier
        return [Lesson(l['title'], l['content'], l['order'], l['section'], l['tier'], l.get('example_file'), l.get('task_description'), l.get('expected_output'), l['_id']) for l in Lesson.collection.find(query).sort('order')]

class UserProgress:
    collection = db['user_progress']

    def __init__(self, user_id, lesson_id, completed=False, submitted_files=None, output=None, _id=None):
        self.user_id = user_id
        self.lesson_id = lesson_id
        self.completed = completed
        self.submitted_files = submitted_files or []
        self.output = output
        self._id = _id

    def save(self):
        data = {'user_id': self.user_id, 'lesson_id': self.lesson_id, 'completed': self.completed, 'submitted_files': self.submitted_files, 'output': self.output}
        if self._id:
            self.collection.update_one({'_id': self._id}, {'$set': data})
        else:
            result = self.collection.insert_one(data)
            self._id = result.inserted_id

    @staticmethod
    def get_user_progress(user_id):
        return [UserProgress(p['user_id'], p['lesson_id'], p['completed'], p.get('submitted_files'), p.get('output'), p['_id']) for p in UserProgress.collection.find({'user_id': user_id})]

class Exercise:
    collection = db['exercises']

    def __init__(self, lesson_id, text, options, correct, _id=None):
        self.lesson_id = lesson_id
        self.text = text
        self.options = options
        self.correct = correct
        self._id = _id

    def save(self):
        data = {'lesson_id': self.lesson_id, 'text': self.text, 'options': self.options, 'correct': self.correct}
        if self._id:
            self.collection.update_one({'_id': self._id}, {'$set': data})
        else:
            result = self.collection.insert_one(data)
            self._id = result.inserted_id

    @staticmethod
    def get_by_lesson(lesson_id):
        return [Exercise(e['lesson_id'], e['text'], e['options'], e['correct'], e['_id']) for e in Exercise.collection.find({'lesson_id': lesson_id})]
