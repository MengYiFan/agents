import { Mastra } from "mastra";
import { echoAgent } from "./agents/echoAgent.js";
import { summarizerAgent } from "./agents/summarizerAgent.js";
import { promptLibraryAgent } from "./agents/promptLibraryAgent.js";
import { gitMcpAgent } from "./agents/gitMcpAgent.js";
import { grafanaMcpAgent } from "./agents/grafanaMcpAgent.js";

const mastra = new Mastra({
  agents: [echoAgent, summarizerAgent, promptLibraryAgent, gitMcpAgent, grafanaMcpAgent],
});

export default mastra;

if (import.meta.url === `file://${process.argv[1]}`) {
  const run = async () => {
    const echoResponse = await mastra.run("echo-agent", {
      prompt: "Hello Mastra!",
    });

    console.log("Echo Agent Response:\n", echoResponse.output);

    const summaryResponse = await mastra.run("summarizer-agent", {
      prompt: "Mastra helps developers build AI agents with batteries-included tooling.",
    });

    console.log("Summarizer Agent Response:\n", summaryResponse.output);
  };

  run().catch((error) => {
    console.error("Failed to execute Mastra sample:", error);
    process.exit(1);
  });
}
