FROM ubuntu

RUN apt-get update && apt-get upgrade -y && apt-get install -y build-essential \
    curl \
    sudo \
    ca-certificates \
    make \
    pkg-config \
    python3 \
    python3-dev \
    python3-pip \
    locales \
    wget \
    autoconf \
    automake \
    openssl \
    vim \
    && apt-get autoremove -y && apt-get clean

ENV PYTHONIOENCODING utf-8
COPY requirements.txt /etc/requirements.txt
COPY certificate/* /var/certificate/

RUN python3.6 -m pip install pip
RUN python3.6 -m pip install wheel
RUN pip3 install -r /etc/requirements.txt

COPY translate_plugin_server /etc/translate_plugin_server


EXPOSE 443
CMD cd /etc/translate_plugin_server && /usr/bin/python3.6 -u app.py
