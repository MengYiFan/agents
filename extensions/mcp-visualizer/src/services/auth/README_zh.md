# 授权状态服务

该目录提供查询外部平台授权状态的工具函数（如 Lark、Google Drive、Figma 等），
用于在 Webview 中亮起对应的平台图标。

授权信息通过工作区配置 `mcpVisualizer.authorizations` 读取。配置项以平台 id 为键，
布尔值表示团队是否已经取得该平台的访问凭据。
