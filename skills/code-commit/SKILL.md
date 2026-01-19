---
name: git-commit
description: 标准化 Git 代码提交流程
---

# Git 提交流程 (Git Commit Workflow)

## 提交前检查

1. 确认所有更改文件：`git status`
2. 确认代码通过 lint 检查
3. 确认没有遗漏的调试代码

## 提交规范

### Commit Message 格式

```
<type>: <description>

[optional body]

[optional footer]
```

### Type 类型

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

### 注意事项

- 全部小写，不能有大写字母
- 简洁明了，不超过 72 字符
- 包含 Issue ID（如适用）

## 执行脚本

```bash
# 提交代码
./scripts/commit.sh "fix: resolve undefined error in user profile"

# 推送并创建标签
./scripts/push_with_tag.sh
```
