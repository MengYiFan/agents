#!/bin/bash
# 使用 yummy 提交代码
# 用法: ./commit.sh [message]
# 如果不提供 message，yummy 会自动使用 AI 生成 commit 信息

set -e

MESSAGE="$1"

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
  echo "没有需要提交的更改"
  exit 0
fi

# 使用 yummy commit
if [ -z "$MESSAGE" ]; then
  # AI 自动生成 commit 信息
  echo "使用 AI 自动生成 commit 信息..."
  yummy commit -a
else
  # 使用显式 commit 信息
  yummy commit -a -m "$MESSAGE"
fi

echo "✅ 提交成功"
