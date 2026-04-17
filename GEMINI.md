# Gemini Project Context: OpenHealthDP

This file contains foundational mandates and architectural context for Gemini CLI agents.

## 🏗 Architectural Foundation (v2.3.0)

- **Logical Separations**: The API is split into `/api/v2/explorer/outpatient` and `/api/v2/explorer/inpatient`.
- **Backend**: Google BigQuery (`ai4h2ma` project, `openhealth_public` presentation layer).
- **Deployment**: Containerized via Docker on GCP Cloud Run.
- **Identity**: Uses **Application Default Credentials (ADC)**. NEVER hardcode JSON keys.

## 🛡 Security & Safety Mandates

1.  **Read-Only Data Layer**: The BigQuery environment MUST be treated as **Immutable and Read-Only**. Agents are strictly forbidden from executing `CREATE`, `REPLACE`, `UPDATE`, `DELETE`, or `DROP` commands on views or tables. If a schema change is needed, it must be requested via a formal **Feature Request**.
2.  **Cost Safeguard**: ALL BigQuery queries MUST include `maximum_bytes_billed`. Default is 1GB.
3.  **Input Validation**: Strict schema validation on `bundleId`, `city`, `zip`, and `state`.
4.  **CORS**: Only allow `ai4h2.org` subdomains and approved frontend hosts.
5.  **Graceful Shutdown**: Always handle `SIGTERM` with a 10s drain window.
6.  **Logging**: All lifecycle and error events MUST be logged as JSON objects.

## 🚦 Operational Workflows

- **CI/CD**: Triggered by pushing tags matching `v*` (Cloud Build).
- **Versioning**: Follow semantic versioning. v2.x is current.
- **Notebooks**: Maintain `example_analysis_v2.ipynb` and its `.md` mirror. Use `nbstripout` before committing.
