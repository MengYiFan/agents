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
- `src/agents` – Example agent definitions, including a prompt library agent that reads Markdown prompt files and a code-guidelines MCP that injects a `.rules` specification tailored to the detected tech stack.
- `src/index.ts` – Entry point that registers the agents with Mastra.
- `prompts` – Markdown prompt definitions consumed by the prompt library agent.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.

## Using the Code Guidelines MCP

The `code-guidelines-mcp` agent exposes a single tool, `injectCodeRulesDocument`, which generates or updates the project’s `.rules` code-standard document. The agent inspects `package.json` and tailors the generated rules for Nuxt 2, Vue 2, MidwayJS, and Egg.js projects.

1. **Start the runtime.** Launch the Mastra dev server so you can interact with the agent (for example via the Mastra UI or by sending JSON-RPC requests):
   ```bash
   npm run dev
   ```
2. **Call the agent.** Ask the `code-guidelines-mcp` agent to prepare or refresh your guidelines. The agent will only overwrite an existing `.rules` file if you explicitly allow it:
   ```json
   {
     "agent": "code-guidelines-mcp",
     "input": "请更新当前项目的代码规范说明文档，允许覆盖旧版本。",
     "tool": {
       "name": "injectCodeRulesDocument",
       "arguments": {
         "overwrite": true
       }
     }
   }
   ```
3. **Review the output.** The tool response includes the path to the updated `.rules` file, whether it was overwritten, and the detected technologies. You can also supply a custom document body by passing `customContent` in the tool arguments; in that case no auto-detection is performed.

> If the agent cannot find matching dependencies in `package.json`, it falls back to a default Nuxt 2/Vue 2/MidwayJS/Egg.js guideline set and marks those sections as “默认推荐” in the generated document.
