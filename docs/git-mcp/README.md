# Git MCP 使用说明

本说明文档介绍如何在 Mastra 运行时中使用 Git MCP Agent，以便在需求全生命周期内执行规范的分支操作、触发代码审查以及获取阶段性提示信息。

## Agent 概览

Git MCP Agent 在 `src/agents/gitMcpAgent.ts` 中定义，并在 `src/index.ts` 里注册到 Mastra Runtime。它对外暴露两个工具：

- **`gitWorkflow`**：执行 Git 相关命令并返回操作结果、提醒与推荐指令。
- **`lifecycleGuide`**：根据需求生命周期阶段提供规范分支、操作步骤与下一阶段提示。

所有调用均会在当前工作目录下执行 `git`，请确保在一个已经初始化的 Git 仓库中运行。

## 使用方式

### 1. 触发 gitWorkflow

`gitWorkflow` 工具接收以下参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `action` | `"status" \| "pull" \| "commit" \| "merge" \| "checkout" \| "createBranch" \| "push" \| "lifecycleGuide"` | 是 | 需要执行的 Git 工作流动作。|
| `options` | `Record<string, unknown>` | 否 | 针对不同动作的可选参数，例如 `branch`, `message`, `paths` 等。|
| `preCommitReview` | `{ enabled?: boolean; reviewPrompt?: string; approval?: boolean; }` | 否 | 仅在 `action: "commit"` 时生效的预提交审查配置。|

每次调用会返回 `GitOperationResult`，包含以下字段：

- `executedCommands`：实际运行的 Git 命令列表。
- `output`：命令执行结果的合并输出。
- `reminders`：与当前动作及生命周期阶段相关的提醒事项。
- `recommendedCommands`：下一步可执行的推荐指令。
- `branchCompliance`：当前分支是否符合命名规范及调整建议。
- `lifecycle`：若提供了生命周期阶段，返回该阶段的说明、关键步骤与下一阶段提示。
- `review`：当启用预提交审查时，给出汇总提示、暂存区 diff 以及是否需要继续的状态。

### 2. 生命周期阶段指引

`options.stage` 或 `options.lifecycleStage` 支持以下键值：

| 阶段键 | 中文阶段 | 主要分支 | 核心提醒 |
| --- | --- | --- | --- |
| `clarify` | 需求澄清 | `master`、`feature/<需求号>-<简述>` | 从最新 master 派生需求分支，命名需包含需求编号。 |
| `development` | 开发 | `feature/<需求号>-<简述>` | 在 feature 分支持续开发，自测通过后及时提交推送。 |
| `testing` | 提测 | `feature/<需求号>-<简述>`、`release/<版本号>` | 创建提测分支并与测试环境同步。 |
| `experience` | 体验 | `release/<版本号>` | 面向体验环境的验证，避免直接在 release 分支开发。 |
| `acceptance` | 验收 | `release/<版本号>`、`hotfix/<缺陷号>` | 合并验收反馈，确保回溯记录完整。 |
| `release` | 发布 | `master`、`release/<版本号>` | 合并回 master 并打 tag。 |
| `operation` | 运营 | `master`、`hotfix/<缺陷号>` | 关注线上反馈及紧急修复流程。 |

调用 `gitWorkflow` 时传入 `options.lifecycleStage` 或直接使用 `lifecycleGuide` 工具，都可以获得上述阶段的标准步骤、提醒及推荐命令。

### 3. 预提交代码审查（Pre-commit Review）

在提交前可以通过 `preCommitReview` 选项串联外部审查流程：

```json
{
  "action": "commit",
  "options": {
    "message": "feat: add lifecycle automation"
  },
  "preCommitReview": {
    "enabled": true,
    "reviewPrompt": "请按照团队代码规范检查变更",
    "approval": false
  }
}
```

启用后流程如下：

1. Agent 会读取 `.kai/instructions.md`（若存在）并与 `reviewPrompt` 合并生成审查提示。
2. 返回 `review.status: "pending"` 以及 `review.diff`，供审阅者检查。
3. 待审查通过后，将 `preCommitReview.approval` 置为 `true` 再次调用即可真正执行 `git commit`。

### 4. 常用动作示例

#### 查看仓库状态

```json
{
  "action": "status"
}
```

输出会包含当前分支合规性检查、推荐下一步操作（如 `commit`、`push`）以及在当前生命周期阶段的注意事项。

#### 从远程拉取最新代码

```json
{
  "action": "pull",
  "options": {
    "remote": "origin",
    "branch": "master"
  }
}
```

Agent 会执行 `git pull origin master` 并提醒后续是否需要切换或创建分支。

#### 创建合规需求分支

```json
{
  "action": "createBranch",
  "options": {
    "branch": "feature/REQ-1234-refine-search",
    "source": "master"
  }
}
```

若未指定 `source`，默认从当前分支切出。返回结果会检查分支命名是否满足生命周期要求，并提示相关阶段步骤。

#### 提交代码（带预审）

```json
{
  "action": "commit",
  "options": {
    "message": "feat: support lifecycle guide" ,
    "paths": ["src/agents/gitMcpAgent.ts", "docs/git-mcp/README.md"]
  },
  "preCommitReview": {
    "enabled": true,
    "reviewPrompt": "请确认所有生命周期提醒覆盖需求阶段",
    "approval": true
  }
}
```

当 `approval: true` 时，Agent 会：

1. 自动对 `paths` 中的文件执行 `git add`。
2. 根据 `.kai/instructions.md` 与 `reviewPrompt` 的合并结果提示审查结论。
3. 执行 `git commit -m "..."` 并返回提交摘要、提醒及下一步推荐命令（如 `push`）。

#### 获取阶段说明

```json
{
  "action": "lifecycleGuide",
  "options": {
    "stage": "testing"
  }
}
```

返回指定阶段的详细步骤、关键命令、注意事项和下一阶段名称，帮助团队成员快速对齐。

## 最佳实践

- **保持分支命名一致性**：遵循 `feature/<需求号>-<简述>`、`release/<版本号>`、`hotfix/<缺陷号>` 等模式，Agent 会持续评估是否符合生命周期标准。
- **定期同步主干**：在开发阶段多执行 `pull` 或 `merge master`，减少冲突。
- **善用提醒与推荐指令**：每次调用都会返回可执行的下一步，方便串联完整的流水线。
- **结合团队规范**：通过 `.kai/instructions.md` 将团队已有的代码规范、提交流程引入自动提醒。

## 故障排查

- **Git 命令失败**：`output` 字段会包含 stderr，优先处理报错信息后重试。
- **审查提示为空**：确认仓库根目录存在 `.kai/instructions.md` 或传入 `reviewPrompt`。
- **生命周期未匹配**：确保 `stage` 参数使用支持的键值或中文别名（如 `开发`、`提测`）。

如需扩展新的阶段或自定义命令，可在 `src/agents/gitMcpAgent.ts` 的 `lifecycleGuidance` 字典中新增定义。
