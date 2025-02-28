#!/bin/bash

# Start services in the background
sudo service postgresql start && echo "PostgreSQL started" || echo "PostgreSQL failed"
sudo redis-server --daemonize yes && echo "Redis started" || echo "Redis failed"

# Welcome message
cat > /home/student/welcome.txt << EOF
Welcome to Tech-Learn Terminal!
- Python3: django, flask, numpy, etc.
- JavaScript/Node.js: npm, typescript
- Databases: PostgreSQL, Redis, SQLite3
- Tools: git, curl, nano, vim, sudo
Type 'cat welcome.txt' to see this again.
EOF

echo "==== Tech-Learn Terminal Ready ===="
cat /home/student/welcome.txt
echo "=================================="

# Keep container running with an interactive shell
exec bash -i
