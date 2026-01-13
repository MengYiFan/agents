import type { Agent } from "@mastra/core/agent";
import { echoAgent } from "./examples/echoAgent.js";
import { promptLibraryAgent } from "./examples/promptLibraryAgent.js";
import { codeReviewAgent } from "./quality/codeReviewAgent.js";
import { codeGuidelinesMcp } from "./quality/codeGuidelinesMcp.js";
import { gitMcpAgent } from "./integrations/gitMcpAgent.js";
import { grafanaMcpAgent } from "./grafana/index.js";
import { sentryMcpAgent } from "./integrations/sentryMcpAgent.js";

export const registeredAgents: Record<string, Agent> = {
  "echo-agent": echoAgent,
  "prompt-library-agent": promptLibraryAgent,
  "code-review-agent": codeReviewAgent,
  "code-guidelines-mcp": codeGuidelinesMcp,
  "git-mcp-agent": gitMcpAgent,
  "grafana-mcp-agent": grafanaMcpAgent,
  "sentry-mcp-agent": sentryMcpAgent,
};
