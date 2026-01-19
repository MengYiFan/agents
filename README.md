# Mastra Agents Workspace

A Mastra-based AI agents platform with MCP (Model Context Protocol) support, featuring Claude Skills and streamlined integrations.

## Architecture

```
┌─────────────────────────────────────────────┐
│              Claude Skills (Guidance)        │
│  sentry-fix | code-review | code-style | ...│
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│           Mastra Agents (API Execution)      │
│    sentry-mcp-agent | grafana-mcp-agent     │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│           MCP Server (HTTP Bridge)           │
│         http://localhost:4120/mcp            │
└─────────────────────────────────────────────┘
```

## Quick Start

```bash
npm install           # Install dependencies
npm run dev           # Start Mastra dev server (port 4111)
npm run mcp           # Start MCP HTTP bridge (port 4120)
npm run build         # Compile TypeScript
```

## Project Structure

```
├── skills/                    # Claude Skills (SKILL.md + scripts/)
│   ├── sentry-fix/            # Sentry issue repair workflow
│   ├── code-review/           # Code review guidelines
│   ├── code-style/            # Code style rules (Nuxt/Vue/Midway)
│   ├── code-commit/           # Git commit workflow (yummy)
│   └── lark-notify/           # Lark notification
├── src/mastra/
│   ├── agents/                # Mastra Agents
│   │   ├── examples/          # Echo agent (health check)
│   │   ├── integrations/      # Sentry MCP agent
│   │   └── grafana/           # Grafana MCP agent
│   └── integrations/          # Low-level clients (Grafana, Sentry, Auth)
├── mcp/                       # MCP HTTP server bridge
└── extensions/                # VS Code extension
```

## Registered Agents

| Agent | Purpose | Tools |
|-------|---------|-------|
| `echo-agent` | Health check, echoes input | None |
| `grafana-mcp-agent` | Grafana API access via Google IAP | `grafanaMcp` |
| `sentry-mcp-agent` | Sentry issue analysis & alerting | `sentryMcp` |

## Claude Skills

Skills provide structured guidance for AI assistants. Use them by referencing `@skill-name` in conversations.

| Skill | Purpose |
|-------|---------|
| `@sentry-fix` | Complete Sentry issue repair workflow |
| `@code-review` | Code review guidelines (P0/P1/P2) |
| `@code-style` | Code style (Nuxt 2, Vue 2, Midway/Egg) |
| `@code-commit` | Git commit workflow using yummy CLI |
| `@lark-notify` | Lark/Feishu notification |

## Environment Variables

### Sentry MCP

Configure in VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "sentry": {
        "command": "npx",
        "env": { "SENTRY_ACCESS_TOKEN": "sntrys_{token}" },
        "args": ["-y", "mcp-remote@latest", "https://mcp.sentry.dev/mcp"],
        "type": "stdio"
      }
    }
  }
}
```

### Grafana MCP (Google IAP)

```bash
GRAFANA_BASE_URL=https://grafana.example.com
GRAFANA_GOOGLE_CLIENT_EMAIL=sa@project.iam.gserviceaccount.com
GRAFANA_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GRAFANA_GOOGLE_TARGET_AUDIENCE=xxx.apps.googleusercontent.com
```

## Development

```bash
npm run dev           # Mastra dev server (hot reload)
npm run mcp           # MCP bridge server
npx tsc --noEmit      # Type check
npx tsc --watch       # Watch mode
```

## VS Code Extension

```bash
cd extensions/mcp-visualizer
npm install
npm run watch         # Development
npm run package       # Build .vsix
```

See [extensions/mcp-visualizer/README.md](./extensions/mcp-visualizer/README.md) for details.

## License

MIT
