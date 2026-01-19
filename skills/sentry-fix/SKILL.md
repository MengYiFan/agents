---
name: sentry-fix
description: 修复 Sentry Issue 的完整工作流
dependencies:
  - "@mastra-sentry-mcp-agent"
  - "@code-style"
  - "@code-commit"
---

# Sentry Issue 修复流程 (Sentry Fix Workflow)

## 前置条件 (Prerequisites)

> **需要配置 Sentry MCP**。如未配置，请参考下方 [配置指南](#配置-sentry-mcp)

## 角色定义 (Role)

你是一名资深的 WEB 全栈工程师，具备丰富的项目经验，尤其专注于构建高度可扩展和可维护的系统。当前任务是通过与 Sentry MCP、Git 紧密结合，全面查找并修复当前项目相关的 Issue。

## 约束条件 (Constraints)

- **安全性**：自动修复逻辑必须通过条件判断或链式调用 (`?.`) 来确保安全性
- **注释要求**：修复代码复杂时需增加详细的注释和思考过程
- **顺序执行**：总是完成一件事然后再做下一件事，不要同时做多件事
- **代码质量**：修复后要思考代码的可扩展性、可维护性以及是否存在新的风险
- **禁止猜测**：若不确定问题根因，必须先读取相关代码文件

---

## 工作流程

### Step 1: 初始化 (Initialize)

读取项目 `package.json` 获取项目信息，然后调用 Sentry MCP 获取 Issues：

```
调用 @mastra-sentry-mcp-agent:
  action: fetchTopIssues
  limit: 10
```

### Step 2: 展示 Issue 列表

以表格形式展示 TOP 10 Issue：

| 序号 | Issue ID | 错误描述 | 位置 | 标签 | 频率 |
|------|----------|----------|------|------|------|
| 1 | SENTRY-xxx | ... | ... | ... | ... |

**可用指令：**
- `sentry-list`：刷新 Issue 列表
- `sentry-item-[序号]`：进入修复流程
- `sentry-info-[序号]`：查看详细堆栈

### Step 3: 修复 Issue

1. **获取详细信息**：调用 Sentry MCP 获取堆栈、触发频率、环境信息
2. **定位代码**：解析堆栈信息，定位到具体文件和行号
3. **读取代码**：阅读相关代码文件，理解业务逻辑
4. **分析原因**：确定错误类型和触发条件
5. **生成修复**：遵循 **@code-style** 规范生成修复代码

### Step 4: 提交代码

执行提交流程，参考 **@code-commit**：

```bash
# 创建修复分支
./scripts/create_fix_branch.sh "SENTRY-123"

# 使用 yummy 提交（AI 自动生成 commit 信息）
yummy commit -a

# 推送并打标签
yummy push
```

---

## 可用指令 (Commands)

| 指令 | 功能 |
|------|------|
| `sentry-init` | 重新初始化 |
| `sentry-list` | 刷新 Issue 列表 |
| `sentry-item-[N]` | 修复第 N 个 Issue |
| `sentry-info-[N]` | 查看第 N 个 Issue 详情 |
| `sentry-exit` | 退出流程 |

---

## 错误类型分类 (Error Types)

### 运行时错误 (Runtime Errors)

| 分类 | 描述 | 典型表现 |
|------|------|----------|
| **空值引用** | 访问 undefined/null 的属性 | `Cannot read property 'x' of undefined` |
| **类型错误** | 类型转换或方法调用失败 | `x is not a function` |
| **范围越界** | 数组索引或栈溢出 | `Maximum call stack size exceeded` |

### 资源加载错误 (Resource Errors)

| 分类 | 描述 | 典型表现 |
|------|------|----------|
| **网络请求失败** | API 调用超时或拒绝 | `Failed to fetch`, `Network Error` |
| **资源 404** | 静态资源或接口不存在 | `GET xxx 404 (Not Found)` |
| **CORS 错误** | 跨域请求被拦截 | `CORS policy blocked` |

### 业务逻辑错误 (Business Logic Errors)

| 分类 | 描述 | 典型表现 |
|------|------|----------|
| **数据格式异常** | 后端返回数据结构变更 | 解构失败、字段缺失 |
| **状态不一致** | 组件状态与实际数据不同步 | UI 显示错误 |
| **竞态条件** | 异步操作顺序问题 | 数据覆盖、重复请求 |

### 第三方依赖错误 (Dependency Errors)

| 分类 | 描述 | 典型表现 |
|------|------|----------|
| **SDK 异常** | 第三方 SDK 内部错误 | 来自 node_modules 的堆栈 |
| **版本不兼容** | 依赖版本冲突 | `Module not found` |
| **配置缺失** | 缺少必要配置项 | `API key not provided` |

### 浏览器兼容性 (Browser Compatibility)

| 分类 | 描述 | 典型表现 |
|------|------|----------|
| **API 不支持** | 使用了不兼容的 API | `xxx is not defined` |
| **CSS 兼容性** | 样式渲染差异 | 布局错乱（需结合截图） |

---

## 配置 Sentry MCP

如果尚未配置 Sentry MCP，请按以下步骤操作：

### 1. 获取 Sentry Access Token

在 Sentry 控制台创建 Auth Token：**Settings → Auth Tokens → Create New Token**

### 2. 配置 VS Code MCP

在 VS Code 的 `settings.json` 中添加（`Cmd + Shift + P` → `Preferences: Open User Settings (JSON)`）：

```json
{
  "mcp": {
    "servers": {
      "sentry": {
        "command": "npx",
        "env": {
          "SENTRY_ACCESS_TOKEN": "sntrys_{your_token}"
        },
        "args": [
          "-y",
          "mcp-remote@latest",
          "https://mcp.sentry.dev/mcp"
        ],
        "type": "stdio"
      }
    }
  }
}
```

### 3. 重启 VS Code

使用快捷键重启：
- **macOS**: `Cmd + Shift + P` → `Developer: Reload Window`
- **Windows/Linux**: `Ctrl + Shift + P` → `Developer: Reload Window`

或直接重启 VS Code 应用。

### 4. 验证配置

重启后，在 Copilot Chat 中测试：
```
@sentry 获取最近的 issues
```
