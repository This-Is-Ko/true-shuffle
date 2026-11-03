# Observability: Grafana Cloud Logs

Minimal setup for shipping True Shuffle backend logs to Grafana Cloud Logs (GCL) with Grafana Alloy.

The backend writes Flask and Celery application logs as single-line JSON to stdout, and Alloy reads them through the local Docker API. Alloy parses the JSON to add `level`/`service` labels and keeps `correlation_id`, `user_id`, and `task_id` as structured metadata.

## Files

- `config.alloy` — Docker discovery, container relabeling, log reading, and the GCL write endpoint.
- `docker-compose.alloy.yml` — the Alloy container, Docker socket mount, positions volume, and env file.
- `.env` — created on the host, not committed. Compose's `env_file` injects these into the Alloy container.

## Grafana Cloud stack

- Data source name: `grafanacloud-politerocket1634-logs`
- Loki base URL: `https://logs-prod-026.grafana.net`
- Basic Auth: enabled
- Username / instance ID: `1858892`

Alloy pushes to `<base URL>/loki/api/v1/push`, so `GCL_LOKI_URL` includes that path.

## Prerequisites

- Docker is running on the host, and `docker logs <container>` works (the logging driver must not be `none`).
- A Grafana Cloud access token with the `logs:write` scope for the stack above.

## Configure

Create `backend/observability/.env` on the host:

```dotenv
GCL_LOKI_URL=https://logs-prod-026.grafana.net/loki/api/v1/push
GCL_INSTANCE_ID=1858892
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

Then query Grafana Cloud Logs with the `grafanacloud-politerocket1634-logs` data source selected:

```logql
{container="true_shuffle_flask"}
{container="true_shuffle_celery_worker"}
{job="true_shuffle"}
```

Logs are JSON, so parse and filter them at query time. Use the `level` and
`service` labels for broad filters and `correlation_id` for tracing a single
request across the API and its Celery tasks:

```logql
{job="true_shuffle", level="ERROR"}
{container="true_shuffle_flask", level=~"WARNING|ERROR"} | json
{job="true_shuffle"} | json | correlation_id="<X-Correlation-ID>"
{container="true_shuffle_celery_worker"} | json | task_id="<celery-task-id>"
```

The API returns the correlation id in the `X-Correlation-ID` response header and
accepts a client-supplied value on the request. Include it in bug reports to
pull every related log line.

The Alloy UI is not exposed by default. To inspect targets and component health locally, temporarily add this to the `alloy` service:

```yaml
ports:
  - "127.0.0.1:12345:12345"
```

and open `http://localhost:12345`.

## Scope

This pipeline ships raw log lines with a `container` label, a `job="true_shuffle"` label, and JSON-derived `level`/`service` labels. `correlation_id`, `user_id`, and `task_id` are attached as structured metadata for tracing. Set `LOG_FORMAT=text` in the backend environment for human-readable local logs.
