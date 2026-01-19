---
name: lark-notify
description: 发送 Lark 飞书通知
dependencies:
  - "LARK_WEBHOOK 环境变量"
---

# Lark 通知 (Lark Notification)

## 前置条件

需要配置 Lark Webhook 环境变量：

```bash
export LARK_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
```

## 使用方式

### 发送文本消息

```bash
./scripts/send_message.sh "Issue SENTRY-123 已修复"
```

### 发送卡片消息

```bash
./scripts/send_card.sh "SENTRY-123" "已修复" "用户名"
```

## 消息模板

### Issue 修复通知

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": { "content": "🔧 Sentry Issue 已修复" }
    },
    "elements": [
      { "tag": "div", "text": { "content": "Issue ID: SENTRY-123" } },
      { "tag": "div", "text": { "content": "修复人: @user" } },
      { "tag": "div", "text": { "content": "分支: user/fix/sentry-123" } }
    ]
  }
}
```
