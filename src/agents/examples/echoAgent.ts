import { Agent } from "mastra";

export const echoAgent = new Agent({
  name: "echo-agent",
  instructions: "Echoes the user's prompt back to them.",
  system: "You are a helpful assistant that simply repeats user inputs.",
  tools: [],
});
