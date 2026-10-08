# Spotify True Shuffle - Backend

This package is the backend API and services for **True Shuffle**. It provides the Flask API that powers playlist shuffling, library statistics and analysis, and playlist sharing.

For an overview of the project, its features and the full technology stack, see the [root README](../README.md). The frontend lives in the [`frontend/`](../frontend/README.md) package.

Backend built on Flask in Python (migrated from Spring Boot), deployed using Docker with containers for Flask (Gunicorn), Celery, Redis and Nginx. Data is stored in MongoDB.

## Configure

The following env variables are required to run. Add them into a .env file

    SPOTIFY_CLIENT_ID # retrieve from Spotify Dev Console
    SPOTIFY_CLIENT_SECRET # retrieve from Spotify Dev Console
    SPOTIFY_REDIRECT_URI # frontend uri
    COOKIE_DOMAIN # cookie domain value (Leave empty for localhost)
    CORS_ORIGIN # cors origin value(s), comma-separated (e.g. http://localhost:3000,http://127.0.0.1:3000)
    MONGO_URI # database uri
    CELERY_BROKER_URL # celery url
    CELERY_RESULT_BACKEND_URL # celery url
    REDIS_PASSWORD # auth to access celery
    CRON_API_KEY # static API key for cron job endpoints (generate with: openssl rand -hex 32)
    CONFIG_TYPE

To set the environment to the specific environment, set the following variable.

    # dev
    CONFIG_TYPE=config.DevelopmentConfig

    # test
    CONFIG_TYPE=config.TestingConfig

    # prod
    CONFIG_TYPE=config.ProductionConfig

Example config
    
    e.g.
        CELERY_BROKER_URL=redis://localhost
        CELERY_RESULT_BACKEND_URL=redis://localhost
        REDIS_PASSWORD=******
        SPOTIFY_CLIENT_ID=abcd
        SPOTIFY_CLIENT_SECRET=******
        SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000
        CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
        CRON_API_KEY=******
        CONFIG_TYPE=config.DevelopmentConfig
        MONGO_URI=mongodb+srv://username:password@cluster0.abcd.mongodb.net

## Run

Install dependencies:
    
    pip install -r app/requirements.txt

Run flask app:

    flask --app app/main.py run

Start redis instance (e.g. docker) then run celery worker:

    cd app
    celery -A make_celery worker --pool=solo --loglevel INFO

Alternatively run all via docker locally

    docker compose up -d --build

## Deployment

Backend is deployed with Docker. See the [Docker](#docker) section below for building, pushing and hosting the containers.

## Tests

Use pytest to run tests on the app:

    pytest

## Endpoints

`GET /api/spotify/auth/login`: Get Spotify login uri

`POST /api/spotify/auth/code`: Authenticate user with Spotify auth code

`POST /api/spotify/auth/logout`: Logout user and expire cookies

`GET /api/playlist/me`: Get playlists

`POST /api/playlist/shuffle`: Shuffle selected playlist

`GET /api/playlist/shuffle/state/<id>`: Get shuffle job state

`DELETE /api/playlist/delete`: Delete all shuffled playlists

`POST /api/playlist/share/liked-tracks`: Create playlist from Liked Songs to share

`GET /api/playlist/share/liked-tracks/<id>`: Get share job state

`POST /api/user/save`: Create/update user entry

`GET /api/user/`: Get user info

`GET /api/user/tracker`: Get user tracker datapoints

`GET /api/user/aggregate`: Get analysis of user's Liked Songs and tracker datapoints in one call

`GET /api/user/aggregate/state/<id>`: Get aggregate job state

`GET /api/user/shuffle/recent`: Get recent shuffle history

`GET /api/statistics/overall`: Get shuffle statistics

`GET /api/trackers/update`: Update trackers for all enabled users

`GET /api/session/cleanup`: Remove expired sessions (cron, requires `X-Cron-Key`)

`GET /api/admin/overview`: Get admin overview

`GET /api/admin/users/monthly`: Get monthly active users

`GET /api/admin/users/created`: Get newly created users by month

`GET /api/admin/shuffles/recent`: Get recent shuffles

`GET /api/admin/shuffles/failures`: Get recent shuffle failures

`GET /api/admin/shuffles/failure-rate`: Get shuffle failure rate

## Authentication

Authentication is handled by Spotify and the access-token/refresh-token are stored for each user. 

Sessions are created and send in cookies to the user which are revoked once logged out.

### Cron Job Authentication

Cron endpoints (`/api/session/cleanup` and `/api/trackers/update`) require a static API key in the `X-Cron-Key` header:

    GET /api/session/cleanup
    Header: X-Cron-Key: <your-cron-api-key>

    GET /api/trackers/update
    Header: X-Cron-Key: <your-cron-api-key>

Generate a secure key with: `openssl rand -hex 32`

## Docker

Run 

    docker compose -f .\docker-compose-prod.yml build
    docker push [repository]:true_shuffle_flask_web
    docker push [repository]:true_shuffle_celery_worker

On machine running the server

    docker pull [repository]:true_shuffle_flask_web
    docker pull [repository]:true_shuffle_celery_worker
    docker compose up -d

Docker reference

https://docs.docker.com/engine/install/ubuntu/

Generate SSL Cert (Ensure port 80 is free and instance firewall allows http and https)

    sudo certbot certonly --standalone -d api.trueshuffle.top
    
Mount the certificate directory in docker compose
    
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/nginx.conf
      - /etc/letsencrypt/live/api.trueshuffle.top:/etc/letsencrypt/live/api.trueshuffle.top
      - /etc/letsencrypt/archive/api.trueshuffle.top:/etc/letsencrypt/archive/api.trueshuffle.top

Update `./nginx/nginx.conf` to point to the certificate files

    ssl_certificate /etc/letsencrypt/live/api.trueshuffle.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.trueshuffle.top/privkey.pem;

## Troubleshooting

Potential cause of Gunicorn timeout due to Pymongo error. Add IP into DB network access "IP Access List"

https://stackoverflow.com/questions/41133455/docker-repository-does-not-have-a-release-file-on-running-apt-get-update-on-ubun

## Cloudflare tunnel

If self-hosting use Cloudflare tunnel https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
