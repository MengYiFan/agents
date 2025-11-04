# Mastra Agents Project

This repository contains a Mastra project that was generated in an offline environment. It includes a collection of sample agents, a Grafana integration, and a dedicated VS Code extension to speed up day-to-day development.

## Quick Start

1. **Install dependencies** (requires access to the npm registry):
   ```bash
   npm install
   ```
2. **Start the Mastra development server**:
   ```bash
   npm run dev
   ```
3. **Build the TypeScript sources**:
   ```bash
   npm run build
   ```
4. **Run the compiled output**:
   ```bash
   npm start
   ```

> 💡 The project was scaffolded manually because the environment that created this repository could not run `npx mastra@latest init`. Once dependencies are available the commands above behave the same as an officially generated Mastra workspace.

## Repository Layout

```
.
├── docs/                       # Extended documentation for MCP agents and integrations
├── extensions/
│   └── mcp-visualizer/         # VS Code extension that surfaces MCP docs and Git flows
├── prompts/                    # Markdown prompt files served by the prompt library agent
├── src/
│   ├── agents/
│   │   ├── examples/           # Basic sample agents (echo, summarizer, prompt library)
│   │   ├── integrations/       # Git 与 Grafana 相关代理
│   │   ├── quality/            # Code review & guideline automation agents
│   │   └── index.ts            # Central agent registry consumed by the runtime
│   ├── integrations/           # Low-level service clients (Grafana MCP, etc.)
│   └── index.ts                # Mastra runtime entry point
├── instructions.md             # Repository-wide review guidance loaded by the code review agent
└── mastra.config.ts            # Mastra runtime configuration
```

The new `src/agents/index.ts` file aggregates all agent instances so that `src/index.ts` only focuses on bootstrapping the Mastra runtime. Related agents are grouped into sub-directories (`examples`, `integrations`, `quality`) to simplify navigation and future maintenance.

## Agents and Integrations

- **Prompt Library Agent** (`src/agents/examples/promptLibraryAgent.ts`) exposes the Markdown prompts located under `prompts/`.
- **Code Review Agent** (`src/agents/quality/codeReviewAgent.ts`) merges `instructions.md` with the default review template at `prompts/codeReviewDefault.md`, ensuring project-specific rules are always applied first.
- **Code Guidelines MCP Agent** (`src/agents/quality/codeGuidelinesMcp.ts`) inspects `package.json` and generates a `.rules` document tailored to detected frameworks (Nuxt 2, Vue 2, MidwayJS, Egg.js).
- **Git MCP Agent** (`src/agents/integrations/gitMcpAgent.ts`) wraps common Git operations, lifecycle reminders, and optional pre-commit review prompts.
- **Grafana MCP Agent** (`src/agents/integrations/grafanaMcpAgent.ts`) calls into `src/integrations/grafanaMcp.ts` to handle Google IAP authentication, cookie management, and Grafana dashboard APIs.

Refer to the documents in `docs/` (for example [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md)) for deep dives into specific agents and supported commands.

## Development & Debugging Workflow

- **Type checking** – Run `npx tsc --noEmit` for a one-off check or `npx tsc --watch` during active development.
- **Logging** – Add `console.log` statements inside agent handlers. Output appears in the terminal regardless of whether the project is started via `npm run dev` or `npm start`.
- **Node.js debugging** – After building, start the compiled output with `node --inspect-brk dist/index.js` and attach your preferred debugger (Chrome DevTools, VS Code, etc.).
- **Runtime sampling** – Execute `node dist/index.js` (or `npm start`) to trigger the sample workflow that exercises the echo and summarizer agents.

## Working with VS Code

1. **Open the workspace** – Use `File → Open Folder…` and select this repository.
2. **Recommended extensions** – Enable TypeScript/JavaScript tooling plus formatters such as “ESLint” and “Prettier - Code formatter” to surface issues early.
3. **Launch configuration** – Create a `launch.json` entry to run the Mastra dev server from the VS Code debugger:
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Mastra Dev Server",
     "runtimeExecutable": "npm",
     "runtimeArgs": ["run", "dev"],
     "console": "integratedTerminal"
   }
   ```
4. **Attach to compiled output** – Start `node --inspect dist/index.js` in the terminal, then use the built-in “Node.js: Attach” configuration to connect to port `9229`.
5. **Use the MCP Visualizer extension** – The repository bundles a VS Code extension under `extensions/mcp-visualizer`. Open that folder in VS Code and run `npm install` followed by `npm run watch`; press `F5` to launch a development host. The extension provides:
   - A sidebar view that lists MCP-related README documents for quick reference.
   - A Git lifecycle diagram that suggests branch strategies and can execute `git checkout` directly from the UI.
   - Commands such as “MCP 可视化: 刷新文档索引” to rescan documentation without restarting the extension.

Packaging the extension with `npm run package` produces a `.vsix` file that can be installed via “Extensions: Install from VSIX…”.

## Additional Resources

- [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md) – Complete usage guide for the Code Guidelines MCP agent.
- [`docs/lark-google-auth.md`](./docs/lark-google-auth.md) – Notes on authenticating through Lark + Google.
- [`extensions/mcp-visualizer/README.md`](./extensions/mcp-visualizer/README.md) – In-depth instructions for the bundled VS Code extension.

For environments protected by Google IAP, see the Grafana section in this README and the inline comments within `src/integrations/grafanaMcp.ts` to understand how tokens, redirects, and session cookies are handled automatically.
