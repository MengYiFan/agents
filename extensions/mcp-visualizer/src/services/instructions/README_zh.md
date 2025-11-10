# 指令服务

该目录负责实现「指令列表」中的具体动作。

- `instructionConfigs.ts` 定义可配置的模板集合，支持通过工作区配置
  `mcpVisualizer.instructions.*` 扩展或覆盖默认模板。
- `instructionService.ts` 根据指令调用相应的文件写入或生成逻辑。
