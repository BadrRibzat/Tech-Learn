# terminal/consumers.py
import json
import asyncio
import paramiko
from channels.generic.websocket import AsyncWebsocketConsumer

class TerminalConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ssh_client = None
        self.ssh_channel = None

    async def connect(self):
        await self.accept()
        print("WebSocket connected to client")
        await self.start_ssh()

    async def start_ssh(self):
        self.ssh_client = paramiko.SSHClient()
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            print("Attempting SSH connection")
            self.ssh_client.connect(
                hostname='localhost',
                port=2222,
                username='student',
                password='studentpass',
                look_for_keys=False
            )
            self.ssh_channel = self.ssh_client.invoke_shell(term='xterm')
            print("SSH connection established")
            await self.send(text_data=json.dumps({'output': 'Connected to Ubuntu Server\n'}))
            asyncio.create_task(self.stream_output())
        except Exception as e:
            print(f"SSH connection error: {e}")
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")
        if self.ssh_channel:
            self.ssh_channel.close()
        if self.ssh_client:
            self.ssh_client.close()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data.get('command')
            print(f"Received: {command}")
            if self.ssh_channel and not self.ssh_channel.closed:
                self.ssh_channel.send(command)
            else:
                await self.send(text_data=json.dumps({'error': 'Not connected'}))
        except Exception as e:
            print(f"Receive error: {e}")
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def stream_output(self):
        while self.ssh_channel and not self.ssh_channel.closed:
            if self.ssh_channel.recv_ready():
                output = self.ssh_channel.recv(4096).decode('utf-8', errors='replace')
                if output:
                    await self.send(text_data=json.dumps({'output': output}))
            await asyncio.sleep(0.1)  # Avoid tight loop
