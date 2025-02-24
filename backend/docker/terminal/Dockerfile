FROM ubuntu:20.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages and tools
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    python3-dev \
    nodejs \
    npm \
    curl \
    wget \
    ssh \
    git \
    nano \
    vim \
    redis-server \
    sqlite3 \
    postgresql \
    postgresql-contrib \
    mongodb \
    g++ \
    cmake \
    libboost-all-dev \
    # Additional C++ frameworks/libraries
    libgtest-dev \
    libfmt-dev \
    # Add more Python libraries
    python3-numpy \
    python3-pandas \
    python3-matplotlib \
    # Add more JavaScript tools
    && rm -rf /var/lib/apt/lists/*

# Install TypeScript and other JS tools
RUN npm install -g typescript webpack webpack-cli vue-cli react-scripts @angular/cli

# Install popular Python packages
RUN pip3 install virtualenv django flask requests fastapi beautifulsoup4
RUN pip3 install scikit-learn
RUN pip3 install tensorflow-cpu

# Set up PostgreSQL
RUN service postgresql start && \
    su - postgres -c "createuser -s student" && \
    su - postgres -c "createdb studentdb -O student"

# Configure Redis
RUN mkdir -p /var/run/redis && \
    chown redis:redis /var/run/redis

# Create a user for running the terminal
RUN useradd -ms /bin/bash student

# Set up the workspace
WORKDIR /home/student
RUN mkdir -p /home/student/projects && \
    chown -R student:student /home/student

# Add startup script to ensure services are running
COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh

# Switch to the student user
USER student

# Keep container running
ENTRYPOINT ["/start-services.sh"]
