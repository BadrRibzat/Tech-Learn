from django.core.management.base import BaseCommand
from chatbot.models import ChatbotResponse
import json

class Command(BaseCommand):
    help = 'Train the chatbot with response data from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file with training data')

    def handle(self, *args, **options):
        json_file = options['json_file']
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
                for item in data:
                    question = item.get('question')
                    response = item.get('response')
                    if question and response:
                        ChatbotResponse.upsert_response(question, response)
                        self.stdout.write(self.style.SUCCESS(f"Added: {question} -> {response}"))
                    else:
                        self.stdout.write(self.style.WARNING(f"Skipping invalid entry: {item}"))
            self.stdout.write(self.style.SUCCESS("Chatbot training completed successfully"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {json_file} not found"))
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Invalid JSON format in file"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
