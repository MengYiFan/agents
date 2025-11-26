import { Mastra } from "@mastra/core";
import { registeredAgents } from "./agents/index.js";

export const mastra = new Mastra({
  agents: registeredAgents,
});
