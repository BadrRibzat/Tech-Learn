from pymongo import MongoClient
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import uuid

client = MongoClient(settings.MONGODB_URI)
db = client['tech_learn']

class User:
    collection = db['users']

    def __init__(self, username, email, password, token=None, is_active=True, is_admin=False):
        self.username = username
        self.email = email
        self.password = password  # Store plain here, hash in save()
        self.token = token or str(uuid.uuid4())
        self.is_active = is_active
        self.is_admin = is_admin

    def save(self):
        data = {
            'username': self.username,
            'email': self.email,
            'password': make_password(self.password),  # Hash on save
            'token': self.token,
            'is_active': self.is_active,
            'is_admin': self.is_admin
        }
        self.collection.insert_one(data)

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
