import { defineConfig } from "mastra";

export default defineConfig({
  name: "offline-mastra-project",
  description: "Starter configuration generated without direct CLI access.",
  agents: [
    "echo-agent",
    "prompt-library-agent",
    "code-review-agent",
    "code-guidelines-mcp",
    "git-mcp-agent",
    "grafana-mcp-agent",
    "sentry-mcp-agent",
  ],
  plugins: [],
});
