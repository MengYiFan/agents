# Mastra Agents 项目

该仓库在离线环境下手工还原了 Mastra 项目骨架，内置示例代理、Grafana 集成以及一个 VS Code 扩展，方便在恢复网络后迅速进入开发节奏。

## 快速开始

1. **安装依赖**（需要访问 npm registry）：
   ```bash
   npm install
   ```
2. **启动 Mastra 开发服务器**：
   ```bash
   npm run dev
   ```
3. **构建 TypeScript 源码**：
   ```bash
   npm run build
   ```
4. **运行编译产物**：
   ```bash
   npm start
   ```

> 💡 由于初始化环境无法执行 `npx mastra@latest init`，仓库结构由脚本手动搭建；待依赖安装完成后，上述命令与官方脚手架保持一致。

## 目录结构

```
.
├── docs/                       # MCP 代理与集成的扩展文档
├── extensions/
│   └── mcp-visualizer/         # VS Code 扩展：展示 MCP 文档与 Git 生命周期
├── prompts/                    # 被提示库代理读取的 Markdown 提示词
├── src/
│   ├── agents/
│   │   ├── examples/           # 基础示例代理（Echo、Summarizer、Prompt Library）
│   │   ├── integrations/       # Git、Grafana 等外部系统集成代理
│   │   ├── quality/            # 代码评审、规范生成类代理
│   │   └── index.ts            # 统一导出所有代理供运行时注册
│   ├── integrations/           # Grafana MCP 等底层服务客户端
│   └── index.ts                # Mastra 运行时入口
├── instructions.md             # 被代码审查代理优先加载的项目指令
└── mastra.config.ts            # Mastra 运行时配置
```

`src/agents/index.ts` 负责集中导出代理实例，使 `src/index.ts` 仅专注于初始化 Mastra 运行时；同时将代理按用途拆分到 `examples`、`integrations`、`quality` 子目录，方便后续扩展与维护。

## 主要代理与能力

- **Prompt Library Agent**（`src/agents/examples/promptLibraryAgent.ts`）：提供 `prompts/` 目录下的提示词查询接口。
- **Code Review Agent**（`src/agents/quality/codeReviewAgent.ts`）：优先加载 `instructions.md` 再合并 `prompts/codeReviewDefault.md`，确保审查报告遵循项目规范。
- **Code Guidelines MCP**（`src/agents/quality/codeGuidelinesMcp.ts`）：解析 `package.json`，自动生成 `.rules` 代码规范文档，适配 Nuxt 2、Vue 2、MidwayJS、Egg.js 等框架。
- **Git MCP Agent**（`src/agents/integrations/gitMcpAgent.ts`）：封装 Git 常用命令、研发生命周期提醒以及可选的预提交审查流程。
- **Grafana MCP Agent**（`src/agents/integrations/grafanaMcpAgent.ts`）：调用 `src/integrations/grafanaMcp.ts`，自动完成 Google IAP 登录、Cookie 维护与仪表盘 API 调用。

更多细节可参考 `docs/` 目录，例如 [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md) 中提供的调用示例与自定义说明。

## 开发与调试建议

- **类型检查**：执行 `npx tsc --noEmit` 进行一次性检查，或使用 `npx tsc --watch` 持续监听文件变动。
- **调试日志**：在代理处理函数内增加 `console.log`，无论通过 `npm run dev` 还是 `npm start` 启动，都可在终端查看输出。
- **Node.js 调试模式**：构建完成后使用 `node --inspect-brk dist/index.js`，随后在 Chrome DevTools、VS Code 等工具中附加调试器。
- **快速体验代理**：执行 `node dist/index.js`（或 `npm start`）将触发示例脚本，展示 Echo 与 Summarizer 代理的调用结果。

## VS Code 使用指南

1. **打开工作区**：在 VS Code 中选择「文件 → 打开文件夹…」，定位到仓库根目录。
2. **推荐扩展**：启用 TypeScript 内置功能，并安装「ESLint」「Prettier - Code formatter」等扩展保持代码风格一致。
3. **调试配置**：在 `launch.json` 中新增如下配置以调试开发服务器：
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
4. **附加到编译产物**：终端执行 `node --inspect dist/index.js`，再使用 VS Code 的「Node.js: Attach」模板连接到 `9229` 端口。
5. **启用 MCP 可视化扩展**：仓库自带 `extensions/mcp-visualizer` 扩展，可在 VS Code 中打开该文件夹后依次执行：
   ```bash
   npm install
   npm run watch
   ```
   按 `F5` 启动扩展调试窗口，即可在侧边栏查看 MCP 文档列表、Git 生命周期流程图，并通过命令「MCP 可视化: 刷新文档索引」即时更新内容。若需发布扩展，运行 `npm run package` 生成 `.vsix`，再通过「Extensions: Install from VSIX…」安装。

## 参考资料

- [`docs/code-guidelines-mcp.md`](./docs/code-guidelines-mcp.md)：代码规范代理的完整使用指南。
- [`docs/lark-google-auth.md`](./docs/lark-google-auth.md)：飞书与 Google 身份认证相关说明。
- [`extensions/mcp-visualizer/README.md`](./extensions/mcp-visualizer/README.md)：VS Code 扩展的详细开发、调试与发布流程。

在需要穿越 Google IAP 的环境中，可结合本 README 与 `src/integrations/grafanaMcp.ts` 内的中文注释，了解 ID Token 刷新、重定向处理与会话保持的实现细节。
