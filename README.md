# Mastra Agents Workspace

This repository provides a batteries-included Mastra workspace that was reconstructed in an offline environment. It demonstrates how to compose multiple AI agents, wrap internal developer workflows, and expose reusable integrations (Grafana, Git lifecycle automation, Lark + Google SSO) without relying on the official `mastra init` scaffolder.

## Key Features

- **Ready-to-run Mastra runtime** – `src/index.ts` boots a `Mastra` instance, registers all agents, and ships with a sample script that exercises the echo and summarizer agents.
- **Agent catalog that mirrors real workflows** – Quality, integration, and prompt-library agents live under `src/agents/` with extensive inline documentation.
- **First-class MCP integrations** – Purpose-built agents encapsulate Git automation, Grafana (Google IAP) access, and dynamic code-guideline generation.
- **Productivity extras** – The `extensions/mcp-visualizer` VS Code extension renders MCP docs, Git flows, and quick actions.
- **Deep dive documentation** – See the `docs/` directory for task-specific walkthroughs and API references.

## Requirements

- Node.js 18 or later (Mastra requires a modern runtime with native `fetch`).
- Access to the npm registry to install the dependencies listed in `package.json`.
- Optional: credentials for Google IAP-protected Grafana instances and Lark OAuth applications when testing the corresponding integrations.

## Quick Start

```bash
npm install          # Install mastra, TypeScript, and supporting libraries
npm run dev          # Launch the Mastra dev server with hot reloading
npm run build        # Emit JavaScript into dist/
npm start            # Execute the compiled bundle (runs the sample script)
```

> 💡 The project structure was assembled manually because the originating environment could not execute `npx mastra@latest init`. Once dependencies are installed the commands above behave exactly like an official Mastra workspace.

### Running the Sample Workflow

The entry point (`src/index.ts`) demonstrates how to invoke agents programmatically:

```ts
const echoResponse = await mastra.run("echo-agent", { prompt: "Hello Mastra!" });
const summaryResponse = await mastra.run("summarizer-agent", {
  prompt: "Mastra helps developers build AI agents with batteries-included tooling.",
});
```

Running `npm start` prints both responses so you can verify the runtime wiring before integrating additional agents.

## Repository Layout

```
.
├── docs/                       # Extended documentation for MCP agents and integrations
├── extensions/
│   └── mcp-visualizer/         # VS Code extension that surfaces MCP docs and Git lifecycle helpers
├── prompts/                    # Markdown prompts consumed by the prompt library agent
├── src/
│   ├── agents/
│   │   ├── examples/           # Echo, summarizer, prompt-library sample agents
│   │   ├── integrations/       # Git + Grafana focused agents
│   │   ├── quality/            # Code review and .rules automation agents
│   │   └── index.ts            # Central agent registry consumed by the runtime
│   ├── integrations/           # Low-level service clients (Grafana MCP, Google auth, Lark SSO)
│   └── index.ts                # Mastra runtime entry point & sample script
├── instructions.md             # Project-wide review guidance consumed by the code-review agent
└── mastra.config.ts            # Mastra configuration that lists enabled agents
```

Agents are grouped by responsibility so future additions only require dropping a file into the relevant subdirectory and exporting it from `src/agents/index.ts`.

## Agent Catalog

| Agent | Purpose | Location | Tools |
| --- | --- | --- | --- |
| `echo-agent` | Repeats any provided prompt. | `src/agents/examples/echoAgent.ts` | _None_ |
| `summarizer-agent` | Produces concise bullet summaries. | `src/agents/examples/summarizerAgent.ts` | _None_ |
| `prompt-library-agent` | Parses Markdown prompt files, extracts metadata comment blocks, and returns structured prompt definitions. | `src/agents/examples/promptLibraryAgent.ts` | `loadPrompt` (reads `prompts/<name>.md`) |
| `code-review-agent` | Builds Chinese review briefs by combining `instructions.md` with `prompts/codeReviewDefault.md`; prioritises repo-specific rules. | `src/agents/quality/codeReviewAgent.ts` | _None_ |
| `code-guidelines-mcp` | Generates or updates a `.rules` document tailored to detected frameworks (Nuxt 2, Vue 2, MidwayJS, Egg.js). | `src/agents/quality/codeGuidelinesMcp.ts` | `injectCodeRulesDocument` |
| `git-mcp-agent` | Wraps Git commands, branch compliance checks, lifecycle coaching, and optional pre-commit reviews. | `src/agents/integrations/gitMcpAgent.ts` | `gitWorkflow`, `lifecycleGuide` |
| `grafana-mcp-agent` | Accesses Grafana APIs behind Google IAP, handling ID-token minting, cookie refresh, and panel parsing. | `src/agents/integrations/grafanaMcpAgent.ts` | `grafanaMcp` |

