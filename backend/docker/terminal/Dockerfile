FROM ubuntu:20.04

# Set a faster mirror for apt-get
RUN sed -i 's|http://archive.ubuntu.com/ubuntu|http://us.archive.ubuntu.com/ubuntu|g' /etc/apt/sources.list

# Install dependencies in one layer to minimize image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssh-server \
    python3 \
    python3-pip \
    nano \
    vim \
    git \
    curl \
    wget \
    build-essential \
    nodejs \
    npm \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Configure SSH
RUN mkdir -p /var/run/sshd && \
    echo 'root:root' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    ssh-keygen -A

# Install Python packages
RUN pip3 install --no-cache-dir watchdog python-dotenv

# Set up working directory for projects
RUN mkdir -p /home/student && chown root:root /home/student
WORKDIR /home/student

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
