# Mastra Agents Project

This repository contains a Mastra project scaffolded in an offline environment. It includes example agents and configuration files to get started quickly once dependencies are available.

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
- `src/agents` – Example agent definitions, including a prompt library agent that reads Markdown prompt files.
- `src/index.ts` – Entry point that registers the agents with Mastra.
- `prompts` – Markdown prompt definitions consumed by the prompt library agent.
- `src/integrations/grafanaMcp.ts` – Low-level Grafana client that handles Google IAP authentication, redirect following, cookie persistence, and REST helpers.
- `src/agents/grafanaMcpAgent.ts` – Mastra agent exposing the Grafana MCP client as structured tools for dashboard and datasource inspection workflows.

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
