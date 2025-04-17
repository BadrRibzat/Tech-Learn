FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
openssh-server \
python3 \
python3-pip \
nano \
vim \
&& rm -rf /var/lib/apt/lists/\*

RUN mkdir -p /var/run/sshd RUN echo 'root:root' | chpasswd RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config RUN ssh-keygen -A

RUN pip3 install watchdog python-dotenv

EXPOSE 22

CMD \["/usr/sbin/sshd", "-D"\]
