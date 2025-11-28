# 可视化助手 VS Code 扩展

> 🚀 通过一个侧边栏扩展同时完成 MCP 文档速览与 Git 分支流程可视化操作。

本扩展针对 Mastra MCP 项目定制，安装后会在 VS Code 资源管理器侧边栏新增 **MCP 可视化** 视图，提供两个标签页：

1. **MCP 列表**：自动扫描当前工作区的 MCP 功能 README，点击即可在 Webview 中阅读。
2. **Git 分支视图**：以流程图展示研发阶段（需求、开发、测试、预发、生产等）与对应分支策略，可直接在图上切换状态与 Git 分支。

---

## 功能详解

### MCP 功能列表

- 默认搜索路径覆盖项目根目录与 `docs/**/README.md`、`packages/**/README.md` 等常见文档位置。
- 默认搜索路径覆盖项目根目录与 `docs/**/README.md`、`packages/**/README.md` 等常见文档位置，可通过配置项
  `mcpVisualizer.docSearchPaths` 追加或调整（默认包含 docs/extensions/prompts/packages/apps/services/mcp/src）。
- 通过 Node.js `fs/promises` 模块读取 Markdown 内容，并使用 `marked` 渲染成 HTML。
- 文档加载后会缓存到 Webview，切换条目时无需重新读取磁盘，提升切换速度。
- 提供命令 **“MCP 可视化: 刷新文档索引”**，可在新增/删除 README 后立即刷新列表。

### Git 分支流程图

- 以流线型图示表达需求→开发→测试→预发→生产的生命周期，并配套说明文字与分支规范。
- 每个阶段节点可点击，右侧面板会展示该阶段需要完成的动作及建议使用的目标分支（如 `feature/*`、`release/*`、`hotfix/*` 等）。
- 分支节点支持直接执行 `git checkout <branch>`。若分支不存在，扩展会提示并引导创建。
- 生命周期状态切换通过消息通道反馈给 Webview，确保图示状态与当前阶段一致。
- 侧边栏顶部新增界面语言切换按钮，可在中英文之间一键切换，并保持主题与视图状态。

---

## 环境要求

- Node.js ≥ 18
- npm ≥ 9
- VS Code ≥ 1.84（`package.json` 中的 `engines.vscode` 可调整）

首次克隆仓库后，在 VS Code 中打开 `extensions/mcp-visualizer` 目录即可开始开发或调试。

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
   - 运行 `npm run watch` 持续编译 TypeScript。
   - 按 `F5` 启动扩展开发主机，等待新的 VS Code 窗口打开。
   - 在侧边栏找到 **MCP 可视化** 视图，验证 MCP 列表与 Git 分支视图是否可用。

4. **打包发布**
   - 如未安装 `vsce`，执行 `npm install -g @vscode/vsce` 或 `npm install @vscode/vsce --save-dev`。
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
3. 点击任何文档条目，即可在右侧阅读 README 内容。支持顶部下拉快速搜索。
4. 切换到 **Git 分支视图**：
   - 点击阶段卡片（需求、开发、测试、预发、生产等）以查看阶段说明与标准动作。
   - 在流程图上点击分支节点以切换 Git 分支，或通过命令面板执行“刷新 MCP 可视化”同步最新分支。
   - 若执行失败，会弹出提示并在图形上标注错误。

---

## 常见问题 (FAQ)

| 问题                   | 解决方案                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| 侧边栏没有显示扩展视图 | 确认已在 VS Code 中选择 `资源管理器` 视图容器，或在命令面板搜索 `MCP 可视化: 打开视图`。        |
| 无法读取 README 文档   | 检查工作区是否包含 README，或将文档放置在 `docs/**/README.md`、`packages/**/README.md` 等路径。 |
| Git 分支切换失败       | 确认工作区初始化了 Git 仓库，并存在对应分支。必要时手动创建后再尝试切换。                       |
| 打包命令报错           | 确认已安装 `vsce`，并在项目根目录执行 `npm run compile` 后再运行 `npm run package`。            |

---

## 代码架构约定

- `src/activation/`：统一注册扩展能力，便于在同一入口管理多个特性。
- `src/features/`：按功能域划分的实现，每个特性保持命令、Provider 与前端资源内聚。
- `src/services/`：与 VS Code 无关的业务服务层，可在多特性之间复用。
- `src/shared/`：命令基类、工作区工具、国际化等跨业务的通用模块。

---

## 目录结构

```
extensions/mcp-visualizer
├── .github/                   # CI 工作流与 Issue 模板
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── .vscode/                   # 调试、推荐扩展与工作区设置
├── .eslintrc.js               # ESLint 配置
├── .prettierrc                # Prettier 配置
├── assets/                    # Webview 静态资源
│   ├── icons/
│   ├── scripts/
│   │   └── main.js
│   └── styles/
│       └── main.css
├── package.json               # 扩展元数据、命令、贡献点与构建脚本
├── README.md                  # 使用说明（本文档）
├── src/
│   ├── activation/            # 集中注册扩展能力
│   ├── features/
│   │   └── visualizer/        # MCP 可视化功能聚合
│   │       ├── commands/      # VS Code 命令定义
│   │       ├── data/          # 生命周期等静态数据
│   │       ├── providers/     # Webview Provider 与消息处理
│   │       └── webview/       # HTML 构建与前端渲染
│   │           └── templates/ # Webview 模板片段
│   ├── services/
│   │   ├── docs/              # 文档索引与 Markdown 解析
│   │   └── git/               # Git 集成操作
│   ├── shared/
│   │   ├── commands/          # 命令基类等通用抽象
│   │   ├── localization/      # 文案本地化
│   │   └── workspace/         # 工作区工具函数
│   ├── types/                 # 插件类型定义
│   └── extension.ts           # 扩展激活入口
├── test/
│   ├── integration/           # 预留的集成测试目录
│   └── unit/                  # 预留的单元测试目录
├── tsconfig.json              # TypeScript 配置
└── dist/                      # TypeScript 编译输出（运行时产物）
```

> 提示：`dist/` 目录由 `npm run compile` 自动生成，不建议手动修改。

---

## 贡献指南

欢迎提交 Issue 或 Pull Request，用于：

- 补充新的 MCP README 搜索路径或内容展示样式；
- 优化 Git 流程图、分支策略或命令行为；
- 增加国际化支持、主题适配等功能。

在提交之前请确保通过 `npm run compile` 与 `npm run lint`，并为新增逻辑编写必要注释，保持代码可维护性。
