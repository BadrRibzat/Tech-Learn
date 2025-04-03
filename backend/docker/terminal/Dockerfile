# docker/terminal/Dockerfile
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    python3 \
    python3-pip \
    docker.io \
    openssh-client \
    inotify-tools \
    tree \
    jq \
    nano \
    vim \
    git \
    curl \
    nodejs \
    npm \
    bash \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/run/sshd && \
    ssh-keygen -A && \
    echo "root:rootpass" | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

RUN pip3 install watchdog python-dotenv

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
