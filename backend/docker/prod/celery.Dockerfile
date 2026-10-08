FROM python:3.14-slim-bookworm

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Requirements are installed here to ensure they will be cached.
COPY ./app/requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

WORKDIR /app

COPY ./app .

CMD celery -A make_celery worker --pool=prefork --loglevel INFO --max-tasks-per-child=6