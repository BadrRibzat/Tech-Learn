import os
import json
import google.generativeai as genai
from django.conf import settings

def get_response(message):
    try:
        # Load training data if available
        training_data_path = os.path.join(settings.BASE_DIR, 'chatbot', 'training_data.json')
        training_data = {}
        if os.path.exists(training_data_path):
            with open(training_data_path, 'r') as f:
                training_data = json.load(f)

        # Check for exact matches in training data
        for item in training_data.get('intents', []):
            if message.lower() in [p.lower() for p in item.get('patterns', [])]:
                return item.get('response', 'I understood your request, but I need more context.')

        # Fallback to predefined responses
        if message.lower() in ['hi', 'hello', 'hey']:
            return "Hi there! Welcome to Tech-Learn, your platform for mastering software engineering."
        elif 'what is tech learn' in message.lower() or 'tech-learn' in message.lower():
            return ("Tech-Learn is an interactive learning platform designed to teach software engineering "
                    "through hands-on lessons, labs, and a real terminal environment. Want to explore our lessons?")
        elif 'how to sign up' in message.lower() or 'signin' in message.lower():
            return "To sign up or sign in, visit the sign-in page and use your Google account or credentials. Need help getting started?"

        # Use Gemini API for dynamic responses
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = (f"You are a friendly assistant for Tech-Learn, a software engineering learning platform. "
                  f"Respond conversationally to: '{message}'. Keep it concise, under 100 words, and encourage users "
                  f"to explore lessons or the terminal. If unsure, say you need more context.")
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        return f"Sorry, I hit an issue: {str(e)}. Try asking about Tech-Learn or our lessons!"
