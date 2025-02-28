FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install essentials + SSH server + learning tools
RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    python3 \
    python3-pip \
    nano \
    vim \
    git \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install django requests

# Set up SSH with host keys
RUN mkdir -p /var/run/sshd && \
    ssh-keygen -A && \
    echo "PermitRootLogin no" >> /etc/ssh/sshd_config && \
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config && \
    chmod 0755 /var/run/sshd

# Create student user with sudo privileges
RUN useradd -m -s /bin/bash student && \
    echo "student:studentpass" | chpasswd && \
    echo "student ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/student && \
    chmod 0440 /etc/sudoers.d/student

WORKDIR /home/student
RUN mkdir -p /home/student/projects && chown -R student:student /home/student && \
    echo "PS1='tech-learn@\\u\\$ '" >> /home/student/.bashrc && \
    echo "Welcome to Tech-Learn Terminal!\nPre-installed: python3, pip3, nodejs, npm, git, nano, vim, django, requests\nTry 'sudo apt install <package>' or 'python3 --version'.\n" > /home/student/welcome.txt

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
