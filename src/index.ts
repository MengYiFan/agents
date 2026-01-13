import { mastra } from "./mastra/index.js";

if (import.meta.url === `file://${process.argv[1]}`) {
  const run = async () => {
    const echoAgent = mastra.getAgent("echo-agent");
    const echoResponse = await echoAgent.generate("Hello Mastra!");

    console.log("Echo Agent Response:\n", echoResponse.text);
  };

  run().catch((error) => {
    console.error("Failed to execute Mastra sample:", error);
    process.exit(1);
  });
}
