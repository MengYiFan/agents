# Grafana MCP

This module provides a Model Context Protocol (MCP) agent for interacting with Grafana. It supports searching dashboards, retrieving dashboard details, and listing datasources.

## Features

- **Automated Authentication**: Supports Google Application Default Credentials (ADC) and Service Account (JSON/P12) for IAP-protected instances.
- **Dashboard Search**: Search for dashboards by keyword.
- **Dashboard Details**: Retrieve full JSON definitions of dashboards and panels.
- **Datasource Listing**: List available datasources.

## Configuration

The agent is configured via environment variables or tool input.

### Environment Variables

- \`GRAFANA_BASE_URL\`: The base URL of your Grafana instance (e.g., \`https://grafana.example.com\`).
- \`GRAFANA_GOOGLE_CLIENT_EMAIL\`: (Optional) Service account email.
- \`GRAFANA_GOOGLE_PRIVATE_KEY\`: (Optional) Service account private key.
- \`GRAFANA_GOOGLE_TARGET_AUDIENCE\`: (Optional) IAP target audience.

### Authentication Modes

1.  **ADC (Recommended)**:
    - Set \`GRAFANA_BASE_URL\`.
    - Run \`gcloud auth application-default login\` in your environment.
    - The agent will automatically use your local credentials.

2.  **Service Account**:
    - Set \`GRAFANA_BASE_URL\`, \`GRAFANA_GOOGLE_CLIENT_EMAIL\`, and \`GRAFANA_GOOGLE_PRIVATE_KEY\`.

## Usage

The agent is registered as \`grafana-mcp-agent\`. You can use it with any MCP client.

### Shortcuts

- \`check [dashboard]\`: Search and view dashboard details.
- \`info [uid]\`: Get dashboard JSON definition.
- \`list\`: List all datasources.
