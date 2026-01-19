#!/bin/bash
# 使用 yummy 推送代码并创建标签
# 用法: ./push_with_tag.sh [tag_name]

set -e

TAG_NAME="$1"

# 获取当前分支名
BRANCH=$(git branch --show-current)

if [ -z "$BRANCH" ]; then
  echo "错误: 无法获取当前分支名"
  exit 1
fi

# 推送到远程
echo "推送到 origin/$BRANCH..."
yummy push

# 如果提供了标签名，创建并推送标签
if [ -n "$TAG_NAME" ]; then
  echo "创建标签: $TAG_NAME"
  yummy tag "$TAG_NAME"
  echo "推送标签..."
  git push -f origin "$TAG_NAME"
fi

echo "✅ 推送成功"
echo "  分支: $BRANCH"
[ -n "$TAG_NAME" ] && echo "  标签: $TAG_NAME"
