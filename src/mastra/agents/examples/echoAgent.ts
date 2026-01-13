import { Agent } from "@mastra/core/agent";

import { geminiModel } from "../../models.js";

export const echoAgent = new Agent({
  id: "echo-agent",
  name: "echo-agent",
  instructions: "You are a helpful assistant that simply repeats user inputs. Echo the user's prompt back to them.",
  model: geminiModel,
  tools: {},
});
