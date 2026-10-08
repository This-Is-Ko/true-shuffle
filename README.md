# True Shuffle

True Shuffle is a Spotify web application that provides a more genuinely random shuffle experience for Spotify playlists.

Spotify's built-in shuffle can feel repetitive and predictable, pushing certain tracks more frequently than others. True Shuffle addresses this by creating custom playlists with a truly randomised order of tracks, while leaving your original playlists untouched.

## Repository Structure

This repository is a monorepo containing two components:

| Component | Description | README |
| --- | --- | --- |
| [`frontend/`](./frontend/README.md) | React single-page web application | [frontend/README.md](./frontend/README.md) |
| [`backend/`](./backend/README.md) | Flask API, Celery workers and supporting services | [backend/README.md](./backend/README.md) |

## Features

- **Truly Random Shuffle** — Generate custom playlists with a fully randomised track order. Select any of your Spotify playlists or your Liked Songs to create a shuffled copy that preserves your original playlist.
- **Custom Playlist Management** — Keep your original playlist intact while creating a shuffled copy that you can delete anytime. Previous shuffled playlists are automatically replaced to prevent duplicates.
- **Library Analysis** — Analyse your Liked Songs library to discover insights about your music taste. View statistics including top artists, top albums, track length distributions, and audio features analysis with interactive visualisations.
- **Share Liked Songs** — Create a shareable playlist from your Liked Songs collection, making it easy to share your music library with others.
- **User-Friendly Interface** — A simple and intuitive interface to manage your shuffle experience and explore your music library.

## Technology Stack

**Frontend**

React 18, Material-UI (MUI), React Router, Axios, Nivo Charts, ApexCharts, React Helmet, React Virtuoso.

**Backend**

Flask in Python (migrated from Spring Boot), deployed with Docker using containers for Flask (Gunicorn), Celery, Redis and Nginx. Data is stored in MongoDB.

## Prerequisites

- **Frontend** — [Node.js](https://nodejs.org/) (22 or higher) and [npm](https://www.npmjs.com/) (v7 or higher)
- **Backend** — Python 3.10+, and optionally Docker to run all services locally

## Getting Started

Each component has its own setup instructions, detailed in its README. In short:

**Frontend**

```bash
cd frontend
npm install
npm start
```

**Backend**

```bash
cd backend
pip install -r app/requirements.txt
flask --app app/main.py run
```

See [`frontend/README.md`](./frontend/README.md) and [`backend/README.md`](./backend/README.md) for environment variables, configuration, tests and full run instructions.

## Deployment

- **Frontend** — Automatically deployed from the `main` branch using Vercel.
- **Backend** — Deployed using Docker; see the [backend README](./backend/README.md) for container, SSL and hosting details.
