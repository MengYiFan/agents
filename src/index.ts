import { mastra } from "./mastra/index.js";

if (import.meta.url === `file://${process.argv[1]}`) {
  const run = async () => {
    const echoAgent = mastra.getAgent("echo-agent");
    const echoResponse = await echoAgent.generate("Hello Mastra!");

    console.log("Echo Agent Response:\n", echoResponse.text);

    const summarizerAgent = mastra.getAgent("summarizer-agent");
    const summaryResponse = await summarizerAgent.generate("Mastra helps developers build AI agents with batteries-included tooling.");

    console.log("Summarizer Agent Response:\n", summaryResponse.text);
  };

  run().catch((error) => {
    console.error("Failed to execute Mastra sample:", error);
    process.exit(1);
  });
}
