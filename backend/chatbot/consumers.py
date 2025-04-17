import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chatbot.utils import get_response

class ChatbotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            "message": "Welcome to Tech-Learn! I'm here to help you explore our platform. Try asking 'What is Tech-Learn?'"
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get("message", "").strip()
            if not message:
                await self.send(text_data=json.dumps({"error": "Empty message"}))
                return

            response = get_response(message)
            await self.send(text_data=json.dumps({"message": response}))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid message format"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"error": f"Error: {str(e)}"}))
