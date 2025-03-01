from pymongo import MongoClient
from django.conf import settings

class ChatbotResponse:
    @staticmethod
    def get_collection():
        client = MongoClient(settings.MONGODB_URI)
        db = client['tech_learn']
        return db['chatbot_responses']

    @staticmethod
    def load_responses():
        responses = {}
        collection = ChatbotResponse.get_collection()
        for item in collection.find():
            question = item['question'].lower()
            responses[question] = item['response']
        return responses

    @staticmethod
    def upsert_response(question, response):
        collection = ChatbotResponse.get_collection()
        collection.update_one(
            {'question': question},
            {'$set': {'question': question, 'response': response}},
            upsert=True
        )
