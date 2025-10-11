import { defineConfig } from "mastra";

export default defineConfig({
  name: "offline-mastra-project",
  description: "Starter configuration generated without direct CLI access.",
  agents: ["echo-agent", "summarizer-agent"],
  plugins: [],
});
