#!/bin/bash
# 创建 Sentry 修复分支
# 用法: ./create_fix_branch.sh "SENTRY-123"

set -e

SENTRY_ID="$1"

if [ -z "$SENTRY_ID" ]; then
  echo "错误: 请提供 Sentry Issue ID"
  echo "用法: ./create_fix_branch.sh SENTRY-123"
  exit 1
fi

# 获取 git 用户名并转换为小写，移除点号
GIT_USER=$(git config user.name | tr '[:upper:]' '[:lower:]' | tr -d '.')

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "警告: 存在未提交的更改"
  read -p "是否暂存这些更改? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git stash push -m "stash before sentry fix: $SENTRY_ID"
    echo "已暂存更改"
  fi
fi

# 拉取最新代码
echo "拉取最新的 origin/master..."
git fetch origin master

# 创建修复分支
BRANCH_NAME="${GIT_USER}/fix/sentry-${SENTRY_ID}"
echo "创建分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" origin/master

echo "✅ 分支创建成功: $BRANCH_NAME"
