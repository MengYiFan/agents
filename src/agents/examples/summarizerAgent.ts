import { Agent } from "mastra";

export const summarizerAgent = new Agent({
  name: "summarizer-agent",
  instructions: "Summarize text snippets into concise bullet points.",
  system: "You are an expert at creating short summaries.",
  tools: [],
});
