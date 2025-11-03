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
- `src/agents` – Example agent definitions, including a prompt library agent that reads Markdown prompt files.
- `src/index.ts` – Entry point that registers the agents with Mastra.
- `prompts` – Markdown prompt definitions consumed by the prompt library agent.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.

## Development and Debugging

1. **Install dependencies** – run `npm install` once network access is available so that TypeScript and Mastra packages are downloaded locally.
2. **Type-check while coding** – execute `npx tsc --noEmit` for a one-off type check or `npx tsc --watch` to keep a background watcher running as you edit files. Both commands surface TypeScript errors before you try to run the agents.
3. **Start the Mastra dev server** – run `npm run dev` to launch `mastra dev`. The server reloads when you edit files under `src/` and lets you invoke agents through the Mastra UI or HTTP interface once the dependencies are installed.
4. **Run the compiled bundle** – use `npm run build` followed by `npm start` to execute the emitted JavaScript in `dist/`. This mirrors the environment that a production deployment would use.
5. **Debug with Node.js** – after building, start the app with an inspector by running `node --inspect-brk dist/index.js`. Attach your preferred debugger (Chrome DevTools, VS Code, etc.) to step through agent logic.
6. **Add logging** – sprinkle `console.log` statements within agent handlers (for example in `src/agents/*.ts`) to trace execution. Logs appear in the terminal for both `npm run dev` and `npm start` workflows.

## Using the Agent in VS Code

1. **Open the workspace** – launch VS Code and choose **File → Open Folder…**, then select this repository so that the editor loads the TypeScript sources and configuration.
2. **Install helpful extensions** – the built-in TypeScript support is sufficient, but enabling extensions such as "ESLint" and "Prettier - Code formatter" helps surface linting or formatting issues while editing the agents.
3. **Run commands in the integrated terminal** – use **Terminal → New Terminal** to execute `npm install`, `npm run dev`, or `npx tsc --watch`. The terminal keeps command output alongside your editor tabs.
4. **Create a debug configuration** – open the **Run and Debug** panel and add a `launch.json` with a Node.js configuration similar to:
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
   Starting this configuration runs `npm run dev` under the VS Code debugger so you can set breakpoints in `src/` files.
5. **Attach to a built bundle** – when debugging the compiled output, first run `node --inspect dist/index.js` in a terminal, then use the VS Code **Node.js: Attach** template to connect to the inspector port (default `9229`).

> Looking for the Chinese documentation? See [`README_CN.md`](README_CN.md).
