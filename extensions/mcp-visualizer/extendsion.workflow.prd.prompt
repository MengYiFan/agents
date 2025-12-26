# VS Code 插件：研发工作流 (Workflow) PRD v6.0 (配置驱动版)

## 1. 产品核心架构

### 1.1 设计理念

本插件采用 **“配置驱动 UI (Configuration-Driven UI)”** 模式。前端渲染引擎不包含硬编码的业务逻辑，完全依据 JSON 配置渲染 Ant Design 组件。

### 1.2 数据协议

1. **静态配置 (`workflow.config.json`)**：定义步骤流程、表单项、按钮行为。
2. **动态状态 (`.vscode/workflow-context.json`)**：

- **分布式存储**：状态文件存储在当前分支根目录。
- **单一数据源**：记录当前步骤 (`currentStep`)、表单数据 (`formData`) 及历史操作。
- **随码提交**：每次状态变更（如进入下一步），插件自动修改该文件并 Commit，确保多人协作时的状态同步。

---

## 2. 交互视图逻辑

插件根据当前 Git 分支状态，加载不同的配置节点。

### 2.1 视图 A：非开发分支 (初始化视图)

- **触发条件**：当前分支名 **不匹配** `feature/*` 规范。
- **UI 呈现**：不显示步骤条，仅居中显示主按钮。
- **按钮配置**：`Action: LoadStep('init')`。

### 2.2 视图 B：研发流程 (开发视图)

- **触发条件**：当前分支名 **匹配** `feature/*` 规范。
- **UI 呈现**：
- **顶部**：Ant Design `<Steps>` 组件，高亮当前步骤。
- **中部**：根据配置渲染 `<Form>` (表单) 或 `<Descriptions>` (信息)。
- **底部**：操作按钮组。

---

## 3. 详细步骤配置说明

以下逻辑需转化为 `workflow.config.json` 中的具体配置。

### 第一步：基本信息 (Init)

#### 1. 界面配置

- **类型**：`Form` (表单)
- **表单字段**：

1. `prdLink` (URL, 必填): PRD 链接。
2. `designLink` (URL, 选填): 设计稿链接。
3. `meegleId` (Number, 必填): Meege ID。
4. `brief` (Text, 必填): **[新增]** 任务简述 (用于生成分支名 `prd_brief` 部分)。
5. `backendPlan` (URL, 选填): 后端技术方案。
6. `frontendPlan` (URL, 选填): 前端技术方案。

#### 2. 按钮交互

**场景 A：处于非开发分支时**

- **组件**：`BaseBranchSelect` (Dropdown: master/main/current, default: master)。
- **主按钮**：“创建 & 生成开发分支”
- **执行逻辑 (Action: CreateBranch)**：

1. **脏检查**：若有未提交代码 -> 弹窗阻塞 (提供 `Stash` / `ForceClean` 选项)。
2. **执行**：

- `git fetch origin {base}`
- `git checkout -b feature/{meegleId}-{brief} origin/{base}`
- 初始化 `.vscode/workflow-context.json`。
- 自动跳转至第二步。

**场景 B：处于开发分支时 (回看/补填)**

- **主按钮**：“保存 & 下一步”
- 逻辑：校验表单 -> 更新 JSON -> 提交 JSON -> 跳转至第二步。

- **次按钮**：“下一步” (仅当当前步骤已完成时显示)。

---

### 第二步：开发阶段 (Development)

#### 1. 界面配置

- **类型**：`Process` (流程)
- **信息展示**：PRD 链接、设计稿链接 (从 Context 读取)。

#### 2. 按钮交互 (双按钮机制)

- **按钮 A**：“提交代码” (日常操作)
- **样式**：`Default`
- **Action**：`GitCommit` (调用 `git commit`)。
- _说明：此按钮仅提交代码，不流转步骤。_

- **按钮 B**：“提交 & 下一步” (阶段流转)
- **样式**：`Primary`
- **Action**：`Transition`
- **执行逻辑**：

1. 执行 `git commit` (确保最后一次变更已提交)。
2. 打 Tag：`test-feature/{meegleId}-{MMDD}-{hh}-{mm}`。
3. 推送代码和 Tag。
4. 更新状态 `currentStep = 3` 并 Commit。
5. 跳转至第三步。

---

### 第三步：测试阶段 (Testing)

#### 1. 界面配置

