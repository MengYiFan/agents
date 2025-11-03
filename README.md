# Mastra Agents Project

This repository contains a Mastra project scaffolded in an offline environment. It includes example agents and configuration files to get started quickly once dependencies are available.

## Code Review MCP Agent

The project ships with a dedicated code review MCP agent that layers project-specific guidance on top of a comprehensive default review prompt.

- **Project instructions priority** – The agent automatically loads `instructions.md` and applies its guidance before the default prompt so repository-specific rules always take precedence.
- **Fallback prompt** – If no project instructions are found, the agent falls back to `prompts/codeReviewDefault.md`, which enforces Chinese-language reports, severity grading (P0–P2), and actionable feedback.
- **Mastra registration** – The agent is registered in `src/index.ts`, so it becomes available as soon as the Mastra runtime starts.

### Usage

1. Ensure dependencies are installed (see [Getting Started](#getting-started)).
2. Start the Mastra runtime (`npm run dev`) or build the project (`npm run build`).
3. Invoke the agent via the Mastra MCP interface using the key `code-review-agent`.
4. Provide the diff context between the working branch and `origin/master`; the agent returns a structured Chinese review report that honors repository instructions and any `CODE_STANDARD.md` files in scope.

Refer to `prompts/codeReviewDefault.md` to customize the default instructions or to craft additional prompt variants.

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
- `src/agents` – Example agent definitions, including a prompt library agent that reads Markdown prompt files.
- `src/index.ts` – Entry point that registers the agents with Mastra.
- `prompts` – Markdown prompt definitions consumed by the prompt library agent.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.
