import json
import os
from django.conf import settings

def get_response(message):
    try:
        with open(os.path.join(settings.BASE_DIR, 'chatbot', 'training_data.json'), 'r') as f:
            data = json.load(f)
        
        message = message.lower().strip()
        for intent in data.get('intents', []):
            for pattern in intent.get('patterns', []):
                if pattern.lower() in message:
                    return intent.get('responses', ['Sorry, I didn’t understand that.'])[0]
        return "Sorry, I didn’t understand that."
    except Exception as e:
        return f"Error: {str(e)}"
