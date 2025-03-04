# terminal/consumers.py
import json
import asyncio
import paramiko
from channels.generic.websocket import AsyncWebsocketConsumer

class TerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connected")
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            self.ssh.connect('localhost', port=2222, username='root', password='rootpass', timeout=10)
            self.channel = self.ssh.invoke_shell(term='xterm', width=80, height=24)
            print("SSH connected")
            asyncio.create_task(self.stream_output())
        except Exception as e:
            print(f"SSH error: {e}")
            await self.send(text_data=json.dumps({'error': str(e)}))
            await self.close()

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected: {close_code}")
        if hasattr(self, 'channel') and not self.channel.closed:
            self.channel.close()
        if hasattr(self, 'ssh'):
            self.ssh.close()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data.get('command', '')
            if command and hasattr(self, 'channel') and not self.channel.closed:
                print(f"Received: {command}")
                self.channel.send(command)  # Send raw input to shell
        except json.JSONDecodeError as e:
            print(f"JSON error: {e}")
            await self.send(text_data=json.dumps({'error': f"Invalid input: {e}"}))

    async def stream_output(self):
        print("Streaming output")
        while hasattr(self, 'channel') and not self.channel.closed:
            try:
                if self.channel.recv_ready():
                    output = self.channel.recv(4096).decode('utf-8', errors='replace')
                    if output:
                        print(f"Sending: {output}")
                        await self.send(text_data=json.dumps({'output': output}))
                await asyncio.sleep(0.1)
            except Exception as e:
                print(f"Stream error: {e}")
                await self.send(text_data=json.dumps({'error': str(e)}))
                break
        print("Stream ended")
