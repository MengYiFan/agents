import type { Agent } from "mastra";
import { echoAgent } from "./examples/echoAgent.js";
import { summarizerAgent } from "./examples/summarizerAgent.js";
import { promptLibraryAgent } from "./examples/promptLibraryAgent.js";
import { testPromptAgent } from "./examples/testPromptAgent.js";
import { codeReviewAgent } from "./quality/codeReviewAgent.js";
import { codeGuidelinesMcp } from "./quality/codeGuidelinesMcp.js";
import { gitMcpAgent } from "./integrations/gitMcpAgent.js";
import { grafanaMcpAgent } from "./integrations/grafanaMcpAgent.js";

export const registeredAgents: Agent[] = [
  echoAgent,
  summarizerAgent,
  promptLibraryAgent,
  testPromptAgent,
  codeReviewAgent,
  codeGuidelinesMcp,
  gitMcpAgent,
  grafanaMcpAgent,
];
