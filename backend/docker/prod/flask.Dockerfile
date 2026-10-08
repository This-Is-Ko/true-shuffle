FROM python:3.14-slim-bookworm

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Requirements are installed here to ensure they will be cached.
COPY ./app/requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

ENV FLASK_APP=main

WORKDIR /app

COPY ./app .

CMD gunicorn -c ./config/gunicorn/gunicorn.conf.py main:app 
