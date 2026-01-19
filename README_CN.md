# Mastra Agents 工作区

基于 Mastra 的 AI 代理平台，支持 MCP（模型上下文协议），集成 Claude Skills 和精简的服务集成。

## 架构概览

```
┌─────────────────────────────────────────────┐
│           Claude Skills（指导层）            │
│  sentry-fix | code-review | code-style | ...│
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│          Mastra Agents（API 执行层）         │
│    sentry-mcp-agent | grafana-mcp-agent     │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│           MCP Server（HTTP 桥接）            │
│         http://localhost:4120/mcp            │
└─────────────────────────────────────────────┘
```

## 快速开始

```bash
npm install           # 安装依赖
npm run dev           # 启动 Mastra 开发服务器（端口 4111）
npm run mcp           # 启动 MCP HTTP 桥接服务（端口 4120）
npm run build         # 编译 TypeScript
```

## 项目结构

```
├── skills/                    # Claude Skills（SKILL.md + scripts/）
│   ├── sentry-fix/            # Sentry Issue 修复流程
│   ├── code-review/           # 代码审查规范
│   ├── code-style/            # 代码风格（Nuxt/Vue/Midway）
│   ├── code-commit/           # Git 提交流程（使用 yummy）
│   └── lark-notify/           # 飞书通知
├── src/mastra/
│   ├── agents/                # Mastra Agents
│   │   ├── examples/          # Echo agent（健康检查）
│   │   ├── integrations/      # Sentry MCP agent
│   │   └── grafana/           # Grafana MCP agent
│   └── integrations/          # 底层客户端（Grafana、Sentry、认证）
├── mcp/                       # MCP HTTP 服务桥接
└── extensions/                # VS Code 扩展
```

## 已注册的 Agents

| Agent | 用途 | 工具 |
|-------|------|------|
| `echo-agent` | 健康检查，回显输入 | 无 |
| `grafana-mcp-agent` | 通过 Google IAP 访问 Grafana API | `grafanaMcp` |
| `sentry-mcp-agent` | Sentry Issue 分析与告警 | `sentryMcp` |

## Claude Skills

Skills 为 AI 助手提供结构化指导。在对话中使用 `@skill-name` 引用。

| Skill | 用途 |
|-------|------|
| `@sentry-fix` | 完整的 Sentry Issue 修复流程 |
| `@code-review` | 代码审查规范（P0/P1/P2 分级） |
| `@code-style` | 代码风格（Nuxt 2、Vue 2、Midway/Egg） |
| `@code-commit` | Git 提交流程（使用 yummy CLI） |
| `@lark-notify` | 飞书通知 |

## 环境变量配置

### Sentry MCP

在 VS Code `settings.json` 中配置：

```json
{
  "mcp": {
    "servers": {
      "sentry": {
        "command": "npx",
        "env": { "SENTRY_ACCESS_TOKEN": "sntrys_{your_token}" },
        "args": ["-y", "mcp-remote@latest", "https://mcp.sentry.dev/mcp"],
        "type": "stdio"
      }
    }
  }
}
```

### Grafana MCP（Google IAP）

```bash
GRAFANA_BASE_URL=https://grafana.example.com
GRAFANA_GOOGLE_CLIENT_EMAIL=sa@project.iam.gserviceaccount.com
GRAFANA_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GRAFANA_GOOGLE_TARGET_AUDIENCE=xxx.apps.googleusercontent.com
```

## 开发指南

```bash
npm run dev           # Mastra 开发服务器（热重载）
npm run mcp           # MCP 桥接服务
npx tsc --noEmit      # 类型检查
npx tsc --watch       # 监听模式
```

## VS Code 扩展

```bash
cd extensions/mcp-visualizer
npm install
npm run watch         # 开发模式
npm run package       # 构建 .vsix
```

详见 [extensions/mcp-visualizer/README.md](./extensions/mcp-visualizer/README.md)。

## 许可证

MIT
