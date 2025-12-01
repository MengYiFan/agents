import type { Agent } from "@mastra/core/agent";
import { echoAgent } from "./examples/echoAgent.js";
import { summarizerAgent } from "./examples/summarizerAgent.js";
import { promptLibraryAgent } from "./examples/promptLibraryAgent.js";
import { testPromptAgent } from "./examples/testPromptAgent.js";
import { codeReviewAgent } from "./quality/codeReviewAgent.js";
import { codeGuidelinesMcp } from "./quality/codeGuidelinesMcp.js";
import { gitMcpAgent } from "./integrations/gitMcpAgent.js";
import { grafanaMcpAgent } from "./grafana/index.js";
import { sentryMcpAgent } from "./integrations/sentryMcpAgent.js";

export const registeredAgents: Record<string, Agent> = {
  "echo-agent": echoAgent,
  "summarizer-agent": summarizerAgent,
  "prompt-library-agent": promptLibraryAgent,
  "test-prompt-agent": testPromptAgent,
  "code-review-agent": codeReviewAgent,
  "code-guidelines-mcp": codeGuidelinesMcp,
  "git-mcp-agent": gitMcpAgent,
  "grafana-mcp-agent": grafanaMcpAgent,
  "sentry-mcp-agent": sentryMcpAgent,
};
