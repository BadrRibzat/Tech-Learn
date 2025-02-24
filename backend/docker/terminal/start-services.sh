#!/bin/bash

# Function to start service if it's available
start_service() {
    if command -v service >/dev/null 2>&1 && service --status-all 2>&1 | grep -q "$1"; then
        sudo service $1 start
        echo "$1 service started"
    else
        echo "$1 service not found"
    fi
}

# Start database services
start_service postgresql
start_service redis-server
start_service mongodb

# Create a welcome message
cat > /home/student/welcome.txt << EOF
Welcome to Tech-Learn Terminal!

This terminal has the following pre-installed:
- C++: g++, cmake, boost libraries
- Python3: django, flask, numpy, pandas, and more
- JavaScript/Node.js: npm, webpack
- TypeScript
- Databases: PostgreSQL, Redis, MongoDB, SQLite3
- Git, curl, ssh, wget
- Editors: vim, nano

Type 'cat welcome.txt' to see this message again.
EOF

echo "==== Tech-Learn Terminal Ready ===="
cat /home/student/welcome.txt
echo "=================================="

# Keep the container running
exec bash
