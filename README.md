# Mastra Agents Project

This repository contains a Mastra project scaffolded in an offline environment. It includes example agents and configuration files to get started quickly once dependencies are available.

## Code Review MCP Agent

The project ships with a dedicated code review MCP agent that layers project-specific guidance on top of a comprehensive default review prompt.

- **Project instructions priority** – The agent automatically loads `instructions.md` and applies its guidance before the default prompt so repository-specific rules always take precedence.
- **Fallback prompt** – If no project instructions are found, the agent falls back to `prompts/codeReviewDefault.md`, which enforces Chinese-language reports, severity grading (P0–P2), and actionable feedback.
- **Mastra registration** – The agent is registered in `src/index.ts` and declared in `mastra.config.ts`, so it becomes available as soon as the Mastra runtime starts.

### Usage

1. Ensure dependencies are installed (see [Getting Started](#getting-started)).
2. Start the Mastra runtime (`npm run dev`) or build the project (`npm run build`).
3. Invoke the agent via the Mastra MCP interface using the key `code-review-agent`.
4. Provide the diff context between the working branch and `origin/master`; the agent returns a structured Chinese review report that honors repository instructions and any `CODE_STANDARD.md` files in scope.

Refer to `prompts/codeReviewDefault.md` to customize the default instructions or to craft additional prompt variants.
In addition to the base scaffold, the project bundles a **Grafana MCP integration** that can automatically traverse an internal Google SSO flow (Google IAP) before issuing Grafana API calls. The agent is designed for environments where Grafana sits behind an internal Identity-Aware Proxy and requires Google sign-in before data can be fetched.

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
- `src/agents` – Example agent definitions used by the runtime, including:
  - `promptLibraryAgent.ts` for serving Markdown prompt files from the `prompts/` directory.
  - `codeGuidelinesMcp.ts` for stack-aware `.rules` injection.
- `src/index.ts` – Entry point that registers the agents with Mastra.

- `prompts` – Markdown prompt definitions consumed by the prompt library agent.
- `docs/` – Extended documentation for Mastra agents and supporting tools.
- `src/integrations/grafanaMcp.ts` – Low-level Grafana client that handles Google IAP authentication, redirect following, cookie persistence, and REST helpers.
- `src/agents/grafanaMcpAgent.ts` – Mastra agent exposing the Grafana MCP client as structured tools for dashboard and datasource inspection workflows.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.

## Available Agents

### Prompt Library Agent

The prompt library agent surfaces Markdown prompt files from the `prompts/` directory. Once the Mastra runtime is running you can query it to list prompt names or retrieve prompt content for downstream tooling.

### Code Guidelines MCP

The `code-guidelines-mcp` agent exposes the `injectCodeRulesDocument` tool to create or update the project’s `.rules` code-standard document. It inspects `package.json` and tailors the generated rules for Nuxt 2, Vue 2, MidwayJS, and Egg.js projects while still supporting custom content overrides.

See the dedicated guide at [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md) for invocation examples, overwrite behavior, fallback detection notes, and customization tips.

## Documentation

- [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md) – Comprehensive usage instructions for the Code Guidelines MCP, including overwrite handling, fallback behavior, and custom content support.

## Grafana MCP 自动登录实现原理

内部环境中的 Grafana 通常部署在 Google Cloud IAP 之后，访问时会经历以下步骤：

1. 访问内部 Grafana 地址（例如 `https://grafana.ops.example.com`）。
2. IAP 将请求重定向至 `https://accounts.google.com/...` 进行 Google 身份验证。
3. 授权完成后再跳转回 Grafana，并通过设置 `grafana_session` 等 Cookie 建立会话。

`src/integrations/grafanaMcp.ts` 封装了这一流程：

- 使用 `google-auth-library` 的 `JWT` 客户端，根据服务账号邮箱和私钥为目标 IAP Audience 自动签发 ID Token。
- 在每次请求时附带 `Authorization: Bearer <id_token>` 头部，并维护一个内存级 CookieJar（解析 `Set-Cookie` 头、缓存过期时间），确保后续请求直接复用 Grafana 会话。
- 通过递归 `fetch` 实现最多 5 次的 30x 重定向追踪，遇到再次跳转到 Google 登录页时会抛出错误，以便及早发现凭据配置问题。
- 探测 401/403 响应时自动清理会话 Cookie 并重新发起登录流程，保证长时间运行的自动化分析不会因为会话过期而失败。
- 提供 `searchDashboards`、`getDashboard`、`listDatasources` 与 `getPanelDefinition` 等高阶方法，便于从 Grafana 面板中提取 CPU/内存/POD/HPA 指标配置。

### 凭据配置

Grafana MCP Agent 支持以下方式提供 Google 服务账号凭据：

- 通过环境变量：
  - `GRAFANA_BASE_URL` / `GRAFANA_URL`
  - `GRAFANA_GOOGLE_CLIENT_EMAIL` / `GRAFANA_CLIENT_EMAIL`
  - `GRAFANA_GOOGLE_PRIVATE_KEY` / `GRAFANA_PRIVATE_KEY`（注意将转义换行 `\n` 替换为真实换行）
  - 可选的 `GRAFANA_GOOGLE_TARGET_AUDIENCE` / `GRAFANA_IAP_TARGET_AUDIENCE`
  - 或者提供包含 `client_email`、`private_key` 字段的 JSON：`GRAFANA_SERVICE_ACCOUNT_JSON` / `GRAFANA_GOOGLE_CREDENTIALS`
- 在调用工具时直接传入 `credentials` 覆盖（支持 JSON 原文或 base64 编码的服务账号内容）。

## 示例：检索 Grafana 面板

在 Mastra 中加载 agent 后，可通过结构化指令执行常见运维查询，例如：

```ts
import { grafanaMcpAgent } from "./src/agents/grafanaMcpAgent";

const result = await grafanaMcpAgent.invoke({
  action: "getPanel",
  uid: "nS8n1A4Vz",
  panelId: 12,
  credentials: {
    baseUrl: "https://grafana.ops.example.com",
    serviceAccountJson: process.env.GRAFANA_SERVICE_ACCOUNT_JSON!,
  },
});

console.log(result.panel);
```

在实际对话/自动化场景中，代理会：

1. 使用服务账号换取对应 IAP Audience 的 ID Token。
2. 访问 Grafana 并自动跟随重定向，直到获得有效的 `grafana_session`。
3. 调用 Grafana REST API 获取仪表盘及面板定义，并返回结构化结果供 CPU/内存/POD/HPA 指标分析使用。

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