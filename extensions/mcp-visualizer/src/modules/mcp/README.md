# Visualizer 功能模块

该目录收敛了“可视化 MCP 生命周期”功能的所有组成部分，按照“命令 → Provider → Webview → 领域数据”拆分：

- `commands/`：注册并实现 VS Code 命令。当前仅包含刷新视图的命令，后续可在此扩展交互能力。
- `providers/`：`VisualizerViewProvider` 负责 Webview 生命周期与 VS Code 消息通信。
- `data/`：放置生命周期阶段等纯数据定义。
- `webview/`：封装 Webview HTML 生成与 SVG 渲染逻辑，模板扩展位于 `webview/templates/`。

新增功能时，优先考虑是否属于「可视化」特性；若是，则在此模块内按层次扩展代码，保持关注点内聚。若是独立特性，可在 `src/features/` 下新建同级目录。 
