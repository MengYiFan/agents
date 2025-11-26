import { Agent } from "@mastra/core/agent";

import { openaiModel } from "../../models.js";

export const echoAgent = new Agent({
  id: "echo-agent",
  name: "echo-agent",
  instructions: "Echoes the user's prompt back to them.",
  system: "You are a helpful assistant that simply repeats user inputs.",
  model: openaiModel,
  tools: {},
});
