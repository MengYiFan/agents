import { Agent } from "@mastra/core/agent";

import { geminiModel } from "../../models.js";

export const summarizerAgent = new Agent({
  id: "summarizer-agent",
  name: "summarizer-agent",
  instructions: "Summarize the content provided by the user.",
  system: "You are a helpful assistant that summarizes text.",
  model: geminiModel,
  tools: {},
});
