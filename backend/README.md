# Tech-Learn Backend

This is the backend for the Tech-Learn project, a learning platform built with Django, Channels, and a Dockerized Ubuntu server. It provides a real Ubuntu terminal accessible via WebSocket for users to practice programming and system administration tasks.

## Features
- **WebSocket Terminal**: Connects to a Dockerized Ubuntu 20.04 server running SSH, allowing real-time command execution (e.g., `sudo apt update`, `python3`, `nano`).
- **Django Backend**: Manages WebSocket connections via Channels and Redis.
- **Docker Integration**: Runs an SSH-enabled Ubuntu container for persistent terminal sessions.

## Requirements
- Python 3.11.5
- Docker
- Redis server
- Dependencies listed in `requirements.txt`

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/BadrRibzat/Tech-Learn.git
   cd Tech-Learn/backend

2. **Create and Activate Virtual Environment**:
   ```bash
   python3 -m venv env
   source env/bin/activate

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt

4. **Set Up Environment Variables**: 
Create a .env file in the backend/ directory:
   ```bash
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   MONGODB_URI=your-mongodb-uri
   REDIS_HOST=127.0.0.1

Replace your-secret-key-here and your-mongodb-uri with secure values (MongoDB isn’t used yet but is configured).
5. **Start Redis**:
   ```bash
   sudo systemctl start redis-server
   sudo systemctl status redis-server  # Ensure it's running

6. **Build and Run Docker Container**:
   ```bash
   cd docker/terminal
   docker build -t tech-learn-ubuntu-server .
   docker run -d --name ubuntu-server -p 2222:22 tech-learn-ubuntu-server

7. **Run the Backend Server**:
   ```bash
   cd ~/Tech-Learn/backend
   daphne -b 0.0.0.0 -p 8000 config.asgi:application

The server runs on http://127.0.0.1:8000 with WebSocket 
	at ws://127.0.0.1:8000/ws/terminal/.
**Usage**:
   .Connect via the frontend (see frontend/README.md) to access the terminal.
   .Run commands like ls, python3 --version, sudo apt install <package>, or edit files with nano.

**Project Structure**:
   .config/: Django settings, ASGI, and routing.
   .docker/terminal/: Dockerfile for the Ubuntu SSH server.
   .terminal/: App with WebSocket consumer (consumers.py) and views.

**Next Steps**:
   .Add user authentication (user app).
   .Implement learning content (learning app).
   .Integrate chatbot (chatbot app).

**Contributing**:
Fork the repo, make changes, and submit a pull request to https://github.com/BadrRibzat/Tech-Learn.
