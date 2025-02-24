# terminal/consumers.py
import json
import os
from channels.generic.websocket import AsyncWebsocketConsumer
import docker
from asgiref.sync import sync_to_async

class TerminalConsumer(AsyncWebsocketConsumer):
    container = None
    
    async def connect(self):
        await self.accept()
        print("WebSocket connected")
        # Start container when connection is established
        await self.start_container()
        
    @sync_to_async
    def start_container(self):
        client = docker.from_env()
        try:
            # Check if container exists
            try:
                self.container = client.containers.get('tech-learn-terminal-instance')
                # Container exists, make sure it's running
                if self.container.status != 'running':
                    self.container.start()
            except docker.errors.NotFound:
                # Create new container
                self.container = client.containers.run(
                    image='tech-learn-terminal',
                    name='tech-learn-terminal-instance',
                    detach=True,
                    tty=True,
                    stdin_open=True,
                    # Mount a volume for persistent data if needed
                    # volumes={'/path/on/host': {'bind': '/home/student/persistent', 'mode': 'rw'}},
                )
            return True
        except Exception as e:
            print(f"Container start error: {e}")
            return False

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")
        # We don't stop the container on disconnect to maintain state
        # between connections, but you could add cleanup logic here

    @sync_to_async
    def execute_command(self, command):
        if not self.container:
            return "Container not available. Please refresh and try again."
        
        try:
            # Execute the command in the running container
            exit_code, output = self.container.exec_run(
                cmd=["/bin/bash", "-c", command],
                stdout=True,
                stderr=True,
                stream=False
            )
            
            result = output.decode('utf-8', errors='replace')
            if exit_code != 0:
                result = f"Command failed with exit code {exit_code}:\n{result}"
                
            return result
        except Exception as e:
            print(f"Command execution error: {e}")
            return str(e)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data.get('command')
            print(f"Received command: {command}")
            
            # Handle special commands
            if command.lower() == 'exit' or command.lower() == 'logout':
                await self.send(text_data=json.dumps({
                    'output': "This is a persistent terminal. You can close the browser tab to disconnect."
                }))
                return
                
            output = await self.execute_command(command)
            await self.send(text_data=json.dumps({
                'output': output if output else 'Command executed with no output'
            }))
        except Exception as e:
            print(f"WebSocket receive error: {e}")
            await self.send(text_data=json.dumps({
                'error': str(e)
            }))
