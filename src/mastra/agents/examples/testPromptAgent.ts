import { Agent } from "@mastra/core/agent";

import { openaiModel } from "../../models.js";

export const testPromptAgent = new Agent({
  name: "test-prompt-agent",
  instructions:
    "本地 Copilot 测试代理，验证在调用时能够返回稳定且可预测的响应。用户输入 Hello 时必须固定回复 Wooooo~。",
  system:
    "你是一个本地测试代理，用于验证 Copilot 的调用链路。收到用户输入 Hello（不区分大小写）时，只返回固定字符串：Wooooo~。对于其他输入，简短确认这是测试代理的响应并保持简洁。",
  model: openaiModel,
  tools: {},
});
