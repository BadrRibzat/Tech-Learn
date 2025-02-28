from pymongo import MongoClient
from django.conf import settings

client = MongoClient(settings.MONGODB_URI)
db = client['tech_learn']

class User:
    collection = db['users']

    def __init__(self, username, email, password, is_active=True, is_admin=False):
        self.username = username
        self.email = email
        self.password = password  # Store hashed in practice
        self.is_active = is_active
        self.is_admin = is_admin

    def save(self):
        data = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
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
                password=user_data['password'],
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
                password=user_data['password'],
                is_active=user_data['is_active'],
                is_admin=user_data['is_admin']
            )
        return None