Consult the documents in `docs/` for input/output examples, lifecycle definitions, and troubleshooting checklists.

## Integrations & Environment Configuration

### Grafana MCP (Google IAP)

`src/integrations/grafanaMcp.ts` authenticates against IAP-protected Grafana instances by exchanging Google service-account credentials for ID tokens, caching cookies, and retrying through redirects. Configure credentials via tool inputs or environment variables:

- `GRAFANA_BASE_URL` / `GRAFANA_URL`
- `GRAFANA_GOOGLE_CLIENT_EMAIL` / `GRAFANA_CLIENT_EMAIL`
- `GRAFANA_GOOGLE_PRIVATE_KEY` / `GRAFANA_PRIVATE_KEY` (remember to replace `\n` with real newlines)
- `GRAFANA_SERVICE_ACCOUNT_JSON` / `GRAFANA_GOOGLE_CREDENTIALS` (optional alternative to individual fields)
- `GRAFANA_GOOGLE_TARGET_AUDIENCE` / `GRAFANA_IAP_TARGET_AUDIENCE`

The agent also accepts a `serviceAccountJson` string (raw or base64-encoded) in tool calls for ad-hoc overrides.

### Google-authenticated Fetch Helper

`fetchWithGoogleAuth` (`src/integrations/googleAuthSession.ts`) turns any `fetch` request into an authenticated call by:

1. Requesting or refreshing cookies from a provided `sessionProvider` callback.
2. Following redirects until the target resource resolves or the Google login endpoint is detected.
3. Persisting cookies through the provided `TokenStore` implementation.

Use it to compose new MCP clients that rely on Google SSO.

### Lark + Google SSO Bridge

`LarkGoogleAuthManager` (`src/integrations/larkGoogleAuth.ts`) forces Lark OAuth users through enterprise Google SSO, refreshes tokens, and exposes helper methods for revocation and authenticated fetches. The `docs/lark-google-auth.md` guide contains a complete usage example.

### Git Lifecycle Automation

The Git MCP agent ships with lifecycle-aware defaults (`src/agents/integrations/gitMcpAgent.ts`):

- Branch naming conventions across clarify → release stages.
- Automatic staging (`git add`) and diff collection when `preCommitReview.enabled` is set.
- Optional `.kai/instructions.md` ingestion to blend local team policies with review prompts.

See [`docs/git-mcp/README.md`](./docs/git-mcp/README.md) for JSON payload samples and output field descriptions.

## Development Workflow

- **Type checking** – `npx tsc --noEmit`
- **Incremental compilation** – `npx tsc --watch`
- **Runtime smoke test** – `npm start`
- **Debug compiled output** – `node --inspect-brk dist/index.js` and attach a debugger
- **Logging** – Add `console.log` statements inside agents; output appears in the terminal regardless of entry point.

## VS Code Extension

The bundled `extensions/mcp-visualizer` project surfaces MCP documentation and Git lifecycle diagrams directly in VS Code:

```bash
cd extensions/mcp-visualizer
npm install
npm run watch   # start the extension development host
```

Press `F5` in VS Code to launch a new window with the sidebar view. Run `npm run package` to emit a distributable `.vsix` when you are ready to share the extension.

## Additional Resources

- [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md) – `.rules` generation workflow and customization tips.
- [`docs/git-mcp/README.md`](./docs/git-mcp/README.md) – Full Git MCP command reference.
- [`docs/lark-google-auth.md`](./docs/lark-google-auth.md) – Lark OAuth + Google SSO helper overview.
- [`extensions/mcp-visualizer/README.md`](./extensions/mcp-visualizer/README.md) – Development, debugging, and packaging instructions for the VS Code extension.
