# Mastra Agent 服务概览

本文档梳理 `src/agents` 目录下已经实现的 Agent，介绍其职责、依赖文件与主要能力，方便快速查阅与扩展。

## 注册入口

所有 Agent 都在 [`src/agents/index.ts`](../src/agents/index.ts) 中统一导出，并在运行时注册到 Mastra 平台。新增 Agent 时记得同步更新该文件，确保能够被加载。

## 示例代理（`src/agents/examples`）

### Echo Agent
- **位置**：[`src/agents/examples/echoAgent.ts`](../src/agents/examples/echoAgent.ts)
- **用途**：调试环境的最小示例，将用户输入原样返回，验证 Agent 注册与调用流程是否正常。
- **系统提示**：固定告知模型“仅重复用户输入”，无额外工具依赖。

### Summarizer Agent
- **位置**：[`src/agents/examples/summarizerAgent.ts`](../src/agents/examples/summarizerAgent.ts)
- **用途**：将输入文本压缩成简洁的要点列表，适合演示 `instructions` 与 `system` 提示的组合使用。
- **工具**：无，所有能力由语言模型完成。

### Prompt Library Agent
- **位置**：[`src/agents/examples/promptLibraryAgent.ts`](../src/agents/examples/promptLibraryAgent.ts)
- **用途**：从仓库 `prompts/` 目录读取 Markdown 提示词，解析内联注释元数据后返回结构化结果，方便其他 Agent 复用。
- **工具**：暴露 `loadPrompt` 工具，参数为 `promptName`，内部会：
  1. 拼接 `prompts/<promptName>.md` 路径并读取文件内容；
  2. 解析 HTML 注释形式的元数据块（例如名称、描述、版本等）；
  3. 返回去除注释后的 Markdown 文本与解析后的 `metadata`。
- **容错**：若文件不存在会抛出“未找到提示文件”异常，其他读取错误则原样上抛，便于调用方定位问题。

## 质量保障代理（`src/agents/quality`）

### Code Review Agent
- **位置**：[`src/agents/quality/codeReviewAgent.ts`](../src/agents/quality/codeReviewAgent.ts)
- **职责**：生成中文代码审查报告，优先读取仓库根目录的 `instructions.md` 与 `prompts/codeReviewDefault.md`，在缺失时回退到内置的默认提示词。
- **实现要点**：
  - 自动向上解析到仓库根目录，保证无论从哪个子目录执行都能读取到指令文件。
  - 合并项目指令、默认提示词以及额外约束（如标注文件路径与行号），形成最终的系统提示。

### Code Guidelines MCP Agent
- **位置**：[`src/agents/quality/codeGuidelinesMcp.ts`](../src/agents/quality/codeGuidelinesMcp.ts)
- **职责**：读取仓库 `package.json`，根据依赖推断使用的技术栈（Nuxt 2、Vue 2、MidwayJS、Egg.js 等），自动生成 `.rules` 代码规范文档。
- **工具**：提供 `injectCodeRulesDocument` 工具，可根据传入的 `customContent` 或自动检测结果生成规范，支持通过 `overwrite` 参数控制是否覆盖已有 `.rules`。
- **容错**：
  - 若缺少 `package.json` 会回退到默认技术栈列表；
  - `.rules` 写入失败时会抛出详细错误信息，提醒检查权限或磁盘空间。

## 集成类代理（`src/agents/integrations`）

### Git MCP Agent
- **位置**：[`src/agents/integrations/gitMcpAgent.ts`](../src/agents/integrations/gitMcpAgent.ts)
- **职责**：封装常见 Git 操作与研发生命周期提醒，支持 `status`、`pull`、`commit`、`merge`、`checkout`、`createBranch`、`push` 以及 `lifecycleGuide` 等动作。
- **核心能力**：
  - 统一的 `runGitCommand` 方法，带最大缓冲区限制，适配大型仓库输出；
  - 可选的预提交审查流程，会采集暂存区 diff 并拼接审查提示词；
  - 生命周期指引（需求澄清、开发、提测、体验、验收、发布、运营），为每个阶段提供推荐分支、命令和注意事项；
  - 结合 `.kai/instructions.md` 自定义提醒，与仓库约定的工作流保持一致。
- **工具**：通过 `gitWorkflowTool` 暴露上述能力，所有动作返回结构化的执行结果、提醒与推荐命令列表。

### Grafana MCP Agent
- **位置**：[`src/agents/integrations/grafanaMcpAgent.ts`](../src/agents/integrations/grafanaMcpAgent.ts)
- **职责**：通过内部的 `GrafanaMcpClient` 与 Grafana API 交互，处理 Google IAP 登录、会话复用与仪表盘/数据源查询。
- **工具**：提供 `grafanaMcp` 操作，支持 `searchDashboards`、`getDashboard`、`listDatasources`、`getPanel` 等子命令。
- **配置回退**：
  - `baseUrl`、服务账号 JSON、Google 凭证等参数可来自工具输入或环境变量；
  - 支持 base64 编码的服务账号内容，自动归一化私钥中的换行符；
  - 同一 `baseUrl + clientEmail` 组合会复用客户端实例，避免重复登录。

---

若需新增 Agent，可参考上述模式：
1. 在对应目录创建实现文件，补充必要的输入校验与错误提示；
2. 在 [`src/agents/index.ts`](../src/agents/index.ts) 中导出实例；
3. 在 `docs/` 内同步更新说明，保持文档与实现一致。
