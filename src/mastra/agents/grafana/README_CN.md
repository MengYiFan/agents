# Grafana MCP

本模块提供了一个 Model Context Protocol (MCP) Agent，用于与 Grafana 进行交互。它支持搜索仪表盘、获取仪表盘详情以及列出数据源。

## 功能特性

- **自动认证**：支持 Google Application Default Credentials (ADC) 和 Service Account (JSON/P12) 认证，适用于受 IAP 保护的实例。
- **仪表盘搜索**：支持按关键字搜索仪表盘。
- **仪表盘详情**：获取仪表盘和面板的完整 JSON 定义。
- **数据源列表**：列出所有可用的数据源。

## 配置

Agent 通过环境变量或工具输入进行配置。

### 环境变量

- \`GRAFANA_BASE_URL\`：Grafana 实例的基础 URL (例如 \`https://grafana.example.com\`)。
- \`GRAFANA_GOOGLE_CLIENT_EMAIL\`：(可选) 服务账号邮箱。
- \`GRAFANA_GOOGLE_PRIVATE_KEY\`：(可选) 服务账号私钥。
- \`GRAFANA_GOOGLE_TARGET_AUDIENCE\`：(可选) IAP 目标受众。

### 认证模式

1.  **ADC (推荐)**：
    - 设置 \`GRAFANA_BASE_URL\`。
    - 在环境中运行 \`gcloud auth application-default login\`。
    - Agent 将自动使用你的本地凭据。

2.  **Service Account**：
    - 设置 \`GRAFANA_BASE_URL\`、\`GRAFANA_GOOGLE_CLIENT_EMAIL\` 和 \`GRAFANA_GOOGLE_PRIVATE_KEY\`。

## 使用方法

Agent 注册名为 \`grafana-mcp-agent\`。你可以通过任何 MCP 客户端使用它。

### 快捷指令

- \`check [dashboard]\`：搜索并查看仪表盘详情。
- \`info [uid]\`：获取仪表盘 JSON 定义。
- \`list\`：列出所有数据源。
