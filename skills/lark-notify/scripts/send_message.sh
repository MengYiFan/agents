#!/bin/bash
# 发送 Lark 文本消息
# 用法: ./send_message.sh "消息内容"

set -e

MESSAGE="$1"

if [ -z "$MESSAGE" ]; then
  echo "错误: 请提供消息内容"
  echo "用法: ./send_message.sh \"你的消息\""
  exit 1
fi

if [ -z "$LARK_WEBHOOK" ]; then
  echo "错误: 未配置 LARK_WEBHOOK 环境变量"
  echo "请执行: export LARK_WEBHOOK=\"https://open.feishu.cn/open-apis/bot/v2/hook/xxx\""
  exit 1
fi

curl -s -X POST "$LARK_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d "{\"msg_type\": \"text\", \"content\": {\"text\": \"$MESSAGE\"}}"

echo "✅ 消息已发送"
