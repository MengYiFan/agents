# Mastra Agents 工作空间

该仓库在离线环境下手动还原了一个 Mastra 项目，用来演示如何注册多个代理、通过示例脚本验证运行时、并复用集成能力（Grafana MCP、
Git 自动化、Google/Lark SSO 辅助工具），即便无法使用官方的 `mastra init` 脚手架也能快速上手。

整体结构与 Mastra CLI 生成的项目保持一致，可直接用于学习代理装配方式、接入现有开发流程，或作为团队自动化的起点。

## 环境要求

- Node.js **18+**（Mastra 依赖原生 `fetch`）。
- 能访问 npm registry，用于安装 `package.json` 中的依赖。
- 可选：若要体验 Grafana / Lark 集成，需要对应的 Google IAP 服务账号与 Lark OAuth 应用凭证。

## 快速开始

```bash
npm install          # 安装 Mastra、TypeScript 及项目依赖
npm run dev          # 启动支持热更新的 Mastra 开发服务器
npm run build        # 将 TypeScript 源码编译至 dist/
npm start            # 执行编译产物（运行示例流程）
```

> ℹ️ 初始化环境无法执行 `npx mastra@latest init`，因此目录由脚本手动搭建；依赖安装完成后，上述命令与官方模板一致。

### 体验示例流程

入口文件（`src/index.ts`）演示了如何以编程方式调用代理：

```ts
const echoResponse = await mastra.run("echo-agent", { prompt: "Hello Mastra!" });
const summaryResponse = await mastra.run("summarizer-agent", {
  prompt: "Mastra helps developers build AI agents with batteries-included tooling.",
});
```

执行 `npm start` 即可在终端看到两个代理的返回结果，用于验证运行时串接是否正确。

## 目录结构

```
.
├── docs/                       # MCP 代理与集成的延伸文档
├── extensions/
│   └── mcp-visualizer/         # VS Code 扩展：展示 MCP 文档与 Git 生命周期助手
├── prompts/                    # 由提示库代理读取的 Markdown 提示词
├── src/
│   ├── agents/
│   │   ├── examples/           # Echo、Summarizer、Prompt Library 等示例代理
│   │   ├── integrations/       # Git、Grafana 等外部系统集成代理
│   │   ├── quality/            # 代码评审与 .rules 自动化代理
│   │   └── index.ts            # 统一导出所有代理供运行时注册
│   ├── integrations/           # Grafana MCP、Google 认证、Lark SSO 等底层客户端
│   └── index.ts                # Mastra 运行时入口与示例脚本
├── instructions.md             # 代码审查代理优先加载的项目指令
└── mastra.config.ts            # 定义启用代理的 Mastra 配置
```

代理按照职责分组，后续扩展时只需在对应子目录新增文件并在 `src/agents/index.ts` 中导出即可。

## 代理一览

| 代理名称 | 主要作用 | 位置 | 工具 |
| --- | --- | --- | --- |
| `echo-agent` | 原样回显用户输入。 | `src/agents/examples/echoAgent.ts` | 无 |
| `summarizer-agent` | 输出精炼的要点摘要。 | `src/agents/examples/summarizerAgent.ts` | 无 |
| `prompt-library-agent` | 解析 Markdown 提示词，读取注释元数据并返回结构化结果。 | `src/agents/examples/promptLibraryAgent.ts` | `loadPrompt`（读取 `prompts/<name>.md`） |
| `code-review-agent` | 合并 `instructions.md` 与 `prompts/codeReviewDefault.md`，生成中文审查要点。 | `src/agents/quality/codeReviewAgent.ts` | 无 |
| `code-guidelines-mcp` | 根据依赖特征生成/更新 `.rules` 规范文档，支持 Nuxt 2、Vue 2、MidwayJS、Egg.js。 | `src/agents/quality/codeGuidelinesMcp.ts` | `injectCodeRulesDocument` |
| `git-mcp-agent` | 封装 Git 命令、分支规范检查、研发生命周期提醒及可选的预提交审查。 | `src/agents/integrations/gitMcpAgent.ts` | `gitWorkflow`、`lifecycleGuide` |
| `grafana-mcp-agent` | 自动处理 Google IAP 登录、Cookie 刷新与面板解析，统一访问 Grafana API。 | `src/agents/integrations/grafanaMcpAgent.ts` | `grafanaMcp` |

