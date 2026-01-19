import type { Agent } from "@mastra/core/agent";
import { echoAgent } from "./examples/echoAgent.js";
import { grafanaMcpAgent } from "./grafana/index.js";
import { sentryMcpAgent } from "./integrations/sentryMcpAgent.js";

export const registeredAgents: Record<string, Agent> = {
  "echo-agent": echoAgent,
  "grafana-mcp-agent": grafanaMcpAgent,
  "sentry-mcp-agent": sentryMcpAgent,
};
