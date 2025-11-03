# Mastra Agents Project

This repository contains a Mastra project scaffolded in an offline environment. It includes example agents and configuration files to get started quickly once dependencies are available.

## Getting Started

1. Install dependencies (requires access to npm registry):
   ```bash
   npm install
   ```
2. Start the Mastra development server:
   ```bash
   npm run dev
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run the compiled output:
   ```bash
   npm start
   ```

## Project Structure

- `mastra.config.ts` – Mastra runtime configuration.
- `src/agents/` – Example agent definitions for the runtime.
  - `promptLibraryAgent.ts` – Serves Markdown prompt files from the `prompts/` directory.
  - `codeGuidelinesMcp.ts` – Provides the stack-aware `.rules` injection tool.
- `src/index.ts` – Entry point that registers the agents with Mastra.
- `prompts/` – Markdown prompt definitions consumed by the prompt library agent.
- `docs/` – Extended documentation for Mastra agents, including the guidelines MCP usage guide.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.

## Available Agents

### Prompt Library Agent

The prompt library agent surfaces Markdown prompt files from the `prompts/` directory. Once the Mastra runtime is running you can query it to list prompt names or retrieve prompt content for downstream tooling.

### Code Guidelines MCP

The `code-guidelines-mcp` agent exposes the `injectCodeRulesDocument` tool to create or update the project’s `.rules` code-standard document. It inspects `package.json` and tailors the generated rules for Nuxt 2, Vue 2, MidwayJS, and Egg.js projects while still supporting custom content overrides.

See the dedicated guide at [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md) for invocation examples, overwrite behavior, fallback detection notes, and customization tips.
