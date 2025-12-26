# 可视化助手 VS Code 扩展 (MCP Visualizer)

> 🚀 通过一个侧边栏扩展同时完成 MCP 文档速览与 Git 分支流程可视化操作。

[English](./README.md)

本扩展针对 Mastra MCP 项目定制，安装后会在 VS Code 资源管理器侧边栏新增 **MCP 可视化** 视图，提供两个标签页：

1. **MCP 列表**：自动扫描当前工作区的 MCP 功能 README，点击即可在 Webview 中阅读。
2. **工作流向导 (Workflow Guide)**：以流程图展示研发阶段（需求、开发、测试、预发、生产等）与对应分支策略，可直接在图上切换状态与 Git 分支。

---

## 功能详解

### MCP 功能列表

- 默认搜索路径覆盖项目根目录与 `docs/**/README.md`、`packages/**/README.md` 等常见文档位置。
- 可通过配置项 `mcpVisualizer.docSearchPaths` 追加或调整搜索路径（默认包含 docs/extensions/prompts/packages/apps/services/mcp/src）。
- 通过 Node.js `fs/promises` 模块读取 Markdown 内容，并使用 `marked` 渲染成 HTML。
- 文档加载后会缓存到 Webview，切换条目时无需重新读取磁盘，提升切换速度。
- 提供命令 **“MCP 可视化: 刷新文档索引”**，可在新增/删除 README 后立即刷新列表。

### Git 工作流可视化

- 以流线型图示表达需求→开发→测试→预发→生产的生命周期。
- 每个阶段节点可点击，右侧面板会展示该阶段需要完成的动作及建议使用的目标分支（如 `feature/*`、`release/*`、`hotfix/*` 等）。
- **交互式操作**：
  - **初始化工作流**：从干净的基础分支创建一个新的 Feature 分支。
  - **开发阶段**：支持提交代码、打 Tag、以及流转到下一个阶段。
  - **发布阶段**：支持将 Feature 分支合并到 Release 分支并推送到远程。
- 状态同步：Webview 会通过消息通道与扩展主机通信，确保界面状态与实际 Git 状态一致。

---

## 技术架构

本扩展采用前后端分离的模块化架构：

### 前端 (`webview-ui`)

- 基于 **React** 和 **Ant Design** 构建。
- **模块化结构**：
  - `modules/workflow/`: 包含核心工作流逻辑。
  - `components/`: 可复用的 UI 组件（如 `WorkflowInitView`, `WorkflowDevView`, `WorkflowStepContent`）。
  - `hooks/`: 自定义 Hook（如 `useWorkflowActions`）用于封装业务逻辑。

### 后端 (`src`)

- **服务化设计**：
  - `WorkflowActionService`: 处理核心业务逻辑（创建分支、提交、状态流转）。
  - `GitService`: 封装 `simple-git` 进行底层 Git 操作。
  - `WorkflowStateManager`: 管理工作流上下文持久化 (`.vscode/workflow-context.json`)。
- **控制器**: `WebviewController` 负责处理 Webview 与 Extension Host 之间的消息传递。

---

## 环境要求

- Node.js ≥ 18
- npm ≥ 9
- VS Code ≥ 1.84

---

## 安装与构建流程

1. **安装依赖**

   ```bash
   cd extensions/mcp-visualizer
   npm install
   ```

2. **代码规范检查**
   - 运行 `npm run lint` 执行 ESLint 检查。
   - 使用 `npm run format` 可一键应用 Prettier 格式化规则。

3. **开发调试**
   - 运行 `npm run watch` 持续编译后端 TypeScript。
   - 运行 `npm run watch:webview` (或 `cd webview-ui && npm run dev`) 启动前端构建。
   - 按 `F5` 启动扩展开发主机，等待新的 VS Code 窗口打开。
   - 在侧边栏找到 **MCP 可视化** 视图，验证功能是否正常。

4. **打包发布**
   - 如未安装 `vsce`，执行 `npm install -g @vscode/vsce`。
   - 构建并打包：
     ```bash
     npm run compile
     npm run package
     ```
   - 执行后会在 `extensions/mcp-visualizer` 目录下生成 `.vsix` 文件，可通过 VS Code 命令面板 `Extensions: Install from VSIX...` 安装。

---

## 使用说明

1. 在 VS Code 中打开含 MCP 功能的项目工作区。
2. 展开侧边栏中的 **MCP 可视化** 视图，默认显示 **MCP 列表** 标签页。
3. 点击任何文档条目，即可在右侧阅读 README 内容。
4. 切换到 **Git 分支视图**：
   - 按照向导步骤管理您的开发生命周期。
   - 使用界面提供的按钮来创建分支、提交代码和推送变更。

---

## 目录结构

```
extensions/mcp-visualizer
├── webview-ui/                # React 前端
│   ├── src/
│   │   ├── modules/
│   │   │   └── workflow/      # 工作流模块 (前端)
│   │   │       ├── components/  # UI 组件
│   │   │       ├── hooks/       # 逻辑 Hooks
│   │   │       └── WorkflowRenderer.tsx
│   │   └── App.tsx
├── src/                       # 扩展后端
│   ├── modules/
│   │   └── workflow/          # 工作流模块 (后端)
│   │       ├── services/      # 逻辑服务层 (如 WorkflowActionService)
│   │       └── WebviewController.ts
│   ├── services/              # 通用服务 (Git 等)
│   └── extension.ts           # 入口文件
├── package.json
└── README.md
```

---

## 贡献指南

欢迎提交 Issue 或 Pull Request！在提交之前，请确保运行 `npm run lint` 和 `npm run compile` 以验证代码质量。
