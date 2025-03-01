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
        message_lower = message.lower()
        # Exact match first
        if message_lower in responses:
            return responses[message_lower]
        # Handle variations with more friendliness
        if 'tech-learn' in message_lower or 'tech learn' in message_lower:
            return responses.get('what is tech-learn', "Tech-Learn is your go-to platform for mastering coding and sysadmin stuff—like our cool terminal!")
        if 'who' in message_lower and 'you' in message_lower:
            return responses.get('who are you', "Hey! I’m your Tech-Learn buddy, here to make learning fun and easy!")
        if 'hi' in message_lower or 'hello' in message_lower:
            return responses.get('hi', "Hi there! Ready to dive into some learning fun?")
        return "Hmm, I’m not sure about that one! Try 'hi', 'what is Tech-Learn', or 'how do I use the terminal'—I’ll do my best to help!"