- **类型**：`Process`
- **文案**：在 {date} 时间，进入验收阶段 (若已完成)。

#### 2. 按钮交互 (双按钮机制)

- **按钮 A**：“测试问题修复 & 提交”
- **样式**：`Default`
- **Action**：`GitCommit`。

- **按钮 B**：“提交 & 下一步” (测试通过)
- **样式**：`Primary`
- **Action**：`Transition`
- **执行逻辑**：

1. 执行 `git commit`。
2. 打 Tag：`test-feature/{meegleId}-{MMDD}-{hh}-{mm}`。
3. 更新状态 `currentStep = 4` 并 Commit。
4. 跳转至第四步。

---

### 第四步：验收阶段 (Acceptance)

#### 1. 界面配置

- **类型**：`Process`
- **文案**：在 {date} 时间，进入待上线阶段 (若已完成)。

#### 2. 按钮交互 (双按钮机制)

- **按钮 A**：“验收问题修复 & 提交”
- **样式**：`Default`
- **Action**：`GitCommit`。

- **按钮 B**：“提交 & 下一步” (验收通过)
- **样式**：`Primary`
- **Action**：`Transition`
- **执行逻辑**：

1. 执行 `git commit`。
2. 打 Tag：`stage-feature/{meegleId}-{MMDD}-{hh}-{mm}` (**注意 Tag 前缀变化**)。
3. 更新状态 `currentStep = 5` 并 Commit。
4. 跳转至第五步。

---

### 第五步：上线阶段 (Release)

#### 1. 界面配置

- **类型**：`Release`
- **组件**：`RemoteBranchSelect` (异步拉取 `origin/release/**`)。

#### 2. 按钮交互

- **关联按钮**：“合并并推送” (未选分支时置灰)
- **Action**：`MergeAndPush`
- **执行逻辑**：

1. `git fetch` -> `git checkout {release}` -> `git pull`。
2. `git merge feature/{current}`。
3. **冲突处理**：

- **无冲突**：直接 Push -> 流程结束。
- **有冲突**：
- Popup 提示“请先处理冲突”。
- 显示**临时按钮**：“提交代码(请确保已解决完冲突)”。
- 用户点击临时按钮 -> 执行 Commit & Push -> 流程结束。

---

## 4. 配置驱动引擎规范 (Schema)

Antigravity 需依据此 Schema 实现渲染引擎。

```json
{
  "steps": [
    {
      "id": "init",
      "type": "form",
      "fields": [
        { "key": "prdLink", "type": "url", "required": true },
        { "key": "meegleId", "type": "number", "required": true },
        {
          "key": "brief",
          "type": "string",
          "required": true,
          "pattern": "^[a-z0-9-]+$"
        }
        // ... 其他字段
      ],
      "actions": [
        {
          "type": "CreateBranch",
          "label": "创建 & 生成开发分支",
          "style": "primary",
          "params": { "template": "feature/${meegleId}-${brief}" }
        }
      ]
    },
    {
      "id": "development",
      "type": "process",
      "actions": [
        { "type": "GitCommit", "label": "提交代码", "style": "default" },
        {
          "type": "Transition",
          "label": "提交 & 下一步",
          "style": "primary",
          "params": {
            "tag": "test-feature/${meegleId}-${MMDD}-${hh}-${mm}",
            "nextStep": "testing"
          }
        }
      ]
    },
    // ... testing, acceptance 步骤配置类似，仅 Tag 和 nextStep 不同
    {
      "id": "release",
      "type": "release",
      "actions": [
        { "type": "MergeAndPush", "label": "关联按钮", "style": "primary" }
      ]
    }
  ]
}
```

## 5. 开发规范与约束

1. **Tag 变量格式化**：

- `{MMDD}`: 月日 (如 1220)
- `{hh}`: 小时 (24h)
- `{mm}`: 分钟

2. **不可回退原则**：

- 步骤状态流转是单向的。UI 上不提供“上一步”按钮（除非管理员手动修改 JSON 文件）。
- “已完成”的步骤需在 Steps 组件中高亮显示。

3. **UI 库规范**：

- 必须使用 React + Ant Design v5。
- 必须使用 `ConfigProvider` 适配 VS Code 深色主题。

4. **Git 操作**：

- 使用 `simple-git`。
- 所有 Fetch/Push 操作需包含 Loading 状态。