更多输入输出示例、生命周期定义和故障排查建议，参见 `docs/` 目录。

## 集成与环境变量

### Grafana MCP（Google IAP）

`src/integrations/grafanaMcp.ts` 通过服务账号换取 Google ID Token，自动缓存 Cookie 并处理多次重定向，适用于 IAP 保护的 Grafana 实例。
可通过工具参数或以下环境变量配置凭证：

- `GRAFANA_BASE_URL` / `GRAFANA_URL`
- `GRAFANA_GOOGLE_CLIENT_EMAIL` / `GRAFANA_CLIENT_EMAIL`
- `GRAFANA_GOOGLE_PRIVATE_KEY` / `GRAFANA_PRIVATE_KEY`（注意将 `\n` 替换为真实换行）
- `GRAFANA_SERVICE_ACCOUNT_JSON` / `GRAFANA_GOOGLE_CREDENTIALS`（可替代单独字段）
- `GRAFANA_GOOGLE_TARGET_AUDIENCE` / `GRAFANA_IAP_TARGET_AUDIENCE`

代理同样支持在调用时传入原始或 Base64 编码的 `serviceAccountJson` 字段，用于临时覆盖配置。

### Google 登录请求辅助

`fetchWithGoogleAuth`（`src/integrations/googleAuthSession.ts`）可将任意 `fetch` 请求升级为通过 Google 登录的调用：

1. 通过 `sessionProvider` 获取或刷新包含 Cookie 的会话。
2. 自动跟随重定向，若命中 Google 登录地址会强制刷新会话。
3. 搭配 `TokenStore` 将 Cookie 持久化，避免频繁登录。

适合复用到其他依赖 Google SSO 的 MCP 客户端中。

### Lark + Google SSO 桥接

`LarkGoogleAuthManager`（`src/integrations/larkGoogleAuth.ts`）可在 Lark OAuth 流程中强制用户走企业 Google 登录，支持刷新、吊销令牌及
发起带重试的授权请求。详细示例见 [`docs/lark-google-auth.md`](./docs/lark-google-auth.md)。

### Git 生命周期自动化

Git MCP 代理内置了阶段化的默认配置（`src/agents/integrations/gitMcpAgent.ts`）：

- 针对「需求澄清 → 发布」各阶段的分支命名规范与关键分支列表。
- 当 `preCommitReview.enabled` 为 `true` 时自动执行 `git add` 并收集暂存区 diff。
- 支持读取 `.kai/instructions.md`，将团队内部规范合并到审查提示中。

更多 JSON 调用示例与返回字段说明见 [`docs/git-mcp/README.md`](./docs/git-mcp/README.md)。

## 开发建议

- **类型检查**：`npx tsc --noEmit`
- **增量编译**：`npx tsc --watch`
- **运行时冒烟测试**：`npm start`
- **调试编译产物**：`node --inspect-brk dist/index.js`，再在浏览器或 VS Code 中附加调试器。
- **日志定位**：在代理中加入 `console.log`，无论通过 `npm run dev` 还是 `npm start` 启动都能看到输出。

## VS Code 扩展

仓库附带的 `extensions/mcp-visualizer` 可在 VS Code 内显示 MCP 文档与 Git 生命周期图示：

```bash
cd extensions/mcp-visualizer
npm install
npm run watch   # 启动扩展调试主机
```

在 VS Code 中按 `F5` 即可启动新的调试窗口。准备分发时，执行 `npm run package` 会生成可安装的 `.vsix` 包。

## 参考资料

- [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md)：`.rules` 文档生成流程与自定义技巧。
- [`docs/git-mcp/README.md`](./docs/git-mcp/README.md)：Git MCP 命令参考与最佳实践。
- [`docs/lark-google-auth.md`](./docs/lark-google-auth.md)：Lark OAuth + Google SSO 辅助工具说明。
- [`extensions/mcp-visualizer/README.md`](./extensions/mcp-visualizer/README.md)：VS Code 扩展的开发、调试与打包指引。
