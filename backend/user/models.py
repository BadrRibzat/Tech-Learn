from pymongo import MongoClient
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import uuid

client = MongoClient(settings.MONGODB_URI)
db = client['tech_learn']

class User:
    collection = db['users']

    def __init__(self, username, email, password=None, token=None, is_active=True, is_admin=False, google_id=None):
        self.username = username
        self.email = email
        self.password = password
        self.token = token or str(uuid.uuid4())
        self.is_active = is_active
        self.is_admin = is_admin
        self.google_id = google_id

    def save(self):
        data = {
            'username': self.username,
            'email': self.email,
            'token': self.token,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'google_id': self.google_id
        }
        if self.password:
            data['password'] = make_password(self.password)
        if self.google_id:
            data['google_id'] = self.google_id
        self.collection.update_one(
            {'email': self.email},
            {'$set': data},
            upsert=True
        )

    @staticmethod
    def find_by_google_id(google_id):
        user_data = User.collection.find_one({'google_id': google_id})
        if user_data:
            return User(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data.get('password'),
                token=user_data.get('token'),
                is_active=user_data['is_active'],
                is_admin=user_data['is_admin'],
                google_id=user_data.get('google_id')
            )
        return None

    @staticmethod
    def find_by_username(username):
        user_data = User.collection.find_one({'username': username})
        if user_data:
            return User(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],  # Already hashed
                token=user_data.get('token'),
                is_active=user_data['is_active'],
                is_admin=user_data['is_admin']
            )
        return None

    @staticmethod
    def find_by_email(email):
        user_data = User.collection.find_one({'email': email})
        if user_data:
            return User(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],  # Already hashed
                token=user_data.get('token'),
                is_active=user_data['is_active'],
                is_admin=user_data['is_admin']
            )
        return None

    @staticmethod
    def find_by_token(token):
        user_data = User.collection.find_one({'token': token})
        if user_data:
            return User(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],
                token=user_data['token'],
                is_active=user_data['is_active'],
                is_admin=user_data['is_admin']
            )
        return None

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
