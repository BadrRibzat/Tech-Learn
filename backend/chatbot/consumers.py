import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chatbot.utils import get_response

class ChatbotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({"message": "Chatbot connected"}))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get("message", "")
            if message:
                response = get_response(message)
                await self.send(text_data=json.dumps({"message": response}))
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))
