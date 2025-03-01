import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatbotResponse

class ChatbotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({'message': 'Hello! How can I assist you today?'}))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        user_message = data.get('message', '').strip()
        if user_message:
            response = self.get_response(user_message)
            await self.send(text_data=json.dumps({'message': response}))

    def get_response(self, message):
        responses = ChatbotResponse.load_responses()
        return responses.get(message.lower(), "Sorry, I don’t understand. Try asking something like 'What is Tech-Learn?'")
