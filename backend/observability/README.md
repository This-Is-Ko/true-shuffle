# Observability: Grafana Cloud Logs

Minimal setup for shipping True Shuffle backend logs to Grafana Cloud Logs (GCL) with Grafana Alloy.

The application needs no code changes. The Flask/Gunicorn and Celery containers already write logs to stdout/stderr, and Alloy reads them through the local Docker API.

## Files

- `config.alloy` — Docker discovery, container relabeling, log reading, and the GCL write endpoint.
- `docker-compose.alloy.yml` — the Alloy container, Docker socket mount, positions volume, and env file.
- `.env` — created on the host, not committed. Compose's `env_file` injects these into the Alloy container.

## Prerequisites

- Docker is running on the host, and `docker logs <container>` works (the logging driver must not be `none`).
- A Grafana Cloud stack with a Loki push URL, numeric instance ID, and an access token with the `logs:write` scope.

## Configure

Create `backend/observability/.env` on the host:

```dotenv
GCL_LOKI_URL=https://logs-prod-<region>.grafana.net/loki/api/v1/push
GCL_INSTANCE_ID=<numeric-instance-id>
GCL_TOKEN=<token-with-logs-write>
```

Restrict it:

```bash
chmod 600 backend/observability/.env
```

Do not put these values in the application's `backend/.env`: that file is passed to the Flask and Celery containers, and the GCL token does not need to reach them.

## Run

From the backend directory:

```bash
docker compose -f observability/docker-compose.alloy.yml up -d
```

Or from this directory:

```bash
docker compose up -d
```

The named `alloy-data` volume persists the Docker log read positions across restarts.

## Verify

Check the container and its own logs:

```bash
docker compose -f observability/docker-compose.alloy.yml ps
docker compose -f observability/docker-compose.alloy.yml logs -f alloy
```

Then query Grafana Cloud Logs:

```logql
{container="true_shuffle_flask"}
{container="true_shuffle_celery_worker"}
{job="true_shuffle"}
```

The Alloy UI is not exposed by default. To inspect targets and component health locally, temporarily add this to the `alloy` service:

```yaml
ports:
  - "127.0.0.1:12345:12345"
```

and open `http://localhost:12345`.

## Scope

This is ingest only: raw log lines are shipped with a `container` label and a `job="true_shuffle"` label. Level labels, correlation ID structured metadata, format unification, request/access logs, and image pinning can be added later without changing this pipeline.
