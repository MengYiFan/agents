# Instruction Services

This directory centralises configuration and side effects triggered by the
"指令列表" section inside the visualizer webview.

* `instructionConfigs.ts` exposes the configurable presets for project
  standards and context7 prompts. Workspace settings under
  `mcpVisualizer.instructions.*` can extend or override the defaults.
* `instructionService.ts` orchestrates the actual filesystem updates based on a
  selected instruction.
