### MastraAuthSupabase Configuration and Usage

Source: https://mastra.ai/docs/v1/auth/supabase

This section covers the installation and basic usage of the MastraAuthSupabase class, including environment variable setup and initialization within the Mastra core.

```APIDOC
## MastraAuthSupabase Setup and Configuration

### Description
Provides instructions on installing the necessary package, configuring Supabase credentials via environment variables, and initializing the `MastraAuthSupabase` provider within the Mastra core.

### Installation
```bash
npm install @mastra/auth-supabase@beta
```

### Prerequisites
Ensure your `.env` file contains your Supabase URL and anon key:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```
Review your Supabase Row Level Security (RLS) settings for proper data access controls.

### Usage Example
```typescript
import { Mastra } from "@mastra/core";
import { MastraAuthSupabase } from "@mastra/auth-supabase";

export const mastra = new Mastra({
  // ..
  server: {
    auth: new MastraAuthSupabase({
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    }),
  },
});
```

**Note:** The default `authorizeUser` method checks the `isAdmin` column in the `users` table. You can provide a custom `authorizeUser` function for specific authorization logic.
```

--------------------------------

### Install Mastra Client SDK with npm, pnpm, yarn, or bun

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Installs the Mastra Client SDK beta version using different package managers. Ensure Node.js v22.13.0 or later is installed.

```bash
npm install @mastra/client-js@beta
```

```bash
pnpm add @mastra/client-js@beta
```

```bash
yarn add @mastra/client-js@beta
```

```bash
bun add @mastra/client-js@beta
```

--------------------------------

### Initialize TypeScript Project and Install Dependencies (bun)

Source: https://mastra.ai/docs/v1/getting-started/installation

Initializes a new Node.js project with bun and installs core Mastra dependencies, TypeScript, and related types.

```shell
bun init -y
bun add -d typescript @types/node mastra@beta
bun add @mastra/core@beta zod@^4
```

--------------------------------

### Install Cedar-OS CLI

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/cedar-os

Run this command to install the Cedar-OS CLI, which is the first step in setting up your project.

```bash
npx cedar-os-cli plant-seed  

```

--------------------------------

### Initialize TypeScript Project and Install Dependencies (npm)

Source: https://mastra.ai/docs/v1/getting-started/installation

Initializes a new Node.js project with npm and installs core Mastra dependencies, TypeScript, and related types.

```shell
npm init -y
npm install -D typescript @types/node mastra@beta
npm install @mastra/core@beta zod@^4
```

--------------------------------

### Install Mastra Core Package

Source: https://mastra.ai/docs/v1/agents/overview

Installs the Mastra core package with the beta tag. This is the initial step for setting up agents in your project.

```bash
npm install @mastra/core@beta  

```

--------------------------------

### Initialize TypeScript Project and Install Dependencies (pnpm)

Source: https://mastra.ai/docs/v1/getting-started/installation

Initializes a new Node.js project with pnpm and installs core Mastra dependencies, TypeScript, and related types.

```shell
pnpm init
pnpm add -D typescript @types/node mastra@beta
pnpm add @mastra/core@beta zod@^4
```

--------------------------------

### Initialize TypeScript Project and Install Dependencies (yarn)

Source: https://mastra.ai/docs/v1/getting-started/installation

Initializes a new Node.js project with yarn and installs core Mastra dependencies, TypeScript, and related types.

```shell
yarn init -y
yarn add -D typescript @types/node mastra@beta
yarn add @mastra/core@beta zod@^4
```

--------------------------------

### Install Arize Exporter (npm)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Installs the Arize Exporter package using npm. This is the initial step before configuration and usage.

```bash
npm install @mastra/arize@beta  
```

--------------------------------

### Define Tool using Vercel AI SDK format for Mastra

Source: https://mastra.ai/docs/v1/tools-mcp/advanced-usage

Illustrates how to define a tool compatible with the Vercel AI SDK (`ai` package) and use it within Mastra agents. This example shows a weather tool with a city parameter, demonstrating the `tool` function, `description`, `parameters` schema, and `execute` function. Ensure the `ai` package is installed (`npm install ai`).

```typescript
import { tool } from "ai";
import { z } from "zod";

export const vercelWeatherTool = tool({
  description: "Fetches current weather using Vercel AI SDK format",
  parameters: z.object({
    city: z.string().describe("The city to get weather for"),
  }),
  execute: async ({ city }) => {
    console.log(`Fetching weather for ${city} (Vercel format tool)`);
    // Replace with actual API call
    const data = await fetch(`https://api.example.com/weather?city=${city}`);
    return data.json();
  },
});
```

--------------------------------

### Install Mastra Packages for npm, yarn, pnpm, and bun

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Installs the necessary Mastra packages across different package managers. Ensure you have the correct package manager installed for your environment.

```bash
npm install mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

```bash
yarn add mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

```bash
pnpm add mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

```bash
bun add mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

--------------------------------

### Run Development Server (bun)

Source: https://mastra.ai/docs/v1/getting-started/installation

Starts the Mastra development server using bun.

```shell
bun run dev
```

--------------------------------

### Install Mastra Voice Provider Package

Source: https://mastra.ai/docs/v1/voice/speech-to-text

Shows the command to add a specific Mastra voice provider package to your project using pnpm. This example installs the OpenAI provider.

```bash
pnpm add @mastra/voice-openai@beta  # Example for OpenAI

```

--------------------------------

### Install Mastra Packages with bun

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Installs the necessary Mastra packages (mastra, @mastra/core, @mastra/libsql) using bun. This is a fast, all-in-one JavaScript runtime.

```bash
bun add mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

--------------------------------

### Install Mastra LibSQL Package

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-libsql

Installs the beta version of the Mastra LibSQL package for integrating LibSQL storage with Mastra's memory system.

```bash
npm install @mastra/libsql@beta  

```

--------------------------------

### Install MastraAuthWorkos Package

Source: https://mastra.ai/docs/v1/auth/workos

Install the MastraAuthWorkos package using npm. This command installs the beta version of the package, which may contain experimental features or breaking changes.

```bash
npm install @mastra/auth-workos@beta  
```

--------------------------------

### Run Development Server (yarn)

Source: https://mastra.ai/docs/v1/getting-started/installation

Starts the Mastra development server using yarn.

```shell
yarn run dev
```

--------------------------------

### Install MastraAuthAuth0 Package

Source: https://mastra.ai/docs/v1/auth/auth0

Installs the MastraAuthAuth0 package using npm. This is a prerequisite for using the MastraAuthAuth0 class in your project.

```bash
npm install @mastra/auth-auth0@beta
```

--------------------------------

### Resource Metadata Example (JSON)

Source: https://mastra.ai/docs/v1/server-db/storage

Shows an example of resource metadata stored as JSONB, including user preferences like language and timezone, and tags.

```json
{
  "preferences": {
    "language": "en",
    "timezone": "UTC"
  },
  "tags": [
    "premium",
    "beta-user"
  ]
}
```

--------------------------------

### Complete Example with Ratio Sampling and Exporters

Source: https://mastra.ai/docs/v1/observability/tracing/overview

A complete example demonstrating the initialization of Mastra with observability, including service name, ratio sampling, and default exporters.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      "10_percent": {
        serviceName: "my-service",
        // Sample 10% of traces
        sampling: {
          type: "ratio",
          probability: 0.1,
        },
        exporters: [new DefaultExporter()],
      },
    },
  }),
});
```

--------------------------------

### Run Development Server (pnpm)

Source: https://mastra.ai/docs/v1/getting-started/installation

Starts the Mastra development server using pnpm.

```shell
pnpm run dev
```

--------------------------------

### Install Auth0 React SDK

Source: https://mastra.ai/docs/v1/auth/auth0

Installs the Auth0 React SDK using npm. This is required for client-side authentication with Auth0.

```bash
npm install @auth0/auth0-react
```

--------------------------------

### Install NetlifyDeployer with npm

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/netlify-deployer

Installs the NetlifyDeployer package from npm, which is required to use Netlify-specific deployment functionalities for Mastra applications.

```bash
npm install @mastra/deployer-netlify@beta
```

--------------------------------

### Install Mastra Memory Dependencies

Source: https://mastra.ai/docs/v1/memory/overview

Installs the necessary Mastra packages for core functionality, memory management, and LibSQL storage. This is the first step to enabling memory features.

```bash
npm install @mastra/core@beta @mastra/memory@beta @mastra/libsql@beta  

```

--------------------------------

### Start Mastra Dev Server with CLI

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Starts the Mastra development server directly using the 'mastra dev:mastra' command. This is an alternative way to expose your agents locally.

```bash
mastra dev:mastra  
```

--------------------------------

### Install Mastra CopilotKit Runtime (yarn)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs the CopilotKit runtime and Mastra integration package using yarn. This command is the yarn equivalent for the aforementioned npm installation.

```bash
yarn add @copilotkit/runtime @ag-ui/mastra@beta
```

--------------------------------

### Install @mastra/auth Package

Source: https://mastra.ai/docs/v1/auth/jwt

Installs the Mastra authentication package, specifically the beta version, using npm. This is a prerequisite for using the MastraJwtAuth class.

```bash
npm install @mastra/auth@beta
```

--------------------------------

### Install Mastra Supabase Auth Package

Source: https://mastra.ai/docs/v1/auth/supabase

Installs the beta version of the @mastra/auth-supabase package using npm. This package is necessary before using the MastraAuthSupabase class.

```bash
npm install @mastra/auth-supabase@beta
```

--------------------------------

### Install Mastra Fastembed Package

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-libsql

Installs the beta version of the Mastra Fastembed package, enabling local embedding generation for semantic memory recall.

```bash
npm install @mastra/fastembed@beta  

```

--------------------------------

### Start Mastra Dev Server

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Starts the Mastra development server, which exposes your agents as REST endpoints. This command is essential for local development and testing of your Mastra AI agents.

```bash
npm run dev:mastra

```

```bash
mastra dev:mastra

```

--------------------------------

### Use MastraClient in Server-Side Environments for Streaming Responses

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Demonstrates using `MastraClient` in server-side environments like API routes or serverless functions. This example shows how to get an agent and stream its response, returning the stream's body as a `Response` object for clients. Assumes `mastraClient` is initialized.

```javascript
export async function action() {  
  const agent = mastraClient.getAgent("testAgent");  
  
  const stream = await agent.stream({  
    messages: [{ role: "user", content: "Hello" }],  
  });  
  
  return new Response(stream.body);  
}  

```

--------------------------------

### Install CloudflareDeployer with npm

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/cloudflare-deployer

Installs the CloudflareDeployer package from npm. This is the first step to using the deployer for Mastra applications.

```bash
npm install @mastra/deployer-cloudflare@beta  

```

--------------------------------

### Install CopilotKit & Mastra for Next.js (pnpm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs all necessary packages for integrating CopilotKit and Mastra within a Next.js application using pnpm. This ensures efficient package installation.

```bash
pnpm add @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/mastra@beta
```

--------------------------------

### Install Mastra Packages with npm

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Installs the necessary Mastra packages (mastra, @mastra/core, @mastra/libsql) using npm. This is the first step in integrating Mastra into your project.

```bash
npm install mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

--------------------------------

### Start Mastra Dev Server with npm

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Starts the Mastra development server using the 'npm run dev:mastra' command. This exposes your Mastra agents as local REST endpoints.

```bash
npm run dev:mastra  
```

--------------------------------

### Install Node.js Dependencies (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Installs the necessary Node.js dependencies for the Mastra application using npm. Requires Node.js and npm to be installed.

```bash
npm install
```

--------------------------------

### Install Mastra Upstash Package

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-upstash

Installs the beta version of the Mastra Upstash package, which provides integrations for using Upstash services with Mastra's memory system.

```bash
npm install @mastra/upstash@beta  

```

--------------------------------

### Install Mastra CopilotKit Runtime (npm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs the CopilotKit runtime and Mastra integration package using npm. This is required for the Mastra server-side integration.

```bash
npm install @copilotkit/runtime @ag-ui/mastra@beta
```

--------------------------------

### Install MCP Dependency

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Installs the necessary beta version of the Mastra MCP package using npm. This is the first step to integrating MCP functionality into your project.

```bash
npm install @mastra/mcp@beta  
```

--------------------------------

### Install Mastra Client SDK (npm, yarn, pnpm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Instructions for installing the Mastra Client SDK using different package managers. This SDK is essential for interacting with Mastra services.

```bash
npm install @mastra/client-js@beta
```

```bash
yarn add @mastra/client-js@beta
```

```bash
pnpm add @mastra/client-js@beta
```

--------------------------------

### Install Vercel Deployer Package

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/vercel-deployer

Installs the Vercel deployer package for Mastra. This is the initial step to integrate Vercel deployment capabilities into your Mastra project.

```bash
npm install @mastra/deployer-vercel@beta
```

--------------------------------

### Basic Mastra Setup with Default Exporter

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/default

Demonstrates the basic setup of Mastra with a LibSQL storage and the DefaultExporter explicitly configured for observability. This requires explicit instantiation of both the storage and observability modules.

```typescript
import { Mastra } from "@mastra/core";
import { Observability, DefaultExporter } from "@mastra/observability";
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db", // Required for trace persistence
  }),
  observability: new Observability({
    configs: {
      local: {
        serviceName: "my-service",
        exporters: [new DefaultExporter()],
      },
    },
  }),
});

```

--------------------------------

### Install Mastra Packages with pnpm

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Installs the necessary Mastra packages (mastra, @mastra/core, @mastra/libsql) using pnpm. This is another package manager option.

```bash
pnpm add mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

--------------------------------

### Install Mastra Packages with yarn

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Installs the necessary Mastra packages (mastra, @mastra/core, @mastra/libsql) using yarn. This is an alternative to npm for package management.

```bash
yarn add mastra@beta @mastra/core@beta @mastra/libsql@beta  
```

--------------------------------

### Scaffold Mastra with Interactive CLI

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Initializes Mastra in your project using the interactive 'init' command, allowing customization of the setup by prompting the user for choices.

```bash
npx mastra@beta init  
```

--------------------------------

### Retrieve Trace IDs from Workflow Execution and Streaming (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Shows how to get the `traceId` from workflow executions using `createRun`, `start`, and `stream` methods. The `traceId` is available in the result of `start` and can be obtained from the final state after streaming.

```javascript
// Create a workflow run
const run = await mastra.getWorkflow("myWorkflow").createRun();

// Start the workflow
const result = await run.start({
  inputData: { data: "process this" },
});

console.log("Trace ID:", result.traceId);

// Or stream the workflow
const { stream, getWorkflowState } = run.stream({
  inputData: { data: "process this" },
});

// Get the final state which includes the trace ID
const finalState = await getWorkflowState();
console.log("Trace ID:", finalState.traceId);
```

--------------------------------

### Start Mastra Dev Server (CLI)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Starts the Mastra development server, which exposes your agents as REST endpoints. This command is used to run the Mastra backend during development.

```bash
npm run dev:mastra  
```

```bash
mastra dev:mastra  
```

--------------------------------

### Install Mastra Inngest Packages

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

Installs the necessary Mastra and Inngest packages via npm. These packages are required to integrate Mastra workflows with the Inngest platform.

```bash
npm install @mastra/inngest@beta @mastra/core@beta @mastra/deployer@beta  

```

--------------------------------

### Install MastraAuthClerk Package

Source: https://mastra.ai/docs/v1/auth/clerk

Installs the beta version of the @mastra/auth-clerk package using npm. This package is required to use the MastraAuthClerk class for authentication.

```bash
npm install @mastra/auth-clerk@beta

```

--------------------------------

### Example Network Stream Output in Mastra AI

Source: https://mastra.ai/docs/v1/streaming/events

Demonstrates the structure of events emitted by a Mastra AI network stream, including routing decisions and agent/workflow execution. These events track the orchestration flow, starting with routing and followed by primitive execution. The output includes types like 'routing-agent-start', 'routing-agent-end', 'agent-execution-start', and 'agent-execution-event-text-delta'.

```json
// Routing agent decides what to do  
{
  type: 'routing-agent-start',
  from: 'NETWORK',
  runId: '7a3b9c2d-1e4f-5a6b-8c9d-0e1f2a3b4c5d',
  payload: {
    agentId: 'routing-agent',
    // ...
  }
}
// Routing agent makes a selection  
{
  type: 'routing-agent-end',
  from: 'NETWORK',
  runId: '7a3b9c2d-1e4f-5a6b-8c9d-0e1f2a3b4c5d',
  payload: {
    // ...
  }
}
// Delegated agent begins execution  
{
  type: 'agent-execution-start',
  from: 'NETWORK',
  runId: '8b4c0d3e-2f5a-6b7c-9d0e-1f2a3b4c5d6e',
  payload: {
    // ...
  }
}
// Events from the delegated agent's execution  
{
  type: 'agent-execution-event-text-delta',
  from: 'NETWORK',
  runId: '8b4c0d3e-2f5a-6b7c-9d0e-1f2a3b4c5d6e',
  payload: {
    type: 'text-delta',
    payload: {
      // ...
    }
  }
}
// ...more events
```

--------------------------------

### Run Phoenix Instance with Docker

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Starts a local Phoenix instance using Docker for testing. This command sets up an in-memory SQLite database for the Phoenix backend, making it easy to test the Arize exporter locally.

```bash
docker run --pull=always -d --name arize-phoenix -p 6006:6006 \  
  -e PHOENIX_SQL_DATABASE_URL="sqlite:///:memory:" \  
  arizephoenix/phoenix:latest  
```

--------------------------------

### Access Suspend Payload in Mastra Workflow

Source: https://mastra.ai/docs/v1/workflows/human-in-the-loop

This JavaScript snippet shows how to retrieve the suspend payload from a suspended workflow step in Mastra. It demonstrates getting a workflow, starting a run, and then accessing the suspended payload if the result status is 'suspended'.

```javascript
const workflow = mastra.getWorkflow("testWorkflow");
const run = await workflow.createRunAsync();

const result = await run.start({
  inputData: {
    userEmail: "alex@example.com"
  }
});

if (result.status === "suspended") {
  const suspendStep = result.suspended[0];
  const suspendedPayload = result.steps[suspendStep[0]].suspendPayload;

  console.log(suspendedPayload);
}

```

--------------------------------

### Install Mastra Memory and Storage Provider

Source: https://mastra.ai/docs/v1/agents/agent-memory

Installs the necessary Mastra packages for memory functionality and a storage provider like LibSQL. This is the initial step to enable memory in your Mastra agents.

```bash
npm install @mastra/memory@beta @mastra/libsql@beta  
```

--------------------------------

### Install Mastra Core and Vercel AI SDK

Source: https://mastra.ai/docs/v1/agents/overview

Installs the Mastra core package along with a specific Vercel AI SDK provider (e.g., OpenAI). This is required when integrating Mastra agents with Vercel's AI SDK for LLM interactions.

```bash
npm install @mastra/core@beta @ai-sdk/openai  

```

--------------------------------

### Install Langfuse Exporter (npm)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langfuse

Installs the beta version of the Langfuse Exporter package using npm. This is the first step to integrate Langfuse observability into your project.

```bash
npm install @mastra/langfuse@beta  
```

--------------------------------

### Install OTEL Exporter for HTTP/JSON Providers (npm)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Installs the base OpenTelemetry exporter and the protocol package for HTTP/JSON providers like Traceloop. Requires Node.js and npm.

```bash
npm install @mastra/otel-exporter@beta @opentelemetry/exporter-trace-otlp-http
```

--------------------------------

### Install Mastra CopilotKit Runtime (pnpm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs the CopilotKit runtime and Mastra integration package using pnpm. This ensures all necessary dependencies are available for Mastra integration.

```bash
pnpm add @copilotkit/runtime @ag-ui/mastra@beta
```

--------------------------------

### Install OTEL Exporter for HTTP/Protobuf Providers (npm)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Installs the base OpenTelemetry exporter and the specific protocol package for HTTP/Protobuf providers such as SigNoz, New Relic, and Laminar. Requires Node.js and npm.

```bash
npm install @mastra/otel-exporter@beta @opentelemetry/exporter-trace-otlp-proto
```

--------------------------------

### Install CopilotKit Packages (npm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs the core and UI packages for CopilotKit using npm. These are essential for integrating CopilotKit components into a React frontend.

```bash
npm install @copilotkit/react-core @copilotkit/react-ui
```

--------------------------------

### Install @mastra/auth-firebase Package

Source: https://mastra.ai/docs/v1/auth/firebase

Installs the necessary package for Mastra Firebase authentication using npm. This is a prerequisite for using the MastraAuthFirebase class.

```bash
npm install @mastra/auth-firebase@beta  
```

--------------------------------

### Mastra Entry Point (src/mastra/index.ts)

Source: https://mastra.ai/docs/v1/getting-started/installation

Initializes the Mastra core with the defined agents, setting up the main application entry point.

```typescript
import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents/weather-agent";

export const mastra = new Mastra({
  agents: { weatherAgent },
});
```

--------------------------------

### Install OTEL Exporter for gRPC Providers (npm)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Installs the base OpenTelemetry exporter and the necessary packages for gRPC providers like Dash0. This includes the gRPC JavaScript library. Requires Node.js and npm.

```bash
npm install @mastra/otel-exporter@beta @opentelemetry/exporter-trace-otlp-grpc @grpc/grpc-js
```

--------------------------------

### Scaffold Mastra Weather Agent with One-Liner or Interactive CLI

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Initializes the Mastra project by scaffolding the default Weather agent. Use the '--default' flag for quick setup or run 'init' interactively for customization.

```bash
npx mastra@beta init --default  
```

```bash
npx mastra@beta init  
```

--------------------------------

### Eval Result Example (JSON)

Source: https://mastra.ai/docs/v1/server-db/storage

An example of the JSON structure for evaluation results, containing a score and detailed information about the evaluation, including reasons and citations.

```json
{
  "score": 0.95,
  "details": {
    "reason": "Response accurately reflects source material",
    "citations": [
      "page 1",
      "page 3"
    ]
  }
}
```

--------------------------------

### Install CopilotKit Packages (pnpm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs the core and UI packages for CopilotKit using pnpm. pnpm is a performant package manager for Node.js.

```bash
pnpm add @copilotkit/react-core @copilotkit/react-ui
```

--------------------------------

### Run Workflow (Start Mode)

Source: https://mastra.ai/docs/v1/workflows/overview

Explains how to execute a workflow in 'start' mode, which waits for all steps to complete before returning the final result. It uses `createRun()` to instantiate a workflow run and `.start()` to initiate execution with provided input data that matches the workflow's input schema.

```javascript
const run = await testWorkflow.createRun();

const result = await run.start({
  inputData: {
    message: "Hello world"
  }
});

console.log(result);
```

--------------------------------

### Basic Mastra AI Setup with Braintrust Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/braintrust

Demonstrates the basic setup of Mastra AI with the Braintrust exporter integrated into the observability configuration. It initializes Mastra with a service name and configures the Braintrust exporter using environment variables.

```typescript
import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { BraintrustExporter } from "@mastra/braintrust";

export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      braintrust: {
        serviceName: "my-service",
        exporters: [
          new BraintrustExporter({
            apiKey: process.env.BRAINTRUST_API_KEY,
            projectName: process.env.BRAINTRUST_PROJECT_NAME,
          }),
        ],
      },
    },
  }),
});
```

--------------------------------

### Install CopilotKit Packages (yarn)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs the core and UI packages for CopilotKit using yarn. This command is an alternative to npm for managing project dependencies.

```bash
yarn add @copilotkit/react-core @copilotkit/react-ui
```

--------------------------------

### Install Mastra AI SDK Package (npm, pnpm, yarn, bun)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Installs the `@mastra/ai-sdk` package, which provides custom API routes and utilities for streaming Mastra agents in AI SDK-compatible formats. This package is essential for integrating Mastra's streaming capabilities with the AI SDK.

```bash
npm install @mastra/ai-sdk@beta

```

```bash
pnpm add @mastra/ai-sdk@beta

```

```bash
yarn add @mastra/ai-sdk@beta

```

```bash
bun add @mastra/ai-sdk@beta

```

--------------------------------

### Initialize Mastra AI Project

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Initializes a new Mastra AI project with default settings or interactive prompts. This command sets up the basic project structure and configuration files required for Mastra AI.

```bash
npx mastra@beta init --default

```

```bash
npx mastra@beta init

```

--------------------------------

### Add Mastra Scripts to package.json

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Adds 'dev:mastra' and 'build:mastra' scripts to the 'package.json' file. These scripts are used to start the Mastra development server and build Mastra applications, respectively.

```json
{
  "scripts": {
    ... ,
    "dev:mastra": "mastra dev",
    "build:mastra": "mastra build"
  }
}

```

--------------------------------

### Create Mastra Entry Point File

Source: https://mastra.ai/docs/v1/getting-started/installation

Creates the main index.ts file for the Mastra application, where the Mastra instance is created and agents are registered.

```shell
touch src/mastra/index.ts
```

--------------------------------

### Install WorkOS Node SDK

Source: https://mastra.ai/docs/v1/auth/workos

Install the WorkOS SDK for Node.js applications. This is required for server-side authentication flows, specifically for exchanging authorization codes.

```bash
npm install @workos-inc/node  
```

--------------------------------

### Langfuse Exporter Complete Configuration Options (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langfuse

Provides a comprehensive configuration example for the Langfuse exporter, including optional settings like base URL, realtime mode, log level, and Langfuse-specific options for environment, version, and release tracking.

```javascript
new LangfuseExporter({  
  // Required credentials  
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,  
  secretKey: process.env.LANGFUSE_SECRET_KEY!,  
  
  // Optional settings  
  baseUrl: process.env.LANGFUSE_BASE_URL, // Default: https://cloud.langfuse.com  
  realtime: process.env.NODE_ENV === "development", // Dynamic mode selection  
  logLevel: "info", // Diagnostic logging: debug | info | warn | error  
  
  // Langfuse-specific options  
  options: {  
    environment: process.env.NODE_ENV, // Shows in UI for filtering  
    version: process.env.APP_VERSION, // Track different versions  
    release: process.env.GIT_COMMIT, // Git commit hash  
  },  
});  
```

--------------------------------

### Tool Execution Example

Source: https://mastra.ai/docs/v1/agents/networks

Shows an example where the routing agent directly calls a tool (weatherTool) to fulfill a user's request, bypassing other agents or workflows.

```APIDOC
## API: Direct Tool Execution

### Description
Demonstrates how the routing agent can directly invoke a specific tool to satisfy a user's request when it determines that is the most efficient method.

### Method
`network()`

### Endpoint
Not applicable (Method call on an agent object)

### Parameters
#### Input
- **userMessage** (string) - Required - The message prompting direct tool execution (e.g., "What's the weather in London?").

### Request Example
```javascript
const result = await routingAgent.network("What's the weather in London?");

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

### Response
#### Success Response (Stream of Events)
- **chunk.type** (string) - The type of event indicating tool execution progress (e.g., `tool-execution-start`, `tool-execution-end`).
- **chunk.payload.result** (any) - The output of the tool execution, typically available after `network-execution-event-step-finish`.

#### Response Example (Event Types)
```
routing-agent-start
routing-agent-end
tool-execution-start
tool-execution-end
network-execution-event-step-finish
```
```

--------------------------------

### Basic Mastra AI Setup with Langfuse Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langfuse

Initializes Mastra AI with the Langfuse exporter, configuring it to send traces to Langfuse. Requires environment variables for credentials and specifies a service name.

```typescript
import { Mastra } from "@mastra/core";  
import { Observability } from "@mastra/observability";  
import { LangfuseExporter } from "@mastra/langfuse";  
  
export const mastra = new Mastra({  
  observability: new Observability({  
    configs: {  
      langfuse: {  
        serviceName: "my-service",  
        exporters: [  
          new LangfuseExporter({  
            publicKey: process.env.LANGFUSE_PUBLIC_KEY!,  
            secretKey: process.env.LANGFUSE_SECRET_KEY!,  
            baseUrl: process.env.LANGFUSE_BASE_URL,  
            options: {  
              environment: process.env.NODE_ENV,  
            },  
          }),  
        ],  
      },  
    },  
  }),  
});  
```

--------------------------------

### Install LangSmith Exporter using npm

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langsmith

Installs the beta version of the Mastra LangSmith exporter package. This is the first step to integrate LangSmith's tracing capabilities into your Mastra AI project.

```bash
npm install @mastra/langsmith@beta  

```

--------------------------------

### Add Dev and Build Scripts to package.json

Source: https://mastra.ai/docs/v1/getting-started/installation

Configures 'dev' and 'build' scripts in the package.json file for running Mastra development server and building the project.

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "mastra dev",
    "build": "mastra build"
  }
}
```

--------------------------------

### Initialize Mastra (Interactive CLI)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Initializes Mastra in your project using the interactive CLI, allowing for custom setup options. This is an alternative to the one-liner command.

```bash
npx mastra@latest init  
```

--------------------------------

### Monorepo Directory Structure Example

Source: https://mastra.ai/docs/v1/deployment/monorepo

Illustrates a typical monorepo layout with Mastra application code located in `apps/api` and shared packages in `packages/`.

```tree
apps/  
├── api/  
│   ├── src/  
│   │   └── mastra/  
│   │       ├── agents/  
│   │       ├── tools/  
│   │       ├── workflows/  
│   │       └── index.ts  
│   ├── package.json  
│   └── tsconfig.json  
└── web/  
packages/  
├── ui/  
└── utils/  
package.json  

```

--------------------------------

### Setup Mastra with Cloud Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/cloud

Configures Mastra with observability enabled, including the CloudExporter. This setup requires a Mastra Cloud account and an access token, typically provided via environment variables.

```typescript
import { Mastra } from "@mastra/core";
import { Observability, CloudExporter } from "@mastra/observability";

export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      production: {
        serviceName: "my-service",
        exporters: [
          new CloudExporter(), // Uses MASTRA_CLOUD_ACCESS_TOKEN env var
        ],
      },
    },
  }),
});
```

--------------------------------

### Basic Mastra Initialization with Auth0

Source: https://mastra.ai/docs/v1/auth/auth0

Initializes the Mastra server with the MastraAuthAuth0 authentication provider. This example assumes default Auth0 configuration is sufficient.

```typescript
import { Mastra } from "@mastra/core";
import { MastraAuthAuth0 } from "@mastra/auth-auth0";

export const mastra = new Mastra({
  // ..
  server: {
    auth: new MastraAuthAuth0(),
  },
});
```

--------------------------------

### Create Project Directory

Source: https://mastra.ai/docs/v1/getting-started/installation

Creates a new directory for the Mastra project and changes the current directory into it.

```shell
mkdir my-first-agent && cd my-first-agent
```

--------------------------------

### Install Mastra Packages (npm, yarn, pnpm, bun)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Installs the necessary Mastra packages for your Vite/React project using different package managers. Ensure you have the correct package manager for your project.

```bash
npm install mastra@beta @mastra/core@beta @mastra/libsql@beta @mastra/client-js@beta  
```

```bash
yarn add mastra@beta @mastra/core@beta @mastra/libsql@beta @mastra/client-js@beta  
```

```bash
pnpm add mastra@beta @mastra/core@beta @mastra/libsql@beta @mastra/client-js@beta  
```

```bash
bun add mastra@beta @mastra/core@beta @mastra/libsql@beta @mastra/client-js@beta  
```

--------------------------------

### Install Mastra Evals Package

Source: https://mastra.ai/docs/v1/evals/overview

Installs the Mastra Evals package, which is required to use Mastra's scorers feature. This command is used in a Node.js environment.

```bash
npm install @mastra/evals@beta  
```

--------------------------------

### Install CopilotKit & Mastra for Next.js (npm)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs all necessary packages for integrating CopilotKit and Mastra within a Next.js application using npm. This includes core, UI, runtime, and Mastra packages.

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/mastra@beta
```

--------------------------------

### Environment Variables (.env)

Source: https://mastra.ai/docs/v1/getting-started/installation

Example of an environment variable for storing the Google Generative AI API key. Other providers like OpenAI and Anthropic are also supported.

```env
GOOGLE_GENERATIVE_AI_API_KEY=<your-api-key>
```

--------------------------------

### Bootstrap Mastra Server Project

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/assistant-ui

Command to create a new Mastra project using an interactive wizard. This command helps scaffold the server project by prompting for details and setting up basic configurations.

```bash
npx create-mastra@beta
```

--------------------------------

### Initialize Mastra Core Configuration

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Creates a Mastra configuration file and initializes the Mastra core instance. This setup is essential for any Mastra application, serving as the entry point for defining and managing agents.

```typescript
import { Mastra } from "@mastra/core";  
  
export const mastra = new Mastra({});  

```

--------------------------------

### Run Mastra Server

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/assistant-ui

Command to start the Mastra server in development mode. The server will typically run on http://localhost:4111, making agent endpoints accessible.

```bash
npm run dev
```

--------------------------------

### Install Mastra Braintrust Exporter (npm)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/braintrust

Installs the beta version of the Mastra Braintrust exporter package using npm. This is the first step to integrating Braintrust for LLM application quality monitoring.

```bash
npm install @mastra/braintrust@beta
```

--------------------------------

### Install Mastra MongoDB Package

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-mongodb

To utilize Mastra's MongoDB storage capabilities, you need to install the official `@mastra/mongodb` package. This package provides the necessary classes and functions to integrate MongoDB with Mastra's memory system.

```bash
npm install @mastra/mongodb@beta
```

--------------------------------

### Create Weather Tool File

Source: https://mastra.ai/docs/v1/getting-started/installation

Creates the directory structure and an empty file for the weather tool.

```shell
mkdir -p src/mastra/tools && touch src/mastra/tools/weather-tool.ts
```

--------------------------------

### Workflow Example

Source: https://mastra.ai/docs/v1/agents/networks

Illustrates how a routing agent can execute a defined workflow based on user input. It shows the process of iterating through workflow execution events.

```APIDOC
## API: Execute Workflow

### Description
Executes a predefined workflow based on the user's message. The routing agent interprets the message and routes it to the appropriate workflow, which may involve multiple agent steps.

### Method
`network()`

### Endpoint
Not applicable (Method call on an agent object)

### Parameters
#### Input
- **userMessage** (string) - Required - The message that triggers the workflow execution (e.g., "Tell me some historical facts about London").

### Request Example
```javascript
const result = await routingAgent.network(
  "Tell me some historical facts about London",
);

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

### Response
#### Success Response (Stream of Events)
- **chunk.type** (string) - The type of event emitted during workflow execution (e.g., `workflow-execution-start`, `workflow-execution-event-workflow-step-result`).
- **chunk.payload.result** (any) - The result of a completed workflow step.

#### Response Example (Event Types)
```
routing-agent-end
workflow-execution-start
workflow-execution-event-workflow-start
workflow-execution-event-workflow-step-start
workflow-execution-event-workflow-step-result
workflow-execution-event-workflow-finish
workflow-execution-end
routing-agent-start
network-execution-event-step-finish
```
```

--------------------------------

### Usage Example: Interacting with Upstash Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-upstash

Provides a practical example of how to use the configured Upstash agent to send messages and retrieve responses, demonstrating memory persistence and scoped recall options.

```typescript
import "dotenv/config";  
  
import { mastra } from "./mastra";  
  
const threadId = "123";  
const resourceId = "user-456";  
  
const agent = mastra.getAgent("upstashAgent");  
  
const message = await agent.stream("My name is Mastra", {  
  memory: {  
    thread: threadId,  
    resource: resourceId,  
  },  
});  
  
await message.textStream.pipeTo(new WritableStream());  
  
const stream = await agent.stream("What's my name?", {  
  memory: {  
    thread: threadId,  
    resource: resourceId,  
  },  
  memoryOptions: {  
    lastMessages: 5,  
    semanticRecall: {  
      topK: 3,  
      messageRange: 2,  
    },  
  },  
});  
  
for await (const chunk of stream.textStream) {  
  process.stdout.write(chunk);  
}  


```

--------------------------------

### Install @ai-sdk/react Package (npm, pnpm, yarn, bun)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Installs the AI SDK React package, which provides hooks for integrating frontend components with Mastra agents. This package is essential for using features like useChat and useCompletion.

```bash
npm install @ai-sdk/react

```

```bash
pnpm add @ai-sdk/react

```

```bash
yarn add @ai-sdk/react

```

```bash
bun add @ai-sdk/react

```

--------------------------------

### Create Assistant UI Project

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/assistant-ui

Command to generate a new Assistant UI project. This command initializes a frontend project using the Assistant UI library.

```bash
npx assistant-ui@latest create
```

--------------------------------

### Initialize Mastra with CloudflareDeployer

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/cloudflare-deployer

Initializes the Mastra application with the CloudflareDeployer. This example shows how to configure the deployer with a project name and environment variables.

```typescript
import { Mastra } from "@mastra/core";  
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";  
  
export const mastra = new Mastra({  
  // ...  
  deployer: new CloudflareDeployer({  
    projectName: "hello-mastra",  
    env: {  
      NODE_ENV: "production",  
    },  
  }),  
});  

```

--------------------------------

### Basic Mastra Observability Configuration (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Configures Mastra with basic observability settings, enabling default and cloud exporters, and setting up local storage for trace persistence. This configuration is a minimal setup for enabling tracing.

```typescript
import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";

export const mastra = new Mastra({
  // ... other config
  observability: new Observability({
    default: { enabled: true }, // Enables DefaultExporter and CloudExporter
  }),
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db", // Storage is required for tracing
  }),
});
```

--------------------------------

### Initialize Mastra with NetlifyDeployer

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/netlify-deployer

Demonstrates how to initialize the Mastra application with the NetlifyDeployer instance, enabling Netlify-specific deployment configurations within the Mastra core.

```typescript
import { Mastra } from "@mastra/core";
import { NetlifyDeployer } from "@mastra/deployer-netlify";

export const mastra = new Mastra({
  // ...
  deployer: new NetlifyDeployer(),
});
```

--------------------------------

### Basic Mastra Initialization with WorkOS Auth

Source: https://mastra.ai/docs/v1/auth/workos

Initialize the Mastra server with the MastraAuthWorkos authentication module. This example assumes WorkOS authentication is configured via environment variables.

```typescript
import { Mastra } from "@mastra/core";  
import { MastraAuthWorkos } from "@mastra/auth-workos";  
  
export const mastra = new Mastra({
  // ..  
  server: {
    auth: new MastraAuthWorkos(),  
  },
});  

```

--------------------------------

### Install CopilotKit & Mastra for Next.js (yarn)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Installs all necessary packages for integrating CopilotKit and Mastra within a Next.js application using yarn. This command provides the yarn alternative for dependency management.

```bash
yarn add @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/mastra@beta
```

--------------------------------

### Install OpenRouter Provider and Uninstall OpenAI SDK

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/openrouter

Installs the necessary OpenRouter AI SDK provider package and removes the default OpenAI SDK package. This is a crucial step for configuring Mastra to use OpenRouter.

```bash
npm uninstall @ai-sdk/openai
npm install @openrouter/ai-sdk-provider
```

--------------------------------

### Install Mastra Dependencies for Express.js

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Installs the necessary Mastra packages and dependencies for an Express project, including core Mastra libraries, an OpenAI SDK, and Zod for schema validation. This command prepares your project to integrate Mastra agents.

```bash
npm install mastra@beta @mastra/core@beta @mastra/libsql@beta zod@^3.0.0 @ai-sdk/openai@^1.0.0  

```

--------------------------------

### Basic Express Server Setup (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Sets up a basic Express.js server with a root route. This serves as the foundation for adding more complex API endpoints. It requires the 'express' library.

```typescript
import express, { Request, Response } from "express";  
  
const app = express();  
const port = 3456;  
  
app.get("/", (req: Request, res: Response) => {  
  res.send("Hello, world!");  
});  
  
app.listen(port, () => {  
  console.log(`Server is running at http://localhost:${port}`);  
});  

```

--------------------------------

### Workflow Snapshot Example (JSON)

Source: https://mastra.ai/docs/v1/server-db/storage

Presents the JSON structure for a workflow snapshot, used to save and rehydrate workflow states. Includes current state, context, active paths, run ID, and timestamp.

```json
{
  "value": {
    "currentState": "running"
  },
  "context": {
    "stepResults": {},
    "attempts": {},
    "triggerData": {}
  },
  "activePaths": [],
  "runId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": 1648176000000
}
```

--------------------------------

### Create Test Route Directory and Action File (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Creates a new directory for a test route and an associated `+page.server.ts` file. This file defines a SvelteKit Action that interacts with a Mastra agent to get weather information.

```bash
mkdir src/routes/test  
```

```typescript
touch src/routes/test/+page.server.ts  
```

```typescript
import type { Actions } from "./$types";
import { mastra } from "../../mastra";

export const actions = {
  default: async (event) => {
    const city = (await event.request.formData()).get("city")!.toString();
    const agent = mastra.getAgent("weatherAgent");

    const result = await agent.generate(`What's the weather like in ${city}?`);
    return { result: result.text };
  },
} satisfies Actions;

```

--------------------------------

### Initialize Inngest for Mastra (Development)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

Initializes the Inngest client for development environments. This setup includes specifying the Inngest function ID, the local Inngest server base URL, enabling development mode, and applying the realtime middleware for enhanced observability.

```typescript
import { Inngest } from "inngest";  
import { realtimeMiddleware } from "@inngest/realtime/middleware";  
  
export const inngest = new Inngest({  
  id: "mastra",  
  baseUrl: "http://localhost:8288",  
  isDev: true,  
  middleware: [realtimeMiddleware()],  
});  

```

--------------------------------

### Build Mastra Instance (Shell)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This command compiles the Mastra project and prepares it for deployment. It generates the necessary output files in the `.mastra/output` directory.

```shell
npx mastra build
```

--------------------------------

### Example Workflow Stream Events

Source: https://mastra.ai/docs/v1/streaming/events

Provides examples of event objects emitted during workflow streaming. These events include 'type', 'runId', 'from', and a 'payload' detailing step execution information.

```json
{
  type: 'workflow-start',
  runId: '221333ed-d9ee-4737-922b-4ab4d9de73e6',
  from: 'WORKFLOW',
  // ...
}
{
  type: 'workflow-step-start',
  runId: '221333ed-d9ee-4737-922b-4ab4d9de73e6',
  from: 'WORKFLOW',
  payload: {
    stepName: 'step-1',
    args: { value: 'initial data' },
    stepCallId: '9e8c5217-490b-4fe7-8c31-6e2353a3fc98',
    startedAt: 1755269732792,
    status: 'running'
  }
}
```

--------------------------------

### Install Mastra FastEmbed Package

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-mongodb

To enable vector embeddings for semantic recall within Mastra's memory system when using MongoDB, install the `@mastra/fastembed` package. This package integrates FastEmbed for generating vector embeddings locally.

```bash
npm install @mastra/fastembed@beta
```

--------------------------------

### LibSQL Storage Integration for Mastra Snapshots

Source: https://mastra.ai/docs/v1/workflows/snapshots

Demonstrates initializing Mastra with LibSQL for snapshot storage. This setup uses an in-memory database for simplicity, suitable for development or testing.

```typescript
import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
  // ...
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ":memory:",
  }),
});
```

--------------------------------

### Set Up API Key for LLM Provider

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Configures the API key for your chosen LLM provider (e.g., OpenAI) in the `.env` file. Replace `<your-api-key>` with your actual key.

```dotenv
OPENAI_API_KEY=<your-api-key>  
```

--------------------------------

### Example Usage of Mastra Agent with MongoDB Memory (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-mongodb

This TypeScript example shows how to interact with a Mastra AI agent configured with MongoDB memory. It demonstrates sending a message and then querying the agent with memory options to retrieve relevant past interactions based on recency and semantic similarity.

```typescript
import "dotenv/config";

import { mastra } from "./mastra";

const threadId = "123";
const resourceId = "user-456";

const agent = mastra.getAgent("mongodbAgent");

const message = await agent.stream("My name is Mastra", {
  memory: {
    thread: threadId,
    resource: resourceId,
  },
});

await message.textStream.pipeTo(new WritableStream());

const stream = await agent.stream("What's my name?", {
  memory: {
    thread: threadId,
    resource: resourceId,
  },
  memoryOptions: {
    lastMessages: 5,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

--------------------------------

### Cloudflare Wrangler Configuration for Mastra

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/cloudflare-deployer

Example of a generated `wrangler.json` file for a Mastra application deployed to Cloudflare Workers. It includes application name, main entry point, compatibility settings, and environment variables.

```json
{
  "name": "hello-mastra",
  "main": "./index.mjs",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": [
    "nodejs_compat",
    "nodejs_compat_populate_process_env"
  ],
  "observability": { "logs": { "enabled": true } },
  "vars": {
    "OPENAI_API_KEY": "...",
    "CLOUDFLARE_API_TOKEN": "..."
  }
}

```

--------------------------------

### Create Weather Agent File

Source: https://mastra.ai/docs/v1/getting-started/installation

Creates the directory structure and an empty file for the weather agent.

```shell
mkdir -p src/mastra/agents && touch src/mastra/agents/weather-agent.ts
```

--------------------------------

### Streaming with @mastra/ai-sdk

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

The `@mastra/ai-sdk` package provides custom API routes and utilities for streaming Mastra agents in AI SDK-compatible formats. Install the package using your preferred package manager.

```APIDOC
## Streaming

The recommended way of using Mastra and AI SDK together is by installing the `@mastra/ai-sdk` package. `@mastra/ai-sdk` provides custom API routes and utilities for streaming Mastra agents in AI SDK-compatible formats. Including chat, workflow, and network route handlers, along with utilities and exported types for UI integrations.

### Installation

* **npm**
```bash
npm install @mastra/ai-sdk@beta
```

* **pnpm**
```bash
pnpm add @mastra/ai-sdk@beta
```

* **yarn**
```bash
yarn add @mastra/ai-sdk@beta
```

* **bun**
```bash
bun add @mastra/ai-sdk@beta
```
```

--------------------------------

### Thread Metadata Example (Stringified JSON)

Source: https://mastra.ai/docs/v1/server-db/storage

Demonstrates the structure of custom thread metadata, stored as a stringified JSON object. This allows for flexible categorization and prioritization of threads.

```json
{
  "category": "support",
  "priority": 1
}
```

--------------------------------

### Configure Next.js for Mastra on Vercel

Source: https://mastra.ai/docs/v1/deployment/web-framework

This configuration is for Next.js applications integrated with Mastra and deployed on Vercel. It ensures Mastra packages are correctly externalized for serverless environments and advises against using LibSQLStore. No additional setup is needed if Mastra integration is already done.

```typescript
import type { NextConfig } from "next";  
  
const nextConfig: NextConfig = {  
  serverExternalPackages: ["@mastra/*"],
};
  
export default nextConfig;  

```

--------------------------------

### Message Content Structure (JSON Example)

Source: https://mastra.ai/docs/v1/server-db/storage

Illustrates the JSON structure for message content in V2 format, including format version, message parts, and optional attachments. This structure aligns with the AI SDK UIMessage.

```json
{
  "format": 2,
  "parts": [
    {
      "type": "text",
      "content": "Hello! How can I help you today?"
    }
  ],
  "experimental_attachments": [],
  "content": "Hello! How can I help you today?",
  "toolInvocations": null,
  "reasoning": null,
  "annotations": null
}
```

--------------------------------

### Integrate Mastra AI Workflow for Trace Propagation

Source: https://mastra.ai/docs/v1/observability/tracing/overview

This code demonstrates how to integrate Mastra AI workflows, creating a workflow run and starting it with input data and external tracing information. It assumes Mastra and workflow objects are already initialized.

```javascript
const workflow = mastra.getWorkflow("data-pipeline");
const run = await workflow.createRun();

const result = await run.start({
  inputData: { data: "..." },
  tracingOptions: {
    traceId: externalTraceId,
    parentSpanId: externalSpanId,
  },
});
```

--------------------------------

### Configure Astro for Mastra on Netlify

Source: https://mastra.ai/docs/v1/deployment/web-framework

This configuration is for Astro applications integrated with Mastra and deployed on Netlify. It sets up the Netlify adapter and server output, necessitating no additional deployment steps post-Mastra integration. It also recommends discontinuing the use of LibSQLStore due to serverless environment limitations.

```typescript
import { defineConfig } from "astro/config";  
import netlify from "@astrojs/netlify";  
  
export default defineConfig({  
  // ...  
  adapter: netlify(),  
  output: "server",  
});  

```

--------------------------------

### Making Authenticated Requests

Source: https://mastra.ai/docs/v1/auth/supabase

Illustrates how to make authenticated requests to Mastra endpoints using the configured MastraClient, with examples for both a React component and cURL.

```APIDOC
## Making Authenticated Requests

### Description
Demonstrates how to utilize the configured `MastraClient` to send authenticated requests to Mastra's API endpoints, including an example of interacting with an agent.

### Request Example (React Component)
```typescript
import { mastraClient } from "../../lib/mastra-client";

export const TestAgent = () => {
  async function handleClick() {
    const agent = mastraClient.getAgent("weatherAgent");

    const response = await agent.generate({
      messages: "What's the weather like in New York"
    });

    console.log(response);
  }

  return <button onClick={handleClick}>Test Agent</button>;
};
```

### Request Example (cURL)
```bash
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-supabase-access-token>" \
  -d '{
    "messages": "Weather in London"
  }'
```
```

--------------------------------

### Mastra Scorer: Reason Generation Example

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Sets up the generation of human-readable explanations for the assigned score. This example utilizes the analysis results, including specific gluten sources, to provide a detailed reason.

```javascript
.generateReason({
  description: 'Generate a reason for the score',
  createPrompt: ({ results }) => {
    return generateReasonPrompt({
      glutenSources: results.analyzeStepResult.glutenSources,
      isGlutenFree: results.analyzeStepResult.isGlutenFree,
    });
  },
})
```

--------------------------------

### Example Agent Stream Events

Source: https://mastra.ai/docs/v1/streaming/events

Provides examples of event objects that may be emitted during agent streaming. Each event includes a 'type' and can contain additional fields like 'from' and 'payload', representing different stages of agent processing.

```json
{
  type: 'start',
  from: 'AGENT',
  // ..
}
{
  type: 'step-start',
  from: 'AGENT',
  payload: {
    messageId: 'msg-cdUrkirvXw8A6oE4t5lzDuxi',
    // ...
  }
}
{
  type: 'tool-call',
  from: 'AGENT',
  payload: {
    toolCallId: 'call_jbhi3s1qvR6Aqt9axCfTBMsA',
    toolName: 'testTool'
    // ..
  }
}
```

--------------------------------

### NetlifyDeployer Build Output Structure

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/netlify-deployer

Illustrates the file structure generated by the NetlifyDeployer for Mastra applications. This includes the .netlify directory containing functions and configuration.

```bash
.netlify/
└── v1/
    ├── functions/
    │   └── api/
    │       └── index.mjs
    └── config.json
package.json
```

--------------------------------

### Define Route Configuration (React Router)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Sets up the route configuration for your React application using React Router. This example defines an index route and a 'test' route.

```typescript
import { type RouteConfig, index, route } from "@react-router/dev/routes";  
  
export default [
  index("routes/home.tsx"),
  route("test", "routes/test.tsx"),
] satisfies RouteConfig;  

```

--------------------------------

### Initialize Inngest for Mastra (Production)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

Initializes the Inngest client for production environments. This setup configures the Inngest function ID and applies the realtime middleware, omitting the development-specific base URL and development mode flag.

```typescript
import { Inngest } from "inngest";  
import { realtimeMiddleware } from "@inngest/realtime/middleware";  
  
export const inngest = new Inngest({  
  id: "mastra",  
  middleware: [realtimeMiddleware()],  
});  

```

--------------------------------

### Connect to Smithery.ai MCP Servers via CLI using MCPClient (Windows)

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Connect MCPClient to Smithery.ai MCP servers by specifying the command-line interface execution for running the sequential thinking server. This example is for Windows systems.

```typescript
// Windows
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    sequentialThinking: {
      command: "npx",
      args: [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/server-sequential-thinking",
        "--config",
        "{}",
      ],
    },
  },
});
```

--------------------------------

### Run Inngest Dev Server with Mastra Endpoint (Shell)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This command starts the Inngest development server, connecting it to a locally running Mastra server. It forwards requests from the Inngest dev server to the Mastra API endpoint at `http://host.docker.internal:4111/api/inngest`.

```shell
docker run --rm -p 8288:8288 \
  inngest/inngest \
  inngest dev -u http://host.docker.internal:4111/api/inngest
```

--------------------------------

### Setup Agent with Working Memory (JavaScript)

Source: https://mastra.ai/docs/v1/memory/working-memory

This snippet demonstrates how to initialize a Mastra AI agent with working memory enabled. It imports necessary modules from '@mastra/core/agent', '@mastra/memory', and '@ai-sdk/openai'. The agent is configured with an ID, name, instructions, an OpenAI model, and a Memory instance where working memory is explicitly enabled.

```javascript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { openai } from "@ai-sdk/openai";

// Create agent with working memory enabled
const agent = new Agent({
  id: "personal-assistant",
  name: "PersonalAssistant",
  instructions: "You are a helpful personal assistant.",
  model: openai("gpt-4o"),
  memory: new Memory({
    options: {
      workingMemory: {
        enabled: true,
      },
    },
  }),
});
```

--------------------------------

### Clone Public Repository (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Clones a public Mastra application repository from GitHub to your EC2 instance. Assumes Git is installed.

```bash
git clone https://github.com/<your-username>/<your-repository>.git
```

--------------------------------

### Mastra Scorer: Judge Configuration Example

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Configures the language model and its role for a custom scorer. This example uses OpenAI's gpt-4o model and sets specific instructions for the LLM acting as a Chef to identify gluten.

```javascript
judge: {
  model: openai('gpt-4o'),
  instructions: GLUTEN_INSTRUCTIONS,
}
```

--------------------------------

### Mastra Scorer: Score Generation Example

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Implements the logic to convert the LLM's analysis results into a numerical score. This example assigns a score of 1 if the recipe is determined to be gluten-free, and 0 otherwise.

```javascript
.generateScore(({ results }) => {
  return results.analyzeStepResult.isGlutenFree ? 1 : 0;
})
```

--------------------------------

### Converting MastraDB Messages to AI SDK UI Format

Source: https://mastra.ai/docs/v1/server-db/storage

Provides an example of converting `MastraDBMessage` objects retrieved from storage into the `UIMessage` format required by the AI SDK for UI rendering. It imports the `toAISdkV5Messages` utility from `@mastra/ai-sdk/ui` to perform this conversion.

```javascript
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui';

const result = await mastra
  .getStorage()
  .listMessages({ threadId: "your-thread-id" });

// Convert to AI SDK v5 UIMessage format for UI rendering
const uiMessages = toAISdkV5Messages(result.messages);

```

--------------------------------

### Mastra Scorer: Analysis Step Example

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Defines the analysis logic for a custom scorer, specifying how the LLM should process input and the expected structured output. This example uses Zod for schema definition and dynamically generates prompts based on the input.

```javascript
.analyze({
  description: 'Analyze the output for gluten',
  outputSchema: z.object({
    isGlutenFree: z.boolean(),
    glutenSources: z.array(z.string()),
  }),
  createPrompt: ({ run }) => {
    const { output } = run;
    return generateGlutenPrompt({ output: output.text });
  },
})
```

--------------------------------

### Register a Custom GET API Route in Mastra

Source: https://mastra.ai/docs/v1/server-db/custom-api-routes

This snippet demonstrates how to register a custom GET API route using `registerApiRoute` from `@mastra/core/server`. The handler function receives the Hono context, allowing access to the Mastra instance to fetch agents. It returns a JSON response.

```typescript
import { Mastra } from "@mastra/core";
import { registerApiRoute } from "@mastra/core/server";

export const mastra = new Mastra({
  // ...
  server: {
    apiRoutes: [
      registerApiRoute("/my-custom-route", {
        method: "GET",
        handler: async (c) => {
          const mastra = c.get("mastra");
          const agents = await mastra.getAgent("my-agent");

          return c.json({ message: "Custom route" });
        },
      }),
    ],
  },
});
```

--------------------------------

### Client-side Supabase Token Retrieval and MastraClient Configuration

Source: https://mastra.ai/docs/v1/auth/supabase

Guides on how to retrieve Supabase access tokens on the client-side and configure the MastraClient to include these tokens for authenticated requests.

```APIDOC
## Client-side Authentication and Mastra Integration

### Description
This section details how to authenticate users on the client-side using Supabase, retrieve their access tokens, and configure the MastraClient to make authenticated API requests.

### Retrieving the Access Token
Use the Supabase client to sign in users and obtain their access token.
```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("<supabase-url>", "<supabase-key>");

const authTokenResponse = await supabase.auth.signInWithPassword({
  email: "<user's email>",
  password: "<user's password>",
});

const accessToken = authTokenResponse.data?.session?.access_token;
```
Refer to Supabase documentation for alternative authentication methods.

### Configuring `MastraClient`
When authentication is enabled, all requests must include a valid Supabase access token in the `Authorization` header.
```typescript
import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: "https://<mastra-api-url>",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```
**Note:** The `Authorization` header must be prefixed with `Bearer `.
```

--------------------------------

### Store Embeddings in PgVector Database

Source: https://mastra.ai/docs/v1/rag/vector-databases

Illustrates using the PgVector store from the Mastra library to manage embeddings. This example shows index creation and upserting vectors, similar to the MongoDB example. It requires a PostgreSQL instance with the pgvector extension and a connection string environment variable.

```typescript
import { PgVector } from "@mastra/pg";  
  
const store = new PgVector({  
  id: 'pg-vector',  
  connectionString: process.env.POSTGRES_CONNECTION_STRING,  
});  
  
await store.createIndex({  
  indexName: "myCollection",  
  dimension: 1536,  
});  
  
await store.upsert({  
  indexName: "myCollection",  
  vectors: embeddings,  
  metadata: chunks.map((chunk) => ({ text: chunk.text })),  
});  

```

--------------------------------

### Connect to Smithery.ai MCP Servers via CLI using MCPClient (Unix/Mac)

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Connect MCPClient to Smithery.ai MCP servers by specifying the command-line interface execution for running the sequential thinking server. This example is for Unix-like systems.

```typescript
// Unix/Mac
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    sequentialThinking: {
      command: "npx",
      args: [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/server-sequential-thinking",
        "--config",
        "{}",
      ],
    },
  },
});
```

--------------------------------

### Model Routing

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

When creating agents in Mastra, you can specify any AI SDK-supported model. This example shows how to set the model for a weather agent.

```APIDOC
## Model Routing

When creating agents in Mastra, you can specify any AI SDK-supported model.

### Example (`agents/weather-agent.ts`)
```typescript
import { Agent } from "@mastra/core/agent";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: "Instructions for the agent...",
  model: "openai/gpt-4-turbo",
});
```

> See Using AI SDK with Mastra for more information.
```

--------------------------------

### Example Suspended Step IDs Output (JSON)

Source: https://mastra.ai/docs/v1/workflows/suspend-and-resume

This is an example output format for the `suspended` array returned by a Mastra AI workflow run. It shows a JSON array containing the IDs of any suspended workflows or steps within a run, which can be used to target specific executions when calling the `resume()` method.

```json
[
  'nested-workflow',
  'step-1'
]
```

--------------------------------

### Handle Realtime Voice Events (JavaScript)

Source: https://mastra.ai/docs/v1/agents/adding-voice

Provides examples of how to listen to events emitted by the realtime voice provider. It covers handling 'speaking' events for audio data, 'writing' events for transcribed text, and 'error' events.

```javascript
// Listen for speech audio data sent from voice provider
agent.voice.on("speaking", ({ audio }) => {
  // audio contains ReadableStream or Int16Array audio data
});

// Listen for transcribed text sent from both voice provider and user
agent.voice.on("writing", ({ text, role }) => {
  console.log(`${role} said: ${text}`);
});

// Listen for errors
agent.voice.on("error", (error) => {
  console.error("Voice error:", error);
});

```

--------------------------------

### Advanced Configuration: Provider-wide Options for OpenRouter

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/openrouter

Demonstrates how to apply provider-wide configuration options to the OpenRouter provider. This example sets `max_tokens` for the `reasoning` part of the API call.

```typescript
import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  extraBody: {
    reasoning: {
      max_tokens: 10,
    },
  },
});

export const assistant = new Agent({
  id: "assistant",
  name: "assistant",
  instructions: "You are a helpful assistant.",
  model: openrouter("anthropic/claude-sonnet-4"),
});
```

--------------------------------

### Qdrant Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet illustrates the setup of a RAG agent specifically for Qdrant. It integrates the OpenAI model and the Qdrant prompt into the agent's instructions, enabling efficient query processing and context utilization with a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { QDRANT_PROMPT } from "@mastra/qdrant";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${QDRANT_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Add Tools to an Agent (TypeScript)

Source: https://mastra.ai/docs/v1/agents/using-tools

Configures an agent to use specific tools. This example shows how to include the 'weatherTool' in the agent's configuration, making it available for the agent to use when processing user requests.

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: `  
      You are a helpful weather assistant.  
      Use the weatherTool to fetch current weather data.`,
  model: openai("gpt-4o-mini"),
  tools: { weatherTool },
});

```

--------------------------------

### Example Usage of Mastra LibSQL Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-libsql

Demonstrates sending messages to a Mastra AI agent configured with LibSQL memory. Shows how to scope memory recall using thread and resource IDs, and apply memory options for recency and semantic search.

```typescript
import "dotenv/config";  
  
import { mastra } from "./mastra";  
  
const threadId = "123";  
const resourceId = "user-456";  
  
const agent = mastra.getAgent("libsqlAgent");  
  
const message = await agent.stream("My name is Mastra", {  
  memory: {  
    thread: threadId,  
    resource: resourceId,  
  },  
});  
  
await message.textStream.pipeTo(new WritableStream());  
  
const stream = await agent.stream("What's my name?", {  
  memory: {  
    thread: threadId,  
    resource: resourceId,  
  },  
  memoryOptions: {  
    lastMessages: 5,  
    semanticRecall: {  
      topK: 3,  
      messageRange: 2,  
    },  
  },  
});  
  
for await (const chunk of stream.textStream) {  
  process.stdout.write(chunk);  
}  

```

--------------------------------

### Create tsconfig.json File

Source: https://mastra.ai/docs/v1/getting-started/installation

Creates an empty tsconfig.json file. This file will be populated with TypeScript compiler options.

```shell
touch tsconfig.json
```

--------------------------------

### Route-Specific Middleware Attachment

Source: https://mastra.ai/docs/v1/server-db/middleware

Demonstrates attaching middleware to a single API route using the `registerApiRoute` function. This example includes a request logger for '/my-custom-route'.

```typescript
registerApiRoute("/my-custom-route", {
  method: "GET",
  middleware: [
    async (c, next) => {
      console.log(`${c.req.method} ${c.req.url}`);
      await next();
    },
  ],
  handler: async (c) => {
    const mastra = c.get("mastra");
    return c.json({ message: "Hello, world!" });
  },
});
```

--------------------------------

### Mastra AI: Per-Request Metadata Addition

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Shows how to add trace-specific metadata keys using `tracingOptions.requestContextKeys`. These keys are merged with configuration-level keys, allowing for dynamic metadata additions on a per-request basis. This example adds `experimentId`.

```javascript
const requestContext = new RequestContext();
requestContext.set("userId", "user-123");
requestContext.set("environment", "production");
requestContext.set("experimentId", "exp-789");

const result = await agent.generate({
  messages: [{ role: "user", content: "Hello" }],
  requestContext,
  tracingOptions: {
    requestContextKeys: ["experimentId"], // Adds to configured keys
  },
});

// All spans now have: userId, environment, AND experimentId
```

--------------------------------

### Voice Agent with CompositeVoice for Input/Output Flexibility

Source: https://mastra.ai/docs/v1/agents/adding-voice

This TypeScript example demonstrates how to configure an AI agent to use different providers for listening (STT) and speaking (TTS) by utilizing the CompositeVoice class. It uses OpenAI for input and PlayAI for output. Dependencies include @mastra/core, @mastra/voice-openai, @mastra/voice-playai, and @ai-sdk/openai.

```typescript
import { Agent } from "@mastra/core/agent";
import { CompositeVoice } from "@mastra/core/voice";
import { OpenAIVoice } from "@mastra/voice-openai";
import { PlayAIVoice } from "@mastra/voice-playai";
import { openai } from "@ai-sdk/openai";
  
export const agent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions: `You are a helpful assistant with both STT and TTS capabilities.`,
  model: openai("gpt-4o"),
  
  // Create a composite voice using OpenAI for listening and PlayAI for speaking  
  voice: new CompositeVoice({
    input: new OpenAIVoice(),
    output: new PlayAIVoice(),
  }),
});

```

--------------------------------

### Setting Request Context with Middleware

Source: https://mastra.ai/docs/v1/server-db/middleware

Demonstrates how to dynamically set request context values within middleware. This example sets the 'temperature-unit' based on the 'CF-IPCountry' header to match user locale.

```typescript
import { Mastra } from "@mastra/core";
import { RequestContext } from "@mastra/core/request-context";
import { testWeatherAgent } from "./agents/test-weather-agent";
  
export const mastra = new Mastra({
  agents: { testWeatherAgent },
  server: {
    middleware: [
      async (context, next) => {
        const country = context.req.header("CF-IPCountry");
        const requestContext = context.get("requestContext");

        requestContext.set(
          "temperature-unit",
          country === "US" ? "fahrenheit" : "celsius",
        );

        await next();
      },
    ],
  },
});
```

--------------------------------

### Define Basic Working Memory Template

Source: https://mastra.ai/docs/v1/memory/working-memory

An alternative JavaScript example showing a simpler Memory configuration with a concise Markdown template. This is useful when only a few key facts need to be stored, like user name and favorite color.

```javascript
const basicMemory = new Memory({
  options: {
    workingMemory: {
      enabled: true,
      template: `User Facts:\n- Name:\n- Favorite Color:\n- Current Topic:`,
    },
  },
});
```

--------------------------------

### Add Mastra MCP Server using Claude Code CLI

Source: https://mastra.ai/docs/v1/getting-started/mcp-docs-server

This command adds the Mastra MCP Docs Server to your Claude Code environment. It uses the 'claude mcp add' command with the server name 'mastra' and specifies the execution command and package to install.

```bash
claude mcp add mastra -- npx -y @mastra/mcp-docs-server
```

--------------------------------

### Resuming a Suspended Mastra Workflow Step

Source: https://mastra.ai/docs/v1/workflows/snapshots

Illustrates the process of resuming a workflow that was previously suspended. It shows how to start a workflow, check its status, and then resume a specific step with structured resume data.

```typescript
const workflow = mastra.getWorkflow("approvalWorkflow");

const run = await workflow.createRun();

const result = await run.start({
  inputData: {
    value: 100,
    user: "Michael",
    requiredApprovers: ["manager", "finance"],
  },
});

if (result.status === "suspended") {
  const resumedResult = await run.resume({
    step: "approval-step",
    resumeData: {
      confirm: true,
      approver: "manager",
    },
  });
}
```

--------------------------------

### Initialize Mastra with Supabase Authentication (TypeScript)

Source: https://mastra.ai/docs/v1/auth/supabase

Demonstrates initializing the Mastra server with Supabase authentication. It requires Supabase URL and Anon Key from environment variables.

```typescript
import { Mastra } from "@mastra/core";
import { MastraAuthSupabase } from "@mastra/auth-supabase";

export const mastra = new Mastra({
  // ..
  server: {
    auth: new MastraAuthSupabase({
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    }),
  },
});
```

--------------------------------

### Generate Speech with Sarvam Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This example shows the integration of the Mastra AI Agent with the Sarvam voice provider. It involves initializing the agent with SarvamVoice, generating text, converting it to an audio stream, and playing the audio.

```javascript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { SarvamVoice } from "@mastra/voice-sarvam";  
import { playAudio } from "@mastra/node-audio";  
  
const voiceAgent = new Agent({  
  id: "voice-agent",  
  name: "Voice Agent",  
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new SarvamVoice(),  
});  
  
const { text } = await voiceAgent.generate("What color is the sky?");  
  
// Convert text to speech to an Audio Stream  
const audioStream = await voiceAgent.voice.speak(text, {  
  speaker: "default", // Optional: specify a speaker  
});  
  
playAudio(audioStream);
```

--------------------------------

### Complete Arize Exporter Configuration Options (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Demonstrates comprehensive configuration options for the Arize Exporter. This includes settings for both Phoenix and Arize AX, shared configurations like API keys and project names, OTLP headers, logging levels, batching, timeouts, and custom resource attributes.

```javascript
new ArizeExporter({  
  // Phoenix Configuration  
  endpoint: "https://your-collector.example.com/v1/traces", // Required for Phoenix  
  
  // Arize AX Configuration  
  spaceId: "your-space-id", // Required for Arize AX  
  
  // Shared Configuration  
  apiKey: "your-api-key", // Required for authenticated endpoints  
  projectName: "mastra-service", // Optional project name  
  
  // Optional OTLP settings  
  headers: {  
    "x-custom-header": "value", // Additional headers for OTLP requests  
  },  
  
  // Debug and performance tuning  
  logLevel: "debug", // Logging: debug | info | warn | error  
  batchSize: 512, // Batch size before exporting spans  
  timeout: 30000, // Timeout in ms before exporting spans  
  
  // Custom resource attributes  
  resourceAttributes: {  
    "deployment.environment": process.env.NODE_ENV,  
    "service.version": process.env.APP_VERSION,  
  },  
});  
```

--------------------------------

### Create Next.js API Route for CopilotKit

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Sets up an API route in a Next.js application to handle CopilotKit requests. This example demonstrates connecting to local Mastra agents and utilizes Next.js specific runtime adapters.

```typescript
import { mastra } from "../../mastra";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";

```

--------------------------------

### Configure Mastra Observability with TypeScript

Source: https://mastra.ai/docs/v1/observability/overview

This code snippet demonstrates how to set up basic observability for a Mastra instance using TypeScript. It includes initializing Mastra with a logger, storage, and enabling the observability feature for tracing. The storage is required for tracing functionality.

```typescript
import { Mastra } from "@mastra/core";
import { PinoLogger } from "@mastra/loggers";
import { LibSqlStorage } from "@mastra/libsql";
import { Observability } from "@mastra/observability";

export const mastra = new Mastra({
  // ... other config
  logger: new PinoLogger(),
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db", // Storage is required for tracing
  }),
  observability: new Observability({ // Enables Tracing
    default: { enabled: true },
  }),
});

```

--------------------------------

### Dockerfile for Mastra on AWS Lambda

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

A Dockerfile to build a container image for deploying a Mastra application to AWS Lambda. It uses Node.js, installs dependencies, builds the Mastra app, and includes the AWS Lambda Web Adapter.

```dockerfile
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
RUN npx mastra build
RUN apk add --no-cache gcompat

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
RUN addgroup -g 1001 -S nodejs && \
  adduser -S mastra -u 1001 && \
  chown -R mastra:nodejs /app

USER mastra

ENV PORT=8080
ENV NODE_ENV=production
ENV READINESS_CHECK_PATH="/api"

EXPOSE 8080

CMD ["node", ".mastra/output/index.mjs"]
```

--------------------------------

### Deploy Mastra App to Netlify Manually

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/netlify-deployer

Deploys the Mastra application to Netlify for production using the Netlify CLI. This command should be run from the project's root directory.

```bash
netlify deploy --prod
```

--------------------------------

### GenerateReason Step: Human-readable Explanation (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Generates human-readable explanations for the score. This example provides a message indicating if the recipe is gluten-free or lists detected gluten sources.

```javascript
const glutenCheckerScorer = createScorer({...})
.preprocess(...)
.analyze(...)
.generateScore(...)
.generateReason(({ results, score }) => {
  const { isGlutenFree, glutenSources } = results.analyzeStepResult;

  if (isGlutenFree) {
    return `Score: ${score}. This recipe is gluten-free with no harmful ingredients detected.`;
  } else {
    return `Score: ${score}. Contains gluten from: ${glutenSources.join(', ')}`;
  }
})

```

--------------------------------

### Request Logging Middleware

Source: https://mastra.ai/docs/v1/server-db/middleware

A simple middleware that logs the HTTP method, URL, and duration of each request. It measures the time taken from the start of the middleware to its completion.

```javascript
{
  handler: async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    console.log(`${c.req.method} ${c.req.url} - ${duration}ms`);
  },
}
```

--------------------------------

### Authentication Middleware Example

Source: https://mastra.ai/docs/v1/server-db/middleware

A middleware function that checks for a valid 'Authorization' header, specifically looking for a 'Bearer ' token. It returns a 401 Unauthorized response if the header is missing or malformed.

```javascript
{
  handler: async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Validate token here
    await next();
  },
  path: '/api/*',
}
```

--------------------------------

### Automatic Mastra Configuration with Default Exporter

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/default

Shows how the DefaultExporter is automatically included when using the default observability configuration in Mastra. This simplifies setup by enabling trace persistence without explicit exporter configuration.

```typescript
import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { LibSQLStore } from "@mastra/libsql";
export const mastra = new Mastra({
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db",
  }),
  observability: new Observability({
    default: { enabled: true }, // Automatically includes DefaultExporter
  }),
});

```

--------------------------------

### Complete Braintrust Exporter Configuration (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/braintrust

Provides a comprehensive configuration example for the Braintrust exporter, including required and optional settings. It shows how to set the API key, project name, custom endpoint, and logging level for detailed diagnostics.

```typescript
new BraintrustExporter({
  // Required
  apiKey: process.env.BRAINTRUST_API_KEY!,

  // Optional settings
  projectName: "my-project", // Default: 'mastra-tracing'
  endpoint: "https://api.braintrust.dev", // Custom endpoint if needed
  logLevel: "info", // Diagnostic logging: debug | info | warn | error
});
```

--------------------------------

### Graph-based Retrieval Tool Setup

Source: https://mastra.ai/docs/v1/rag/retrieval

This code sets up a graph query tool for enhanced retrieval in documents with complex relationships. It utilizes OpenAI for embeddings and configures graph-specific options like a similarity threshold.

```javascript
const graphQueryTool = createGraphQueryTool({  
  vectorStoreName: "pgVector",  
  indexName: "embeddings",  
  model: openai.embedding("text-embedding-3-small"),  
  graphOptions: {  
    threshold: 0.7,  
  },  
});  

```

--------------------------------

### Mastra AI: Automatic Metadata Extraction (Configuration Level)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Demonstrates configuring Mastra AI to automatically extract specified keys from the RequestContext and attach them as metadata to all spans within a trace. This example sets `userId`, `environment`, and `tenantId`.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      default: {
        serviceName: "my-service",
        requestContextKeys: ["userId", "environment", "tenantId"],
        exporters: [new DefaultExporter()],
      },
    },
  }),
});
```

```javascript
const requestContext = new RequestContext();
requestContext.set("userId", "user-123");
requestContext.set("environment", "production");
requestContext.set("tenantId", "tenant-456");

// All spans in this trace automatically get userId, environment, and tenantId metadata
const result = await agent.generate({
  messages: [{ role: "user", content: "Hello" }],
  requestContext,
});
```

--------------------------------

### Chroma Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This code example defines a RAG agent for Chroma. It imports the OpenAI model and the Chroma prompt, incorporating them into the agent's instructions to facilitate context-aware query processing with a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { CHROMA_PROMPT } from "@mastra/chroma";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${CHROMA_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Configure Astro for Mastra on Vercel

Source: https://mastra.ai/docs/v1/deployment/web-framework

This configuration is for Astro applications integrated with Mastra and deployed on Vercel. It sets up the Vercel adapter and server output, requiring no further deployment configuration if Mastra integration is complete. It also suggests removing LibSQLStore usage for serverless compatibility.

```typescript
import { defineConfig } from "astro/config";  
import vercel from "@astrojs/vercel";  
  
export default defineConfig({  
  // ...  
  adapter: vercel(),  
  output: "server",  
});  

```

--------------------------------

### Remove LibSQLStore from Mastra Initialization (TypeScript)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers

This code snippet demonstrates how to remove the `LibSQLStore` initialization from the main Mastra application setup in `src/mastra/index.ts`. It shows the lines to be deleted to prevent usage of the local filesystem storage, which is incompatible with ephemeral cloud storage.

```typescript
export const mastra = new Mastra({
  // ...
  storage: new LibSQLStore({
    id: 'mastra-storage',
    // [!code --]
    // stores telemetry, scorer results, ... into memory storage, if it needs to persist, change to file:../mastra.db // [!code --]
    url: ":memory:", // [!code --]
  }), // [!code --]
});

```

--------------------------------

### Initialize Voice Agent with OpenAI - JavaScript

Source: https://mastra.ai/docs/v1/voice/overview

Initializes a voice-enabled agent using Mastra's core functionalities and the OpenAI voice provider. This setup allows the agent to perform text-to-speech (TTS) using OpenAI's models. It requires the @mastra/core and @ai-sdk/openai packages.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { OpenAIVoice } from "@mastra/voice-openai";

// Initialize OpenAI voice for TTS

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new OpenAIVoice(),
});

```

--------------------------------

### OpenSearch Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This code example defines a RAG agent for OpenSearch. It imports the OpenAI model and the OpenSearch prompt, incorporating them into the agent's instructions to facilitate context-aware query processing with a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { OPENSEARCH_PROMPT } from "@mastra/opensearch";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${OPENSEARCH_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Configure Mastra with LibSQL Storage

Source: https://mastra.ai/docs/v1/server-db/storage

This snippet demonstrates how to initialize Mastra with a LibSQL storage provider. It sets up a default storage option for persisting data across application restarts. The LibSQLStore requires an ID and a database URL.

```javascript
import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";

const mastra = new Mastra({
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db",
  }),
});
```

--------------------------------

### Example Usage of Mastra Agent with PostgreSQL Memory (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-pg

Demonstrates how to interact with a Mastra agent configured for PostgreSQL memory. It shows sending an initial message and then querying the agent with memory options to leverage semantic recall and recency.

```typescript
import "dotenv/config";

import { mastra } from "./mastra";

const threadId = "123";
const resourceId = "user-456";

const agent = mastra.getAgent("pgAgent");

const message = await agent.stream("My name is Mastra", {
  memory: {
    thread: threadId,
    resource: resourceId,
  },
});

await message.textStream.pipeTo(new WritableStream());

const stream = await agent.stream("What's my name?", {
  memory: {
    thread: threadId,
    resource: resourceId,
  },
  memoryOptions: {
    lastMessages: 5,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

```

--------------------------------

### Create and Commit an Inngest Workflow

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

Composes workflow steps into a complete Inngest workflow using Mastra's `createWorkflow`. This example demonstrates a workflow that repeatedly applies the `incrementStep` until a condition is met, registering it as an Inngest function.

```typescript
// workflow that is registered as a function on inngest server  
const workflow = createWorkflow({  
  id: "increment-workflow",  
  inputSchema: z.object({  
    value: z.number(),  
  }),  
  outputSchema: z.object({  
    value: z.number(),  
  }),  
}).then(incrementStep);  
  
workflow.commit();  
  
export { workflow as incrementWorkflow };  

```

--------------------------------

### cURL Request to Generate Agent Response

Source: https://mastra.ai/docs/v1/auth/jwt

An example cURL command to make an authenticated POST request to the Mastra API for agent generation. It includes necessary headers and a JSON payload.

```bash
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt>" \
  -d '{ \
    "messages": "Weather in London" \
  }'
```

--------------------------------

### Make Authenticated Agent Request with cURL

Source: https://mastra.ai/docs/v1/auth/supabase

Example of making an authenticated POST request to a Mastra agent's generate endpoint using cURL. Requires the Supabase access token in the Authorization header.

```bash
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-supabase-access-token>" \
  -d '{
    "messages": "Weather in London"
  }'
```

--------------------------------

### Create Tool with RequestContext (TypeScript)

Source: https://mastra.ai/docs/v1/tools-mcp/overview

An example of creating a tool that utilizes `RequestContext` to access request-specific values, such as user tier. This allows for conditional logic within the tool's execution based on the request context. It requires the `@mastra/core/tools` package.

```typescript
export type UserTier = {  
  "user-tier": "enterprise" | "pro";  
};  
  
const advancedTools = () => {  
  // ...  
};  
  
const baseTools = () => {  
  // ...  
};  
  
export const testTool = createTool({
  // ...
  execute: async ({ requestContext }) => {
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];

    return userTier === "enterprise" ? advancedTools : baseTools;
  },
});  

```

--------------------------------

### cURL Request to Mastra Agent with Clerk Token

Source: https://mastra.ai/docs/v1/auth/clerk

An example cURL command to interact with a Mastra agent, demonstrating how to include the Clerk access token in the Authorization header for an authenticated POST request.

```curl
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-clerk-access-token>" \
  -d '{
    "messages": "Weather in London"
  }'

```

--------------------------------

### Custom User Authorization Logic with MastraAuthAuth0

Source: https://mastra.ai/docs/v1/auth/auth0

Provides a custom `authorizeUser` function to MastraAuthAuth0 for fine-grained control over user access. This example only allows users with emails ending in '@yourcompany.com'.

```typescript
import { MastraAuthAuth0 } from "@mastra/auth-auth0";

const auth0Provider = new MastraAuthAuth0({
  authorizeUser: async (user) => {
    // Custom authorization logic
    return user.email?.endsWith("@yourcompany.com") || false;
  },
});
```

--------------------------------

### Mastra AI: Default Observability Config

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Demonstrates an invalid Mastra AI configuration where both default and custom observability configurations are enabled. This setup is not supported, as only one configuration type (default or custom) should be active.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    default: { enabled: true }, // This will always be used!
    configs: {
      langfuse: {
        serviceName: "my-service",
        exporters: [langfuseExporter], // This won't be reached
      },
    },
  }),
});
```

--------------------------------

### Manual Deployment with Vercel CLI

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/vercel-deployer

Provides the command to manually deploy a Mastra application to Vercel using the Vercel CLI. This command builds the project and deploys it to production with specific prebuilt and archive options.

```bash
npm run build && vercel --prod --prebuilt --archive=tgz
```

--------------------------------

### React Component for CopilotKit with Local API Endpoint

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

An example React component (`App.tsx`) that uses `CopilotKitComponent` to connect to a local API endpoint. This component assumes the API endpoint is available at '/api/copilotkit'.

```typescript
import { CopilotKitComponent } from "./components/copilotkit-component";

function App() {
  return <CopilotKitComponent runtimeUrl="/api/copilotkit" />;
}

export default App;
```

--------------------------------

### GenerateScore Step: Gluten Score Calculation (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Converts analysis results into a numerical score. This example calculates a score based on gluten-free status and confidence level.

```javascript
const glutenCheckerScorer = createScorer({...})
.preprocess(...)
.analyze(...)
.generateScore(({ results }) => {
  const { isGlutenFree, confidence } = results.analyzeStepResult;

  // Return 1 for gluten-free, 0 for contains gluten
  // Weight by confidence level
  return isGlutenFree ? confidence : 0;
})

```

--------------------------------

### Get Workflow Reference

Source: https://mastra.ai/docs/v1/workflows/overview

Demonstrates how to obtain a reference to a registered workflow using the `getWorkflow()` method on a Mastra instance. This is the preferred method over direct imports as it provides access to the Mastra instance's configuration, including logger, telemetry, and storage.

```javascript
const testWorkflow = mastra.getWorkflow("testWorkflow");
```

--------------------------------

### Integrate MCPClient Tools into an Agent

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Shows how to use an MCPClient instance to fetch tools from configured MCP servers and make them available to an AI agent. It imports the MCPClient and calls `.listTools()` within the agent's 'tools' parameter.

```typescript
import { openai } from "@ai-sdk/openai";  
import { Agent } from "@mastra/core/agent";  
  
import { testMcpClient } from "../mcp/test-mcp-client";  
  
export const testAgent = new Agent({  
  id: "test-agent",  
  name: "Test Agent",  
  description: "You are a helpful AI assistant",  
  instructions: `  
      You are a helpful assistant that has access to the following MCP Servers.  
      - Wikipedia MCP Server  
      - US National Weather Service  
  
      Answer questions using the information you find using the MCP Servers.`,  
  model: openai("gpt-4o-mini"),  
  tools: await testMcpClient.listTools(),  
});  

```

--------------------------------

### Scaffold Mastra with Default Weather Agent

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Initializes Mastra in your project using the 'init' command with the '--default' flag to quickly scaffold the default Weather agent with sensible defaults.

```bash
npx mastra@beta init --default  
```

--------------------------------

### Custom User Authorization Logic with MastraAuthFirebase

Source: https://mastra.ai/docs/v1/auth/firebase

Implements custom user authorization logic within MastraAuthFirebase. This example checks if a user's email ends with '@yourcompany.com'.

```typescript
import { MastraAuthFirebase } from "@mastra/auth-firebase";  
  
const firebaseAuth = new MastraAuthFirebase({  
  authorizeUser: async (user) => {  
    // Custom authorization logic  
    return user.email?.endsWith("@yourcompany.com") || false;  
  },  
});  

```

--------------------------------

### Configure LangSmith Exporter in Mastra AI (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langsmith

Sets up the Mastra AI instance with LangSmith observability. It requires LangSmith API key from environment variables and defines a service name for the traces. This basic setup enables sending traces to LangSmith.

```typescript
import { Mastra } from "@mastra/core";  
import { Observability } from "@mastra/observability";  
import { LangSmithExporter } from "@mastra/langsmith";  
  
export const mastra = new Mastra({  
  observability: new Observability({  
    configs: {  
      langsmith: {  
        serviceName: "my-service",  
        exporters: [  
          new LangSmithExporter({  
            apiKey: process.env.LANGSMITH_API_KEY,  
          }),  
        ],  
      },  
    },  
  }),  
});  

```

--------------------------------

### Configure and Expose Resources with MCPServer

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Illustrates how to set up an MCPServer to expose Mastra agents, tools, and workflows via an HTTP(S) interface. It defines the server's 'id', 'name', 'version', and lists the 'agents', 'tools', and 'workflows' it will serve.

```typescript
import { MCPServer } from "@mastra/mcp";  
  
import { testAgent } from "../agents/test-agent";  
import { testWorkflow } from "../workflows/test-workflow";  
import { testTool } from "../tools/test-tool";  
  
export const testMcpServer = new MCPServer({  
  id: "test-mcp-server",  // Required: unique identifier for the server  
  name: "Test MCP Server",  
  version: "1.0.0",  
  agents: { testAgent },  
  tools: { testTool },  
  workflows: { testWorkflow },  
});  

```

--------------------------------

### Add Moderation to Agent | Mastra TS

Source: https://mastra.ai/docs/v1/agents/guardrails

This example demonstrates how to add a ModerationProcessor to an agent's input processors. The ModerationProcessor helps detect and block harmful content based on specified categories and a threshold.

```typescript
import {
  openai
} from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { ModerationProcessor } from "@mastra/core/processors";

export const moderatedAgent = new Agent({
  id: "moderated-agent",
  name: "Moderated Agent",
  instructions: "You are a helpful assistant",
  model: openai("gpt-4o-mini"),
  inputProcessors: [
    new ModerationProcessor({
      model: openai("gpt-4.1-nano"),
      categories: ["hate", "harassment", "violence"],
      threshold: 0.7,
      strategy: "block",
      instructions: "Detect and flag inappropriate content in user messages",
    }),
  ],
});
```

--------------------------------

### Configure Embedder using FastEmbed (Local) - Mastra AI

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Configures the embedder for semantic recall using FastEmbed, a local embedding model. This requires installing the `@mastra/fastembed` package and then referencing the `fastembed` export in the memory configuration.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { fastembed } from "@mastra/fastembed";

const agent = new Agent({
  memory: new Memory({
    // ... other memory options
    embedder: fastembed,
  }),
});

```

--------------------------------

### Workflow Execution Output Structure

Source: https://mastra.ai/docs/v1/workflows/overview

Provides an example of the output structure returned when a workflow completes. It includes the overall workflow status, detailed status and I/O for each step, the initial input, and the final result, offering comprehensive insight into the execution lifecycle.

```json
{
  "status": "success",
  "steps": {
    // ...
    "step-1": {
      "status": "success",
      "payload": {
        "message": "Hello world"
      },
      "output": {
        "formatted": "HELLO WORLD"
      },
    },
    "step-2": {
      "status": "success",
      "payload": {
        "formatted": "HELLO WORLD"
      },
      "output": {
        "emphasized": "HELLO WORLD!!!"
      },
    }
  },
  "input": {
    "message": "Hello world"
  },
  "result": {
    "emphasized": "HELLO WORLD!!!"
  }
}
```

--------------------------------

### Implement RAG: Document Processing, Embedding, and Storage

Source: https://mastra.ai/docs/v1/rag/overview

This example demonstrates the core steps of implementing Retrieval-Augmented Generation (RAG). It involves initializing a document, splitting it into manageable chunks, generating embeddings for these chunks using a specified model, storing these embeddings in a PostgreSQL vector database, and querying for similar chunks based on a query vector. Dependencies include 'ai', '@ai-sdk/openai', '@mastra/pg', '@mastra/rag', and 'zod'.

```typescript
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import { z } from "zod";

// 1. Initialize document
const doc = MDocument.fromText(`Your document text here...`);

// 2. Create chunks
const chunks = await doc.chunk({
  strategy: "recursive",
  size: 512,
  overlap: 50,
});

// 3. Generate embeddings; we need to pass the text of each chunk
const { embeddings } = await embedMany({
  values: chunks.map((chunk) => chunk.text),
  model: openai.embedding("text-embedding-3-small"),
});

// 4. Store in vector database
const pgVector = new PgVector({
  id: 'pg-vector',
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});
await pgVector.upsert({
  indexName: "embeddings",
  vectors: embeddings,
}); // using an index name of 'embeddings'

// 5. Query similar chunks
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: queryVector, // queryVector is the embedding of the query
  topK: 3,
});

console.log("Similar chunks:", results);

```

--------------------------------

### Execute Multi-Agent Network and Stream Results

Source: https://mastra.ai/docs/v1/streaming/overview

Illustrates the use of the experimental `.network()` method for multi-agent collaboration. This example streams the output from a network loop where agents collaborate on a task and logs the final status, result, and token usage.

```javascript
const testAgent = mastra.getAgent("testAgent");  
  
const networkStream = await testAgent.network("Help me organize my day");  
  
for await (const chunk of networkStream) {  
  console.log(chunk);  
}
```

```javascript
const testAgent = mastra.getAgent("testAgent");  
  
const networkStream = await testAgent.network(  
  "Research dolphins then write a report",  
);  
  
for await (const chunk of networkStream) {  
  console.log(chunk);  
}  
  
console.log("Final status:", await networkStream.status);  
console.log("Final result:", await networkStream.result);  
console.log("Token usage:", await networkStream.usage);
```

--------------------------------

### MongoDB Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet illustrates the setup of a RAG agent for MongoDB. It integrates the OpenAI model and the MongoDB prompt into the agent's instructions, enabling efficient query processing and context utilization with a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { MONGODB_PROMPT } from "@mastra/mongodb";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${MONGODB_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Create Custom Span Processor (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Implements a custom span processor by extending `SpanOutputProcessor`. This example converts span input to lowercase. It requires `@mastra/observability` and defines a `process` method for transformation and an optional `shutdown` method for cleanup. The processor is then added to the Mastra configuration.

```typescript
import type { SpanOutputProcessor, AnySpan } from "@mastra/observability";

export class LowercaseInputProcessor implements SpanOutputProcessor {
  name = "lowercase-processor";

  process(span: AnySpan): AnySpan {
    span.input = `${span.input}`.toLowerCase();
    return span;
  }

  async shutdown(): Promise<void> {
    // Cleanup if needed
  }
}

// Use the custom processor
export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      development: {
        spanOutputProcessors: [new LowercaseInputProcessor(), new SensitiveDataFilter()],
        exporters: [new DefaultExporter()],
      },
    },
  }),
});
```

--------------------------------

### Wrap App with CedarCopilot Provider (React)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/cedar-os

Wrap your React application with the CedarCopilot provider to connect to your Mastra backend. This step configures the LLM provider, including the base URL and API key for Mastra.

```jsx
import { CedarCopilot } from "cedar-os";  

function App() {  
  return (  
    <CedarCopilot  
      llmProvider={{
        provider: "mastra",  
        baseURL: "http://localhost:4111", // default dev port for Mastra  
        apiKey: process.env.NEXT_PUBLIC_MASTRA_API_KEY, // optional — only for backend auth  
      }}
    >  
      <YourApp />  
    </CedarCopilot>  
  );
}

```

--------------------------------

### Implement Weather API Endpoint

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Implements the SvelteKit POST endpoint for the weather API. It parses the city name from the request body, calls the Mastra 'weatherAgent' to get weather information, and returns the result as JSON.

```typescript
import { json } from "@sveltejs/kit";
import { mastra } from "../../mastra";

export async function POST({ request }) {
  const { city } = await request.json();

  const response = await mastra
    .getAgent("weatherAgent")
    .generate(`What's the weather like in ${city}?`);

  return json({ result: response.text });
}

```

--------------------------------

### Register Scorers with Mastra Instance

Source: https://mastra.ai/docs/v1/evals/overview

Illustrates how to register custom scorers with a Mastra instance for use in scoring historical traces. This setup is necessary before utilizing scorers within the Mastra Studio's Observability section.

```javascript
const mastra = new Mastra({  
  // ...  
  scorers: {  
    answerRelevancy: myAnswerRelevancyScorer,  
    responseQuality: myResponseQualityScorer,  
  },  
});  

```

--------------------------------

### Dynamically Setting RequestContext from Server Middleware

Source: https://mastra.ai/docs/v1/server-db/request-context

Illustrates how to dynamically populate RequestContext within server middleware using request headers. This example sets 'temperature-unit' based on the Cloudflare 'CF-IPCountry' header to match user locale.

```typescript
import { Mastra } from "@mastra/core";  
import { RequestContext } from "@mastra/core/request-context";  
import { testWeatherAgent } from "./agents/test-weather-agent";  
  
export const mastra = new Mastra({  
  agents: { testWeatherAgent },  
  server: {  
    middleware: [  
      async (context, next) => {  
        const country = context.req.header("CF-IPCountry");  
        const requestContext = context.get("requestContext");  
  
        requestContext.set(  
          "temperature-unit",  
          country === "US" ? "fahrenheit" : "celsius",  
        );  
  
        await next();  
      },  
    ],  
  },  
});  
```

--------------------------------

### Analyze Step: Gluten Detection Algorithm (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Performs core evaluation analysis, gathering insights that will inform the scoring decision. This example demonstrates a simple gluten detection algorithm using keyword filtering.

```javascript
const glutenCheckerScorer = createScorer({...})
.preprocess(...)
.analyze(({ run, results }) => {
  const { recipeText, hasCommonGlutenWords } = results.preprocessStepResult;

  // Simple gluten detection algorithm
  const glutenKeywords = ['wheat', 'flour', 'barley', 'rye', 'bread'];
  const foundGlutenWords = glutenKeywords.filter(word =>
    recipeText.includes(word)
  );

  return {
    isGlutenFree: foundGlutenWords.length === 0,
    detectedGlutenSources: foundGlutenWords,
    confidence: hasCommonGlutenWords ? 0.9 : 0.7
  };
})

```

--------------------------------

### Call Agent Network for Tool (JavaScript)

Source: https://mastra.ai/docs/v1/agents/networks

Shows how to directly invoke a specific tool, like the `weatherTool`, through the agent network. This bypasses other agents or workflows to directly address a task, such as getting weather information.

```javascript
const result = await routingAgent.network("What's the weather in London?");

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

--------------------------------

### Enable Semantic Recall with Default Memory - Mastra AI

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Enables semantic recall by default when an agent is provided with memory. This code snippet demonstrates the basic setup for an agent with default memory configuration.

```typescript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { openai } from "@ai-sdk/openai";

const agent = new Agent({
  id: "support-agent",
  name: "SupportAgent",
  instructions: "You are a helpful support agent.",
  model: openai("gpt-4o"),
  memory: new Memory(),
});

```

--------------------------------

### Vectorize Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This code example demonstrates a RAG agent configured for Vectorize. It imports the OpenAI model and the Vectorize prompt, embedding them into the agent's instructions for efficient context management and query execution via a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { VECTORIZE_PROMPT } from "@mastra/vectorize";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${VECTORIZE_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Generate Structured Output with Tool Calling using Javascript

Source: https://mastra.ai/docs/v1/agents/overview

Generates structured output and utilizes tool calling capabilities by specifying a model. This example uses Zod for schema definition and demonstrates accessing both the parsed structured output (`response.object`) and the results of tool executions (`response.toolResults`).

```javascript
import { z } from "zod";

const response = await testAgentWithTools.generate(
  [
    {
      role: "system",
      content: "Provide a summary and keywords for the following text:",
    },
    {
      role: "user",
      content: "Please use your test tool and let me know the results",
    },
  ],
  {
    structuredOutput: {
      schema: z.object({
        summary: z.string(),
        keywords: z.array(z.string()),
      }),
      model: "openai/gpt-4o",
    },
  },
);

console.log(response.object);
console.log(response.toolResults);

```

--------------------------------

### Setting and Using RequestContext in Mastra AI

Source: https://mastra.ai/docs/v1/server-db/request-context

Demonstrates how to initialize RequestContext, set values like 'user-tier', and pass it to agent, network, workflow, and tool calls. This example shows how runtime conditions can influence the behavior of underlying primitives.

```typescript
import { RequestContext } from "@mastra/core/request-context";  
  
export type UserTier = {  
  "user-tier": "enterprise" | "pro";  
};  
  
const requestContext = new RequestContext<UserTier>();  
requestContext.set("user-tier", "enterprise");  
  
const agent = mastra.getAgent("weatherAgent");  
await agent.generate("What's the weather in London?", {  
  requestContext,  
});  
  
const routingAgent = mastra.getAgent("routingAgent");  
routingAgent.network("What's the weather in London?", {  
  requestContext,  
});  
  
const run = await mastra.getWorkflow("weatherWorkflow").createRun();  
await run.start({  
  inputData: {  
    location: "London",  
  },  
  requestContext,  
});  
await run.resume({  
  resumeData: {  
    city: "New York",  
  },  
  requestContext,  
});  
  
await weatherTool.execute({  
  context: {  
    location: "London",  
  },  
  requestContext,  
});  
```

--------------------------------

### Configure Embedder using AI SDK Package - Mastra AI

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Configures the embedder for semantic recall by directly using an embedding model from an AI SDK package. This example uses OpenAI's text-embedding-3-small via the `@ai-sdk/openai` package.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent({
  memory: new Memory({
    // ... other memory options
    embedder: openai.embedding("text-embedding-3-small"),
  }),
});

```

--------------------------------

### Stream Response Tokens using Javascript

Source: https://mastra.ai/docs/v1/agents/overview

Streams response tokens in real-time from the agent, ideal for delivering content quickly to end-users. This example shows how to iterate over the text stream and write each chunk to standard output. Prompts can be provided as strings or arrays of message objects.

```javascript
const stream = await testAgent.stream([
  { role: "user", content: "Help me organize my day" },
  { role: "user", content: "My day starts at 9am and finishes at 5.30pm" },
  { role: "user", content: "I take lunch between 12:30 and 13:30" },
  {
    role: "user",
    content: "I have meetings Monday to Friday between 10:30 and 11:30",
  },
]);

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

```

--------------------------------

### Environment-Based Configuration Selection

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Selects tracing configurations based on the deployment environment (development, staging, production). Demonstrates using `process.env.NODE_ENV` to dynamically set configuration.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      development: {
        serviceName: "my-service-dev",
        sampling: { type: "always" },
        exporters: [new DefaultExporter()],
      },
      staging: {
        serviceName: "my-service-staging",
        sampling: { type: "ratio", probability: 0.5 },
        exporters: [langfuseExporter],
      },
      production: {
        serviceName: "my-service-prod",
        sampling: { type: "ratio", probability: 0.01 },
        exporters: [cloudExporter, langfuseExporter],
      },
    },
    configSelector: (context, availableTracers) => {
      const env = process.env.NODE_ENV || "development";
      return env;
    },
  }),
});
```

--------------------------------

### Inspect and resume workflow stream payloads (JavaScript)

Source: https://mastra.ai/docs/v1/streaming/workflow-streaming

This example shows how to consume a workflow's stream using `streamVNext`, logging each chunk received. It also includes logic to check if the workflow is 'suspended' and demonstrates how to resume it using `resumeStreamVNext` to continue receiving stream updates.

```javascript
const testWorkflow = mastra.getWorkflow("testWorkflow");

const run = await testWorkflow.createRun();

const stream = await run.streamVNext({
  inputData: {
    value: "initial data",
  },
});

for await (const chunk of stream) {
  console.log(chunk);
}

if (result!.status === "suspended") {
  // if the workflow is suspended, we can resume it with the resumeStreamVNext method
  const resumedStream = await run.resumeStreamVNext({
    resumeData: { value: "resume data" },
  });

  for await (const chunk of resumedStream) {
    console.log(chunk);
  }
}
```

--------------------------------

### Authenticate and Call Mastra API with React

Source: https://mastra.ai/docs/v1/auth/auth0

This React component demonstrates how to authenticate a user using Auth0, configure the MastraClient with the obtained access token, and then make an authenticated API call to the weatherAgent. It displays the result of the weather query. Ensure you have the `@auth0/auth0-react` and `@mastra/client-js` packages installed.

```typescript
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MastraClient } from '@mastra/client-js';

export const MastraApiTest = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState(null);

  const callMastraApi = async () => {
    const token = await getAccessTokenSilently();

    const mastra = new MastraClient({
      baseUrl: "http://localhost:4111",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const weatherAgent = mastra.getAgent("weatherAgent");
    const response = await weatherAgent.generate({
      messages: "What's the weather like in New York"
    });

    setResult(response.text);
  };

  return (
    <div>
      <button onClick={callMastraApi}>
        Test Mastra API
      </button>

      {result && (
        <div className="result">
          <h6>Result:</h6>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};
```

--------------------------------

### Define Custom Working Memory Template

Source: https://mastra.ai/docs/v1/memory/working-memory

This JavaScript snippet demonstrates how to initialize a Memory object with a custom Markdown template for working memory. The template structures fields like 'Name', 'Location', and 'Timezone', guiding the agent on what information to track.

```javascript
const memory = new Memory({
  options: {
    workingMemory: {
      enabled: true,
      template: `
# User Profile

## Personal Info

- Name:
- Location:
- Timezone:

## Preferences

- Communication Style: [e.g., Formal, Casual]
- Project Goal:
- Key Deadlines:
  - [Deadline 1]: [Date]
  - [Deadline 2]: [Date]

## Session State

- Last Task Discussed:
- Open Questions:
  - [Question 1]
  - [Question 2]
`,
    },
  },
});
```

--------------------------------

### Transforming Mastra Streams to AI SDK Format in API Route

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

This example illustrates how to manually transform Mastra streams into the AI SDK-compatible format within an API route. It fetches an agent, streams its messages, and then uses `toAISdkFormat` to convert the stream. The transformed stream is then used to create a UI message stream and a corresponding `Response` object to be sent to the client.

```typescript
import { mastra } from "../../mastra";  
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";  
import { toAISdkFormat } from "@mastra/ai-sdk";  
  
export async function POST(req: Request) {  
  const { messages } = await req.json();  
  const myAgent = mastra.getAgent("weatherAgent");  
  const stream = await myAgent.stream(messages);  
  
  // Transform stream into AI SDK format and create UI messages stream  
  const uiMessageStream = createUIMessageStream({  
    execute: async ({ writer }) => {  
      for await (const part of toAISdkFormat(stream, { from: "agent" })!) {  
        writer.write(part);  
      }  
    },  
  });  
  
  // Create a Response that streams the UI message stream to the client  
  return createUIMessageStreamResponse({  
    stream: uiMessageStream,  
  });  
}  

```

--------------------------------

### Prevent Prompt Injection with PromptInjectionDetector | Mastra TS

Source: https://mastra.ai/docs/v1/agents/guardrails

This example implements the PromptInjectionDetector to scan user messages for prompt injection, jailbreak attempts, and system override patterns. It uses an LLM to classify risky input and can block or rewrite it.

```typescript
import { PromptInjectionDetector } from "@mastra/core/processors";
import { openai } from "@ai-sdk/openai";

export const secureAgent = new Agent({
  id: "secure-agent",
  name: "Secure Agent",
  // ...
  inputProcessors: [
    new PromptInjectionDetector({
      model: openai("gpt-4.1-nano"),
      threshold: 0.8,
      strategy: "rewrite",
      detectionTypes: ["injection", "jailbreak", "system-override"],
    }),
  ],
});
```

--------------------------------

### Initialize Mastra with Vercel Deployer

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/vercel-deployer

Demonstrates how to initialize the Mastra core with the VercelDeployer. This sets up Mastra to use Vercel for deployments by default.

```typescript
import { Mastra } from "@mastra/core";
import { VercelDeployer } from "@mastra/deployer-vercel";

export const mastra = new Mastra({
  // ...
  deployer: new VercelDeployer(),
});
```

--------------------------------

### Define Next.js Route Handler for useCompletion Hook (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

An example of a Next.js Route Handler (POST) that acts as the backend for the useCompletion hook. It processes a user prompt, retrieves an agent, streams the completion response in 'aisdk' format, and returns it as a UI message stream response.

```typescript
import { mastra } from "../../../mastra";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const myAgent = mastra.getAgent("weatherAgent");
  const stream = await myAgent.stream([{ role: "user", content: prompt }], {
    format: "aisdk",
  });

  return stream.toUIMessageStreamResponse();
}

```

--------------------------------

### Configure Phoenix for Arize Exporter (Node.js)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Sets up the Arize Exporter for Phoenix, an open-source observability platform. It requires environment variables for the endpoint, API key (optional), and project name. The exporter is initialized with these configurations.

```typescript
import { Mastra } from "@mastra/core";  
import { Observability } from "@mastra/observability";  
import { ArizeExporter } from "@mastra/arize";  
  
export const mastra = new Mastra({  
  observability: new Observability({  
    configs: {  
      arize: {  
        serviceName: process.env.PHOENIX_PROJECT_NAME || "mastra-service",  
        exporters: [  
          new ArizeExporter({  
            endpoint: process.env.PHOENIX_ENDPOINT!,  
            apiKey: process.env.PHOENIX_API_KEY,  
            projectName: process.env.PHOENIX_PROJECT_NAME,  
          }),  
        ],  
      },  
    },  
  }),  
});  
```

--------------------------------

### Generate Structured Output with Zod using Javascript

Source: https://mastra.ai/docs/v1/agents/overview

Generates structured, type-safe data from an agent using Zod schemas. This example defines the expected output shape for a summary and keywords, allowing direct access to validated and typed data via `response.object`.

```javascript
import { z } from "zod";

const response = await testAgent.generate(
  [
    {
      role: "system",
      content: "Provide a summary and keywords for the following text:",
    },
    {
      role: "user",
      content: "Monkey, Ice Cream, Boat",
    },
  ],
  {
    structuredOutput: {
      schema: z.object({
        summary: z.string(),
        keywords: z.array(z.string()),
      }),
    },
  },
);

console.log(response.object);

```

--------------------------------

### Register a Custom API Route with Middleware in Mastra

Source: https://mastra.ai/docs/v1/server-db/custom-api-routes

This example shows how to register a custom API route with middleware. The middleware function executes before the main handler, allowing for pre-processing or logging. The handler then returns a JSON response.

```typescript
import { Mastra } from "@mastra/core";
import { registerApiRoute } from "@mastra/core/server";

export const mastra = new Mastra({
  // ...
  server: {
    apiRoutes: [
      registerApiRoute("/my-custom-route", {
        method: "GET",
        middleware: [
          async (c, next) => {
            console.log(`${c.req.method} ${c.req.url}`);
            await next();
          },
        ],
        handler: async (c) => {
          return c.json({ message: "Custom route with middleware" });
        },
      }),
    ],
  },
});
```

--------------------------------

### Define Next.js Route Handler for useChat Hook (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Provides an example of a Next.js Route Handler (POST) that serves as the backend for the useChat hook. It receives messages from the client, retrieves an agent, streams responses in 'aisdk' format, and returns them as a UI message stream response.

```typescript
import { mastra } from "../../mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const myAgent = mastra.getAgent("weatherAgent");
  const stream = await myAgent.stream(messages, { format: "aisdk" });

  return stream.toUIMessageStreamResponse();
}

```

--------------------------------

### Configure OpenAI API Key in .env

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Sets the `VITE_OPENAI_API_KEY` environment variable in the `.env` file. The `VITE_` prefix is required for SvelteKit's Vite environment to access the key.

```env
VITE_OPENAI_API_KEY=<your-api-key>

```

--------------------------------

### Partial Redaction Style Example

Source: https://mastra.ai/docs/v1/observability/tracing/processors/sensitive-data-filter

Illustrates the configuration for the 'partial' redaction style in the Sensitive Data Filter. This style masks most of the sensitive data, showing only the first and last three characters for debugging purposes.

```javascript
new SensitiveDataFilter({
  redactionStyle: "partial",
});
```

--------------------------------

### Configure Mastra MCP Docs Server in JSON

Source: https://mastra.ai/docs/v1/getting-started/mcp-docs-server

This JSON configuration is used for manually setting up the Mastra MCP Docs Server in various AI tools. It specifies the server type, command to execute, and arguments required to run the server, enabling tools to access Mastra's knowledge base.

```json
{
  "mcpServers": {
    "mastra": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

```json
{
  "servers": {
    "mastra": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

```json
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

--------------------------------

### Text to Speech with Sarvam Voice Provider

Source: https://mastra.ai/docs/v1/voice/overview

This code example shows how to configure and use the Mastral AI Agent with the Sarvam voice provider for speech-to-text functionality. It utilizes the 'gpt-4o' model and Sarvam's voice capabilities, processing an audio file to generate a text response.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { SarvamVoice } from "@mastra/voice-sarvam";
import { createReadStream } from "fs";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new SarvamVoice(),
});

// Use an audio file from a URL
const audioStream = await createReadStream("./how_can_i_help_you.mp3");

// Convert audio to text
const transcript = await voiceAgent.voice.listen(audioStream);
console.log(`User said: ${transcript}`);

// Generate a response based on the transcript
const { text } = await voiceAgent.generate(transcript);
```

--------------------------------

### Configure Embedder using Model Router - Mastra AI

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Configures the embedder for semantic recall using the recommended model router with a `provider/model` string. This example uses OpenAI's text-embedding-3-small and automatically handles API key detection from environment variables.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  memory: new Memory({
    // ... other memory options
    embedder: "openai/text-embedding-3-small", // TypeScript autocomplete supported
  }),
});

```

--------------------------------

### Real-time Speech to Speech with Google Gemini Live Voice Provider

Source: https://mastra.ai/docs/v1/voice/overview

This example demonstrates a real-time speech-to-speech conversation using the Mastral AI Agent with the Google Gemini Live Voice provider. It covers connecting to the voice service, handling audio and text events, and initiating a conversation with microphone input.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { playAudio, getMicrophoneStream } from "@mastra/node-audio";
import { GeminiLiveVoice } from "@mastra/voice-google-gemini-live";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new GeminiLiveVoice({
    // Live API mode
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash-exp",
    speaker: "Puck",
    debug: true,
    // Vertex AI alternative:
    // vertexAI: true,
    // project: 'your-gcp-project',
    // location: 'us-central1',
    // serviceAccountKeyFile: '/path/to/service-account.json',
  }),
});

// Connect before using speak/send
await voiceAgent.voice.connect();

// Listen for agent audio responses
voiceAgent.voice.on("speaker", ({ audio }) => {
  playAudio(audio);
});

// Listen for text responses and transcriptions
voiceAgent.voice.on("writing", ({ text, role }) => {
  console.log(`${role}: ${text}`);
});

// Initiate the conversation
await voiceAgent.voice.speak("How can I help you today?");

// Send continuous audio from the microphone
const micStream = getMicrophoneStream();
await voiceAgent.voice.send(micStream);
```

--------------------------------

### Mastra Agent Instruction Formats

Source: https://mastra.ai/docs/v1/agents/overview

Demonstrates different ways to define system instructions for a Mastra agent. Instructions can be a single string, an array of strings, or an array of system message objects, providing flexibility in defining agent behavior.

```typescript
// String (most common)  
instructions: "You are a helpful assistant.";  

// Array of strings  
instructions: [
  "You are a helpful assistant.",  
  "Always be polite.",  
  "Provide detailed answers.",  
];  

// Array of system messages  
instructions: [
  { role: "system", content: "You are a helpful assistant." },  
  { role: "system", content: "You have expertise in TypeScript." },  
];  

```

--------------------------------

### Create Weather API Test Page File

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Creates a new Svelte component file '+page.svelte' for testing the weather API. This page will include a form to input a city name and display the weather information returned by the API.

```bash
touch src/routes/weather-api-test/+page.svelte

```

--------------------------------

### Generate Speech with Deepgram Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This example demonstrates generating speech using the Mastra AI Agent configured with the Deepgram voice provider. It includes importing necessary modules like Agent, openai, DeepgramVoice, and playAudio. The generated text is converted to an audio stream and played.

```javascript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { DeepgramVoice } from "@mastra/voice-deepgram";  
import { playAudio } from "@mastra/node-audio";  
  
const voiceAgent = new Agent({  
  id: "voice-agent",  
  name: "Voice Agent",  
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new DeepgramVoice(),  
});  
  
const { text } = await voiceAgent.generate("What color is the sky?");  
  
// Convert text to speech to an Audio Stream  
const audioStream = await voiceAgent.voice.speak(text, {  
  speaker: "aura-english-us", // Optional: specify a speaker  
});  
  
playAudio(audioStream);
```

--------------------------------

### Define Custom Inngest Functions (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This snippet demonstrates how to define custom Inngest functions using the `inngest` SDK. It includes examples for sending welcome emails and processing webhooks, each with its own ID and event trigger. These functions are intended to be imported and used within the Mastra application.

```typescript
import { inngest } from "./inngest";

// Define custom Inngest functions
export const customEmailFunction = inngest.createFunction(
  { id: "send-welcome-email" },
  { event: "user/registered" },
  async ({ event }) => {
    // Custom email logic here
    console.log(`Sending welcome email to ${event.data.email}`);
    return { status: "email_sent" };
  },
);

export const customWebhookFunction = inngest.createFunction(
  { id: "process-webhook" },
  { event: "webhook/received" },
  async ({ event }) => {
    // Custom webhook processing
    console.log(`Processing webhook: ${event.data.type}`);
    return { processed: true };
  },
);
```

--------------------------------

### Storage Providers

Source: https://mastra.ai/docs/v1/server-db/storage

Information on the different storage providers supported by Mastra for local development and production environments.

```APIDOC
## Storage Providers

### Description
Mastra supports various storage providers to accommodate different deployment needs, from local development to production and serverless environments.

### Method
N/A (Informational)

### Endpoint
N/A (Informational)

### Parameters
None

### Request Example
None

### Response
None

### Supported Providers:
- **LibSQL Storage**: For local development.
- **PostgreSQL Storage**: For production environments.
- **Upstash Storage**: For serverless deployments.
- **MongoDB Storage**: For document-based storage.
```

--------------------------------

### Making Authenticated Requests on Node.js with MastraClient (JavaScript)

Source: https://mastra.ai/docs/v1/auth/firebase

Shows how to make authenticated requests to the Mastra API from a Node.js server. This example uses the Firebase Admin SDK to verify a Firebase ID token and then initializes MastraClient for API interaction.

```javascript
const express = require('express');  
const admin = require('firebase-admin');  
const { MastraClient } = require('@mastra/client-js');  

// Initialize Firebase Admin  
admin.initializeApp({
  credential: admin.credential.cert({
    // Your service account credentials  
  })
});

const app = express();  
app.use(express.json());  

app.post('/generate', async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify the token  
    await admin.auth().verifyIdToken(idToken);

    const mastra = new MastraClient({
      baseUrl: "http://localhost:4111",
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    const weatherAgent = mastra.getAgent("weatherAgent");
    const response = await weatherAgent.generate({
      messages: "What's the weather like in Nairobi"
    });

    res.json({ response: response.text });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

```

--------------------------------

### Add Mastra Dev and Build Scripts to package.json

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Adds custom scripts to your `package.json` file for running the Mastra development server and building Mastra projects. These scripts facilitate the Mastra workflow.

```json
{
  "scripts": {
    ...
    "dev:mastra": "mastra dev",
    "build:mastra": "mastra build"
  }
}

```

--------------------------------

### Accessing RequestContext in Workflow Step Execution

Source: https://mastra.ai/docs/v1/server-db/request-context

Demonstrates how to access and use RequestContext within the `execute` function of a workflow step. This example retrieves 'user-tier' to modify the step's logic based on the user's subscription level.

```typescript
export type UserTier = {  
  "user-tier": "enterprise" | "pro";  
};  
  
const stepOne = createStep({  
  id: "step-one",  
  execute: async ({ requestContext }) => {  
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];  
  
    if (userTier === "enterprise") {  
      // ...  
    }  
    // ...  
  },  
});  
```

--------------------------------

### Configure Default LibSQL Storage for Mastra

Source: https://mastra.ai/docs/v1/memory/overview

Sets up a default in-memory LibSQL storage adapter for the main Mastra instance. This storage will be used by any agent with memory enabled.

```typescript
import { Mastra } from "@mastra/core";  
import { LibSQLStore } from "@mastra/libsql";  

export const mastra = new Mastra({
  // ...  
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ":memory:",
  }),
});

```

--------------------------------

### Enable Automatic Thread Title Generation

Source: https://mastra.ai/docs/v1/memory/threads-and-resources

This example shows how to enable automatic thread title generation for an agent by setting the `generateTitle` option to `true` within the Memory configuration. This feature improves conversation organization but is disabled by default.

```javascript
export const testAgent = new Agent({  
  memory: new Memory({  
    options: {  
      generateTitle: true, // Explicitly enable automatic title generation  
    },  
  }),  
});  
```

--------------------------------

### Configure Supabase Credentials in .env

Source: https://mastra.ai/docs/v1/auth/supabase

Environment variables for Supabase URL and Anon Key are required for MastraAuthSupabase. Ensure these are set in your .env file for proper authentication.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

--------------------------------

### Use Chat Hook with Default Transport (JavaScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Utilizes the `useChat()` hook from the AI SDK to interact with a chat API endpoint. It employs `DefaultChatTransport` to establish communication with the specified API. This is a basic setup for sending messages and receiving responses.

```javascript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/chat",
  }),
});

```

--------------------------------

### Configure Sensitive Data Filter for Healthcare (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/processors/sensitive-data-filter

Example of initializing the SensitiveDataFilter with a list of sensitive fields relevant to healthcare applications, such as HIPAA-related identifiers. This helps in masking protected health information (PHI) during data processing.

```typescript
new SensitiveDataFilter({
  sensitiveFields: [
    // HIPAA-related fields
    "ssn",
    "socialSecurityNumber",
    "medicalRecordNumber",
    "mrn",
    "healthInsuranceNumber",
    "diagnosisCode",
    "icd10",
    "prescription",
    "medication",
  ],
});
```

--------------------------------

### React Component for Testing Mastra Agent with Clerk Auth

Source: https://mastra.ai/docs/v1/auth/clerk

A React component that uses Clerk's useAuth hook to get an access token and then initializes MastraClient with this token. It allows users to test an agent by sending a request with the authenticated client.

```typescript
"use client";

import { useAuth } from "@clerk/nextjs";
import { MastraClient } from "@mastra/client-js";

export const TestAgent = () => {
  const { getToken } = useAuth();

  async function handleClick() {
    const token = await getToken();

    const client = new MastraClient({
      baseUrl: "http://localhost:4111",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const weatherAgent = client.getAgent("weatherAgent");
    const response = await weatherAgent.generate({
      messages: "What's the weather like in New York",
    });

    console.log({ response });
  }

  return <button onClick={handleClick}>Test Agent</button>;
};

```

--------------------------------

### Initialize PinoLogger for Mastra Project (TypeScript)

Source: https://mastra.ai/docs/v1/logging

Demonstrates how to initialize a new Mastra project with PinoLogger included by default. This logger captures function execution, input, and output data.

```typescript
import { Mastra } from "@mastra/core";  
import { PinoLogger } from "@mastra/loggers";  
  
export const mastra = new Mastra({"  
  // ...  
  logger: new PinoLogger({"  
    name: "Mastra",  
    level: "info",  
  }),  
});  

```

--------------------------------

### Emit Top-Level Stream Chunks with `writer.custom` in Mastra Tool

Source: https://mastra.ai/docs/v1/streaming/tool-streaming

This example shows using `context.writer.custom()` in a Mastra tool to emit top-level stream chunks, particularly useful for UI framework integration. It emits 'data-tool-progress' events with 'pending' and 'success' statuses.

```typescript
import { createTool } from "@mastra/core/tools";  
  
export const testTool = createTool({
  // ...  
  execute: async (inputData, context) => {
    const { value } = inputData;

   await context?.writer?.custom({
      type: "data-tool-progress",  
      status: "pending"
    });  

    const response = await fetch(...);  

   await context?.writer?.custom({
      type: "data-tool-progress",  
      status: "success"
    });  

    return {
      value: ""  
    };
  }
});  

```

--------------------------------

### Parallel Step Execution with .parallel() in TypeScript

Source: https://mastra.ai/docs/v1/workflows/control-flow

Illustrates running multiple steps concurrently using `.parallel()`. Each step needs a unique `id` to reference its output in subsequent steps. The example shows how a following step combines results from parallel steps based on their IDs.

```typescript
const step1 = createStep({
  id: "step-1",
  // ...
});

const step2 = createStep({
  id: "step-2",
  // ...
});

const step3 = createStep({
  id: "step-3",
  inputSchema: z.object({
    "step-1": z.object({
      formatted: z.string()
    }),
    "step-2": z.object({
      emphasized: z.string()
    })
  }),
  outputSchema: z.object({
    combined: z.string()
  }),
  execute: async ({ inputData }) => {
    const { formatted } = inputData["step-1"];
    const { emphasized } = inputData["step-2"];
    return {
      combined: `${formatted} | ${emphasized}`
    };
  }
});

export const testWorkflow = createWorkflow({
  // ...
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    combined: z.string()
  })
})
  .parallel([step1, step2])
  .then(step3)
  .commit();

```

--------------------------------

### Handle Location Disambiguation and Typos with runEvals (Vitest)

Source: https://mastra.ai/docs/v1/evals/running-in-ci

This Vitest example showcases using `runEvals` for more complex scenarios like location disambiguation and handling typos. It defines two separate test cases within the `Weather Agent Tests` describe block, each focusing on a specific aspect of the agent's performance and using the `locationScorer`.

```typescript
describe('Weather Agent Tests', () => {
  const locationScorer = createScorer({ /* ... */ });

  it('should handle location disambiguation', async () => {
    const result = await runEvals({
      data: [
        { input: 'weather in Berlin', groundTruth: { /* ... */ } },
        { input: 'weather in Berlin, Maryland', groundTruth: { /* ... */ } },
      ],
      target: weatherAgent,
      scorers: [locationScorer]
    });

    expect(result.scores['location-accuracy']).toBe(1);
  });

  it('should handle typos and misspellings', async () => {
    const result = await runEvals({
      data: [
        { input: 'weather in Berln', groundTruth: { expectedLocation: 'Berlin', expectedCountry: 'DE' } },
        { input: 'weather in Parris', groundTruth: { expectedLocation: 'Paris', expectedCountry: 'FR' } },
      ],
      target: weatherAgent,
      scorers: [locationScorer]
    });

    expect(result.scores['location-accuracy']).toBe(1);
  });
});
```

--------------------------------

### Mastra AI Action for Weather (Next.js App Router)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

A server action written in TypeScript for the Next.js App Router. It retrieves weather information for a specified city using a Mastra AI agent. This example demonstrates how to interact with Mastra agents from server-side code.

```typescript
"use server";  
  
import { mastra } from "../../mastra";  
  
export async function getWeatherInfo(formData: FormData) {  
  const city = formData.get("city")?.toString();  
  const agent = mastra.getAgent("weatherAgent");  
  
  const result = await agent.generate(`What's the weather like in ${city}?`);  
  
  return result.text;  
}  
```

--------------------------------

### Pipe Agent Text Stream to Tool Writer in Mastra

Source: https://mastra.ai/docs/v1/streaming/tool-streaming

This Mastra tool example shows how to pipe an agent's text stream directly into the tool's writer. This enables the tool to receive and process the agent's partial output, automatically aggregating it into the tool run.

```typescript
import { createTool } from "@mastra/core/tools";  
import { z } from "zod";  
  
export const testTool = createTool({
  // ...  
  execute: async (inputData, context) => {
    const { city } = inputData;

    const testAgent = context?.mastra?.getAgent("testAgent");  
    const stream = await testAgent?.stream(`What is the weather in ${city}?`);  

    await stream!.textStream.pipeTo(context?.writer!);  

    return {
      value: await stream!.text,  
    };
  },
});  

```

--------------------------------

### Firebase Authentication: Sign in, Get ID Token, Sign Out (TypeScript)

Source: https://mastra.ai/docs/v1/auth/firebase

Handles user authentication using Firebase, including signing in with Google, retrieving user ID tokens, and signing out. It depends on the Firebase SDK and a pre-configured Firebase instance.

```typescript
import { signInWithPopup, signOut, User } from "firebase/auth";  
import { auth, googleProvider } from "./firebase";  
  
export const signInWithGoogle = async () => {  
  try {  
    const result = await signInWithPopup(auth, googleProvider);  
    return result.user;  
  } catch (error) {  
    console.error("Error signing in:", error);  
    throw error;  
  }  
};

export const getIdToken = async (user: User) => {  
  try {  
    const idToken = await user.getIdToken();  
    return idToken;  
  } catch (error) {  
    console.error("Error getting ID token:", error);  
    throw error;  
  }  
};

export const signOutUser = async () => {  
  try {  
    await signOut(auth);  
  } catch (error) {  
    console.error("Error signing out:", error);  
    throw error;  
  }  
};

```

--------------------------------

### Create Weather API Endpoint Directory

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Creates a new directory named 'weather-api' within the 'src/routes' folder. This directory will contain the SvelteKit endpoint for handling weather-related requests.

```bash
mkdir src/routes/weather-api

```

--------------------------------

### Custom User Authorization with MastraAuthWorkos

Source: https://mastra.ai/docs/v1/auth/workos

Configure MastraAuthWorkos with a custom `authorizeUser` function to define specific user authorization logic. This example grants access if the user object is truthy, effectively bypassing the default admin role check.

```typescript
import { MastraAuthWorkos } from "@mastra/auth-workos";  
  
const workosAuth = new MastraAuthWorkos({
  apiKey: process.env.WORKOS_API_KEY,
  clientId: process.env.WORKOS_CLIENT_ID,
  authorizeUser: async (user) => {
    return !!user;
  },
});  

```

--------------------------------

### Propagate Traces in Express Middleware with Mastra and OpenTelemetry

Source: https://mastra.ai/docs/v1/observability/tracing/overview

This example shows how to integrate Mastra AI tracing within an Express.js application. It retrieves the current OpenTelemetry span context and passes it to the Mastra agent's generate method, ensuring distributed tracing across the HTTP request and agent execution.

```javascript
import { trace } from "@opentelemetry/api";
import express from "express";

const app = express();

app.post("/api/analyze", async (req, res) => {
  // Get current OpenTelemetry context
  const currentSpan = trace.getActiveSpan();
  const spanContext = currentSpan?.spanContext();

  const result = await agent.generate(req.body.message, {
    tracingOptions: spanContext
      ? {
          traceId: spanContext.traceId,
          parentSpanId: spanContext.spanId,
        }
      : undefined,
  });

  res.json(result);
});
```

--------------------------------

### Configure MastraClient with advanced options in TypeScript

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Initializes the MastraClient with advanced configuration options including retries, backoff delays, and custom headers. These settings help control request behavior and add diagnostic metadata.

```typescript
import { MastraClient } from "@mastra/client-js";  
  
export const mastraClient = new MastraClient({
  // ...
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
  headers: {
    "X-Development": "true",
  },
});
```

--------------------------------

### Store Embeddings in MongoDB Vector Database

Source: https://mastra.ai/docs/v1/rag/vector-databases

Demonstrates how to initialize and use the MongoDBVector store from the Mastra library. It includes creating an index and upserting vectors with associated metadata. Requires MongoDB Atlas Vector Search setup and environment variables for connection.

```typescript
import { MongoDBVector } from "@mastra/mongodb";  
  
const store = new MongoDBVector({  
  uri: process.env.MONGODB_URI,  
  dbName: process.env.MONGODB_DATABASE,  
});  
await store.createIndex({  
  indexName: "myCollection",  
  dimension: 1536,  
});  
await store.upsert({  
  indexName: "myCollection",  
  vectors: embeddings,  
  metadata: chunks.map((chunk) => ({ text: chunk.text })),  
});  

```

--------------------------------

### Metadata Filtering in PgVector Queries

Source: https://mastra.ai/docs/v1/rag/retrieval

Demonstrates various ways to filter search results from a PgVector store using metadata. It includes examples for simple equality, numeric comparisons ($gt, $lt), multiple conditions ($and), array operations ($in), and logical operators ($or, $and). These filters help narrow down the search space based on document attributes like source, price, category, and tags. Requires an initialized PgVector instance and an embedding.

```typescript
// Simple equality filter
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    source: "article1.txt",
  },
});

// Numeric comparison
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    price: { $gt: 100 },
  },
});

// Multiple conditions
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    category: "electronics",
    price: { $lt: 1000 },
    inStock: true,
  },
});

// Array operations
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    tags: { $in: ["sale", "new"] },
  },
});

// Logical operators
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    $or: [{ category: "electronics" }, { category: "accessories" }],
    $and: [{ price: { $gt: 50 } }, { price: { $lt: 200 } }],
  },
});
```

--------------------------------

### Configure OpenAI Voice Provider in JavaScript

Source: https://mastra.ai/docs/v1/voice/text-to-speech

Demonstrates how to instantiate the `OpenAIVoice` provider with specific speech model configurations, including API keys and speaker selection. It also shows a simplified way to use default settings.

```javascript
const voice = new OpenAIVoice({
  speechModel: {
    name: "tts-1-hd",
    apiKey: process.env.OPENAI_API_KEY,
  },
  speaker: "alloy",
});

// If using default settings the configuration can be simplified to:
const voice = new OpenAIVoice();

```

--------------------------------

### Fetch Dynamic Toolsets with MCPClient.listToolsets() in TypeScript

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Retrieves toolsets for dynamic configurations, ideal for multi-user SaaS applications where tool configurations (like API keys) can vary per request. The returned toolsets are passed to the `toolsets` option in agent's `.generate()` or `.stream()` calls.

```typescript
import { MCPClient } from "@mastra/mcp";
import { mastra } from "./mastra";

async function handleRequest(userPrompt: string, userApiKey: string) {
  const userMcp = new MCPClient({
    servers: {
      weather: {
        url: new URL("http://localhost:8080/mcp"),
        requestInit: {
          headers: {
            Authorization: `Bearer ${userApiKey}`,
          },
        },
      },
    },
  });

  const agent = mastra.getAgent("testAgent");

  const response = await agent.generate(userPrompt, {
    toolsets: await userMcp.listToolsets(),
  });

  await userMcp.disconnect();

  return Response.json({
    data: response.text,
  });
}
```

--------------------------------

### Making Authenticated Requests in React with MastraClient (TypeScript)

Source: https://mastra.ai/docs/v1/auth/firebase

Demonstrates how to make authenticated requests to the Mastra API from a React component. It uses Firebase authentication to get the user's ID token and then creates a MastraClient instance to interact with a 'weatherAgent'.

```typescript
"use client";  

import { useAuthState } from 'react-firebase-hooks/auth';  
import { MastraClient } from "@mastra/client-js";  
import { auth } from '../lib/firebase';  
import { getIdToken } from '../lib/auth';  

export const TestAgent = () => {  
  const [user] = useAuthState(auth);  

  async function handleClick() {  
    if (!user) return;  

    const token = await getIdToken(user);  
    const client = createMastraClient(token);  

    const weatherAgent = client.getAgent("weatherAgent");  
    const response = await weatherAgent.generate({  
      messages: "What's the weather like in New York",  
    });  

    console.log({ response });  
  }  

  return (  
    <button onClick={handleClick} disabled={!user}>  
      Test Agent  
    </button>  
  );
};

```

--------------------------------

### Iterate Agent Network Stream with Mastra AI

Source: https://mastra.ai/docs/v1/streaming/events

Initiates a network stream with a given agent and iterates over the stream to log each received chunk. This is useful for observing the full flow of task delegation and execution across agents, workflows, and tools. It requires the mastra library to be installed and initialized.

```javascript
const networkAgent = mastra.getAgent("networkAgent");  
  
const networkStream = await networkAgent.network(  
  "Research dolphins then write a report",  
);

for await (const chunk of networkStream) {  
  console.log(chunk);  
}
```

--------------------------------

### Express Weather API with Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Adds a '/api/weather' endpoint to an Express server that uses a Mastra agent to get weather information. It expects a 'city' query parameter and handles potential errors. Requires 'express' and the local 'mastra' module.

```typescript
import express, { Request, Response } from "express";  
import { mastra } from "./mastra";  
  
const app = express();  
const port = 3456;  
  
app.get("/", (req: Request, res: Response) => {  
  res.send("Hello, world!");  
});  
  
app.get("/api/weather", async (req: Request, res: Response) => {  
  const { city } = req.query as { city?: string };  
  
  if (!city) {  
    return res.status(400).send("Missing 'city' query parameter");  
  }  
  
  const agent = mastra.getAgent("weatherAgent");  
  
  try {  
    const result = await agent.generate(`What's the weather like in ${city}?`);  
    res.send(result.text);  
  } catch (error) {  
    console.error("Agent error:", error);  
    res.status(500).send("An error occurred while processing your request");  
  }  
});  
  
app.listen(port, () => {  
  console.log(`Server is running at http://localhost:${port}`);  
});  

```

--------------------------------

### Upstash Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates with Upstash vector store using the @mastra/upstash library. Upstash refers to stores as indexes. This example initializes an UpstashVector store and upserts vectors. Indexes are created automatically upon the first upsert if they don't exist.

```typescript
import { UpstashVector } from "@mastra/upstash";

// In upstash they refer to the store as an index
const store = new UpstashVector({
  id: 'upstash-vector',
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
});

// There is no store.createIndex call here, Upstash creates indexes (known as namespaces in Upstash) automatically
// when you upsert if that namespace does not exist yet.
await store.upsert({
  indexName: "myCollection", // the namespace name in Upstash
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Deploy to Vercel (Shell)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

These commands navigate to the build output directory and deploy the Mastra application to Vercel using the `vercel --prod` command. Ensure you are logged in to the Vercel CLI.

```shell
cd .mastra/output
vercel --prod
```

--------------------------------

### Displaying Tool Agent Data in React UI

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

This example shows how to use the `useChat` hook from `@ai-sdk/react` to display nested agent streams emitted from within a tool. It maps through messages and their parts, rendering an `AgentTool` component when a 'data-tool-agent' part is encountered. The `AgentTool` component is responsible for displaying the agent's ID, status, and text content.

```typescript
"use client";  
  
import { useChat } from "@ai-sdk/react";  
import { AgentTool } from '../ui/agent-tool';  
import { DefaultChatTransport } from 'ai';  
import type { AgentDataPart } from "@mastra/ai-sdk";  
  
export default function Page() {  
  const { messages } = useChat({  
    transport: new DefaultChatTransport({  
    api: 'http://localhost:4111/chat',  
    }),  
  });  
  
  return (  
    <div>  
      {messages.map((message) => (  
        <div key={message.id}>  
          {message.parts.map((part, i) => {  
            switch (part.type) {  
              case 'data-tool-agent':  
                return (  
                  <AgentTool {...part.data as AgentDataPart} key={`${message.id}-${i}`} />  
                );  
              default:  
                return null;  
            }  
          })}  
        </div>  
      ))}  
    </div>  
  );  
}  

```

```typescript
import { Tool, ToolContent, ToolHeader, ToolOutput } from "../ai-elements/tool";  
import type { AgentDataPart } from "@mastra/ai-sdk";  
  
export const AgentTool = ({ id, text, status }: AgentDataPart) => {  
  return (  
    <Tool>  
      <ToolHeader  
        type={`${id}`}  
        state={status === 'finished' ? 'output-available' : 'input-available'}  
      />  
      <ToolContent>  
        <ToolOutput output={text} />  
      </ToolContent>  
    </Tool>  
  );  
};  

```

--------------------------------

### Configure Mastra Server Port

Source: https://mastra.ai/docs/v1/getting-started/studio

This snippet demonstrates how to change the default host and port for the Mastra development server. It requires the `@mastra/core` library and configures the server object within the Mastra constructor.

```typescript
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  server: {
    port: 8080,
    host: "0.0.0.0",
  },
});
```

--------------------------------

### Agent Interaction with Resource-Scoped Memory (JavaScript)

Source: https://mastra.ai/docs/v1/memory/working-memory

This example shows how to interact with an agent using resource-scoped working memory. It highlights the necessity of passing the `resourceId` parameter when making a generation request. The `resourceId` ensures that the memory is correctly associated with a specific user across different conversation threads.

```javascript
// Resource-scoped memory requires resourceId
const response = await agent.generate("Hello!", {
  threadId: "conversation-123",
  resourceId: "user-alice-456", // Same user across different threads
});
```

--------------------------------

### Snapshot Data Structure Example

Source: https://mastra.ai/docs/v1/workflows/snapshots

This JSON object represents the structure of a Mastra snapshot, detailing the workflow's run ID, status, input, step details, execution paths, and final result. It includes information about suspended steps, retry attempts, and contextual data crucial for resuming execution.

```json
{
  "runId": "34904c14-e79e-4a12-9804-9655d4616c50",
  "status": "success",
  "value": {},
  "context": {
    "input": {
      "value": 100,
      "user": "Michael",
      "requiredApprovers": ["manager", "finance"]
    },
    "approval-step": {
      "payload": {
        "value": 100,
        "user": "Michael",
        "requiredApprovers": ["manager", "finance"]
      },
      "startedAt": 1758027577955,
      "status": "success",
      "suspendPayload": {
        "message": "Workflow suspended",
        "requestedBy": "Michael",
        "approvers": ["manager", "finance"]
      },
      "suspendedAt": 1758027578065,
      "resumePayload": { "confirm": true, "approver": "manager" },
      "resumedAt": 1758027578517,
      "output": { "value": 100, "approved": true },
      "endedAt": 1758027578634
    }
  },
  "activePaths": [],
  "serializedStepGraph": [
    {
      "type": "step",
      "step": {
        "id": "approval-step",
        "description": "Accepts a value, waits for confirmation"
      }
    }
  ],
  "suspendedPaths": {},
  "waitingPaths": {},
  "result": { "value": 100, "approved": true },
  "requestContext": {},
  "timestamp": 1758027578740
}
```

--------------------------------

### Scaffold Mastra AI Project with CLI (Next.js)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

Initializes Mastra AI in a Next.js project using the command-line interface. This command can quickly set up default agents and tools, or be run interactively for custom configurations. It supports various LLM providers like OpenAI.

```bash
npx mastra@beta init --dir . --components agents,tools --example --llm openai  
```

```bash
npx mastra@beta init  
```

--------------------------------

### Configure Mastra AI with SigNoz OTEL Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Configures the Mastra AI project to send traces to SigNoz using the OpenTelemetry exporter. Requires a SigNoz API key and region. Supports self-hosted endpoints.

```typescript
new OtelExporter({
  provider: {
    signoz: {
      apiKey: process.env.SIGNOZ_API_KEY,
      region: "us", // 'us' | 'eu' | 'in'
      // endpoint: 'https://my-signoz.example.com', // For self-hosted
    },
  },
});
```

--------------------------------

### Identify and Resume Suspended Workflow Run (JavaScript)

Source: https://mastra.ai/docs/v1/workflows/suspend-and-resume

This JavaScript code demonstrates how to identify if a workflow run has been suspended and then resume it. It starts a workflow, checks the `result.status` for 'suspended', logs the ID of the suspended step from `result.suspended[0]`, and then calls `run.resume()` to continue execution.

```javascript
const workflow = mastra.getWorkflow("testWorkflow");
const run = await workflow.createRunAsync();

const result = await run.start({
  inputData: {
    userEmail: "alex@example.com"
  }
});

if (result.status === "suspended") {
  console.log(result.suspended[0]);
  await run.resume({
    step: result.suspended[0],
    resumeData: { approved: true }
  });
}
```

--------------------------------

### Create Astro Actions Directory

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Creates a new directory named 'actions' inside the 'src' folder using the mkdir command. This directory will house your Astro Action definitions.

```bash
mkdir src/actions  
```

--------------------------------

### Build and Deploy Mastra to Cloudflare

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/cloudflare-deployer

Builds the Mastra application and deploys it to Cloudflare using the Wrangler CLI. This command assumes a specific build script and configuration file path.

```bash
npm run build && wrangler deploy --config .mastra/output/wrangler.json  

```

--------------------------------

### Create Weather Information Tool (TypeScript)

Source: https://mastra.ai/docs/v1/tools-mcp/overview

Defines a tool to fetch weather information for a given city. It uses Zod for input and output schema validation and includes placeholder logic for API calls. This tool requires the `@mastra/core/tools` and `zod` packages.

```typescript
import { createTool } from "@mastra/core/tools";  
import { z } from "zod";  
  
const getWeatherInfo = async (city: string) => {  
  // Replace with an actual API call to a weather service  
  console.log(`Fetching weather for ${city}...`);  
  // Example data structure  
  return { temperature: 20, conditions: "Sunny" };  
};
  
export const weatherTool = createTool({
  id: "Get Weather Information",
  description: `Fetches the current weather information for a given city`,
  inputSchema: z.object({
    city: z.string().describe("City name"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
  }),
  execute: async (inputData) => {
    console.log("Using tool to fetch weather information for", inputData.city);
    return await getWeatherInfo(inputData.city);
  },
});  

```

--------------------------------

### Resume Suspended Workflow Execution (JavaScript)

Source: https://mastra.ai/docs/v1/workflows/suspend-and-resume

This JavaScript code demonstrates how to resume a suspended workflow execution. It retrieves a workflow instance, starts a new run, and then uses the `resume()` method on the run object to restart from a specific step ('step-1') by providing appropriate `resumeData` to satisfy the suspend condition.

```javascript
const workflow = mastra.getWorkflow("testWorkflow");
const run = await workflow.createRunAsync();

await run.start({
  inputData: {
    userEmail: "alex@example.com"
  }
});

const handleResume = async () => {
  const result = await run.resume({
    step: 'step-1',
    resumeData: { approved: true }
  });
};
```

--------------------------------

### Configure HNSW Index for PostgreSQL Vector Store (JavaScript)

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Configures the PostgreSQL vector store within Mastra AI to use an HNSW index for semantic recall. This JavaScript example demonstrates setting the index type to 'hnsw', the metric to 'dotproduct' (optimal for OpenAI embeddings), and specifies parameters like 'm' and 'efConstruction'.

```javascript
import { Memory } from "@mastra/memory";
import { PgStore, PgVector } from "@mastra/pg";

const agent = new Agent({
  memory: new Memory({
    storage: new PgStore({
      id: 'agent-storage',
      connectionString: process.env.DATABASE_URL,
    }),
    vector: new PgVector({
      id: 'agent-vector',
      connectionString: process.env.DATABASE_URL,
    }),
    options: {
      semanticRecall: {
        topK: 5,
        messageRange: 2,
        indexConfig: {
          type: "hnsw", // Use HNSW for better performance
          metric: "dotproduct", // Best for OpenAI embeddings
          m: 16, // Number of bi-directional links (default: 16)
          efConstruction: 64, // Size of candidate list during construction (default: 64)
        },
      },
    },
  }),
});
```

--------------------------------

### Dynamic Configuration Selection using configSelector

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Uses `configSelector` to dynamically choose tracing configurations based on request context, enabling flexible routing for different scenarios like support requests or specific customer tiers.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    default: { enabled: true }, // Provides 'default' instance
    configs: {
      langfuse: {
        serviceName: "langfuse-service",
        exporters: [langfuseExporter],
      },
      braintrust: {
        serviceName: "braintrust-service",
        exporters: [braintrustExporter],
      },
      debug: {
        serviceName: "debug-service",
        sampling: { type: "always" },
        exporters: [new DefaultExporter()],
      },
    },
    configSelector: (context, availableTracers) => {
      // Use debug config for support requests
      if (context.requestContext?.get("supportMode")) {
        return "debug";
      }

      // Route specific customers to different providers
      const customerId = context.requestContext?.get("customerId");
      if (customerId && premiumCustomers.includes(customerId)) {
        return "braintrust";
      }

      // Route specific requests to langfuse
      if (context.requestContext?.get("useExternalTracing")) {
        return "langfuse";
      }

      return "default";
    },
  }),
});
```

--------------------------------

### Analyze Partial Gluten Recipe (TypeScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

This example shows how to use the glutenCheckerScorer for a recipe that contains some gluten. The input describes mixing flour and water. The output logs the score, identifies 'flour' as a gluten source, and provides a reason explaining why the recipe is not gluten-free due to wheat content. This requires the glutenCheckerScorer.

```typescript
const result = await glutenCheckerScorer.run({
  input: [{ role: "user", content: "Mix flour and water to make dough" }],
  output: { text: "Mix flour and water to make dough" },
});

console.log("Score:", result.score);
console.log("Gluten sources:", result.analyzeStepResult.glutenSources);
console.log("Reason:", result.reason);
```

--------------------------------

### Create Test Page Svelte Component

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Creates a `+page.svelte` file for the test route. This component includes a form to input a city and displays the weather information returned by the SvelteKit Action.

```bash
touch src/routes/test/+page.svelte  
```

```svelte
<script lang="ts">
	import type { PageProps} from './$types';
	let { form }: PageProps = $props();
</script>

<h1>Test</h1>

<form method="POST">
	<input name="city" placeholder="Enter city" required />
	<button type="submit">Get Weather</button>
</form>

{#if form?.result}
	<pre>{form.result}</pre>
{/if}


```

--------------------------------

### Resuming Workflow with Delayed Execution (JavaScript)

Source: https://mastra.ai/docs/v1/workflows/suspend-and-resume

This JavaScript snippet shows how to resume a suspended workflow, similar to the previous example, but with a focus on scheduling the resumption. It defines a `handleResume` function and then uses `setTimeout` to trigger this function at a specific future time (midnight UTC), illustrating a time-based resumption trigger.

```javascript
const handleResume = async () => {
  const result = await run.resume({
    step: 'step-1',
    resumeData: { approved: true }
  });
};

const midnight = new Date();
midnight.setUTCHours(24, 0, 0, 0);
setTimeout(handleResume, midnight.getTime() - Date.now());
```

--------------------------------

### Create MDocument from Various Formats

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

Initializes an MDocument instance from different content formats including plain text, HTML, Markdown, and JSON. This is the first step before document processing.

```javascript
const docFromText = MDocument.fromText("Your plain text content...");  
const docFromHTML = MDocument.fromHTML("<html>Your HTML content...</html>");  
const docFromMarkdown = MDocument.fromMarkdown("# Your Markdown content...");  
const docFromJSON = MDocument.fromJSON(`{ "key": "value" }`);  
```

--------------------------------

### Complete Cloud Exporter Configuration Options

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/cloud

Provides detailed configuration options for the CloudExporter, including setting the access token, endpoint for self-hosted instances, batching parameters, and log levels for diagnostic logging.

```javascript
new CloudExporter({
  // Optional - defaults to env var
  accessToken: process.env.MASTRA_CLOUD_ACCESS_TOKEN,

  // Optional - for self-hosted Mastra Cloud
  endpoint: "https://cloud.your-domain.com",

  // Batching configuration
  maxBatchSize: 1000, // Max spans per batch
  maxBatchWaitMs: 5000, // Max wait before sending batch

  // Diagnostic logging
  logLevel: "info", // debug | info | warn | error
});
```

--------------------------------

### Register Mastra Docs Server with OpenAI Codex CLI

Source: https://mastra.ai/docs/v1/getting-started/mcp-docs-server

This command registers the Mastra Docs Server with the OpenAI Codex CLI. It uses 'codex mcp add' to add a server named 'mastra-docs' and specifies the command to run the Mastra MCP Docs Server package.

```bash
codex mcp add mastra-docs -- npx -y @mastra/mcp-docs-server
```

--------------------------------

### Create Workflow with Steps

Source: https://mastra.ai/docs/v1/workflows/overview

Demonstrates how to create a parent workflow that utilizes other workflows as steps. It defines input and output schemas and chains steps together using '.then()'. This allows for modular and reusable workflow logic.

```typescript
const step1 = createStep({...});
const step2 = createStep({...});

const childWorkflow = createWorkflow({
  id: "child-workflow",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    emphasized: z.string()
  })
})
  .then(step1)
  .then(step2)
  .commit();

export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    emphasized: z.string()
  })
})
  .then(childWorkflow)
  .commit();
```

--------------------------------

### Mastra Initialization with Custom Auth0 Configuration

Source: https://mastra.ai/docs/v1/auth/auth0

Initializes the Mastra server with a custom MastraAuthAuth0 configuration, specifying the Auth0 domain and audience from environment variables.

```typescript
import { Mastra } from "@mastra/core";
import { MastraAuthAuth0 } from "@mastra/auth-auth0";

export const mastra = new Mastra({
  // ..
  server: {
    auth: new MastraAuthAuth0({
      domain: process.env.AUTH0_DOMAIN,
      audience: process.env.AUTH0_AUDIENCE,
    }),
  },
});
```

--------------------------------

### Fetch Static Tools with MCPClient.listTools() in TypeScript

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Retrieves tools from all configured MCP servers for static configurations. Suitable for single-user CLIs where API keys are consistent. It's recommended to call this once and pass the result to the agent's `tools` property.

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

import { testMcpClient } from "../mcp/test-mcp-client";

export const testAgent = new Agent({
  // ...
  tools: await testMcpClient.listTools(),
});
```

--------------------------------

### Create Mastra Client Instance (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Initializes the Mastra client in your frontend application using the `@mastra/client-js` SDK. This client is used to interact with your Mastra agents.

```typescript
import { MastraClient } from "@mastra/client-js";  
  
export const mastraClient = new MastraClient({
  baseUrl: import.meta.env.VITE_MASTRA_API_URL || "http://localhost:4111",
});  

```

--------------------------------

### Monitor Agent Progress with onStepFinish Callback

Source: https://mastra.ai/docs/v1/agents/overview

Demonstrates using the `onStepFinish` callback to monitor the progress of multi-step agent operations. This callback provides details about each step, useful for debugging or user feedback.

```typescript
const response = await testAgent.generate("Help me organize my day", {  
  onStepFinish: ({ text, toolCalls, toolResults, finishReason, usage }) => {  
    console.log({ text, toolCalls, toolResults, finishReason, usage });  
  },  
});
```

--------------------------------

### Stream Response with onFinish Callback using Javascript

Source: https://mastra.ai/docs/v1/agents/overview

Demonstrates streaming responses from an agent while utilizing the `onFinish()` callback. This callback is executed after the LLM completes generation and all tool executions, providing final text, steps, finish reason, and usage statistics.

```javascript
const stream = await testAgent.stream("Help me organize my day", {
  onFinish: ({ steps, text, finishReason, usage }) => {
    console.log({ steps, text, finishReason, usage });
  },
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

```

--------------------------------

### Initialize MastraClient (JavaScript)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Initializes a MastraClient instance in a client application to connect to the deployed Mastra server. Requires the '@mastra/client-js' package.

```javascript
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: "https://<your-domain-name>",
});
```

--------------------------------

### Configure DefaultExporter with Different Strategies (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/default

Demonstrates how to configure the DefaultExporter for various scenarios. It includes zero-configuration, development override with 'realtime' strategy, high-throughput production with larger batch and buffer sizes, and low-latency production with smaller batch sizes and quicker flushes. No external dependencies are required for basic usage.

```javascript
// Zero config - recommended for most users
new DefaultExporter();

// Development override
new DefaultExporter({
  strategy: "realtime", // Immediate visibility for debugging
});

// High-throughput production
new DefaultExporter({
  maxBatchSize: 2000, // Larger batches
  maxBatchWaitMs: 10000, // Wait longer to fill batches
  maxBufferSize: 50000, // Handle longer outages
});

// Low-latency production
new DefaultExporter({
  maxBatchSize: 100, // Smaller batches
  maxBatchWaitMs: 1000, // Flush quickly
});
```

--------------------------------

### Build Mastra Application (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Builds the Mastra application for production using npm. Requires the application's build scripts to be defined in package.json.

```bash
npm run build
```

--------------------------------

### PostgreSQL Storage Integration for Mastra Snapshots

Source: https://mastra.ai/docs/v1/workflows/snapshots

Illustrates setting up Mastra with a PostgreSQL database for snapshot persistence. Requires a database connection string.

```typescript
import { Mastra } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";

export const mastra = new Mastra({
  // ...
  storage: new PostgresStore({
    id: 'mastra-storage',
    connectionString: "<database-url>",
  }),
});
```

--------------------------------

### Configure Mastra AI with New Relic OTEL Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Configures the Mastra AI project to send traces to New Relic using the OpenTelemetry exporter. Requires a New Relic license key. Supports configuration for EU region endpoints.

```typescript
new OtelExporter({
  provider: {
    newrelic: {
      apiKey: process.env.NEW_RELIC_LICENSE_KEY,
      // endpoint: 'https://otlp.eu01.nr-data.net', // For EU region
    },
  },
});
```

--------------------------------

### Integrate Vercel AI SDK Tools in Mastra Agent

Source: https://mastra.ai/docs/v1/tools-mcp/advanced-usage

Shows how to add a tool defined using the Vercel AI SDK format (like `vercelWeatherTool`) to a Mastra agent, alongside tools created with Mastra's `createTool` (like `mastraTool`). This highlights Mastra's ability to seamlessly mix tool formats within a single agent configuration.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { vercelWeatherTool } from "../tools/vercelWeatherTool"; // Vercel AI SDK tool
import { mastraTool } from "../tools/mastraTool"; // Mastra createTool tool

export const mixedToolsAgent = new Agent({
  id: "mixed-tools-agent",
  name: "Mixed Tools Agent",
  instructions: "You can use tools defined in different formats.",
  model: openai("gpt-4o-mini"),
  tools: {
    weatherVercel: vercelWeatherTool,
    someMastraTool: mastraTool,
  },
});
```

--------------------------------

### Implement Speech-to-Speech Agent with Realtime Voice (JavaScript)

Source: https://mastra.ai/docs/v1/agents/adding-voice

Configures an agent for real-time speech-to-speech interactions using `OpenAIRealtimeVoice`. It initializes the voice provider, sets up the agent with tools, connects to the voice service, and streams microphone input.

```javascript
import { Agent } from "@mastra/core/agent";
import { getMicrophoneStream } from "@mastra/node-audio";
import { OpenAIRealtimeVoice } from "@mastra/voice-openai-realtime";
import { search, calculate } from "../tools";

// Initialize the realtime voice provider
const voice = new OpenAIRealtimeVoice({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini-realtime",
  speaker: "alloy",
});

// Create an agent with speech-to-speech voice capabilities
export const agent = new Agent({
  id: "speech-to-speech-agent",
  name: "Speech-to-Speech Agent",
  instructions: `You are a helpful assistant with speech-to-speech capabilities.`,
  model: openai("gpt-4o"),
  tools: {
    // Tools configured on Agent are passed to voice provider
    search,
    calculate,
  },
  voice,
});

// Establish a WebSocket connection
await agent.voice.connect();

// Start a conversation
agent.voice.speak("Hello, I'm your AI assistant!");

// Stream audio from a microphone
const microphoneStream = getMicrophoneStream();
agent.voice.send(microphoneStream);

// When done with the conversation
agent.voice.close();

```

--------------------------------

### Configure Build Commands for Mastra on Digital Ocean App Platform

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/digital-ocean

These commands are used to configure the build process for a Mastra application within Digital Ocean's App Platform. They specify how to build the project based on the package manager used (npm, pnpm, yarn, bun).

```shell
npm run build
```

```shell
pnpm build
```

```shell
yarn build
```

```shell
bun run build
```

--------------------------------

### Configure Arize AX for Arize Exporter (Node.js)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Sets up the Arize Exporter for Arize AX, an enterprise observability platform. It requires environment variables for the space ID, API key, and project name (optional). The exporter is initialized with these credentials.

```typescript
import { Mastra } from "@mastra/core";  
import { Observability } from "@mastra/observability";  
import { ArizeExporter } from "@mastra/arize";  
  
export const mastra = new Mastra({  
  observability: new Observability({  
    configs: {  
      arize: {  
        serviceName: process.env.ARIZE_PROJECT_NAME || "mastra-service",  
        exporters: [  
          new ArizeExporter({  
            apiKey: process.env.ARIZE_API_KEY!,  
            spaceId: process.env.ARIZE_SPACE_ID!,  
            projectName: process.env.ARIZE_PROJECT_NAME,  
          }),  
        ],  
      },  
    },  
  }),  
});  
```

--------------------------------

### Add Mastra Dev and Build Scripts to package.json

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Adds essential development and build scripts for Mastra to your project's `package.json` file. These scripts are used to run the Mastra dev server and build Mastra components.

```json
{
  "scripts": {
    ...
    "dev:mastra": "mastra dev --dir mastra",
    "build:mastra": "mastra build --dir mastra"
  }
}
```

```json
{
  "scripts": {
    ...
    "dev:mastra": "mastra dev --dir src/mastra",
    "build:mastra": "mastra build --dir src/mastra"
  }
}
```

--------------------------------

### Configure OpenAI Realtime Voice

Source: https://mastra.ai/docs/v1/voice/speech-to-speech

Instantiate the OpenAIRealtimeVoice class for real-time voice interactions. Configuration options include apiKey, model, and speaker. The API key can be provided directly or via the OPENAI_API_KEY environment variable. Defaults are used if no explicit configuration is provided.

```javascript
const voice = new OpenAIRealtimeVoice({
  apiKey: "your-openai-api-key",
  model: "gpt-4o-mini-realtime",
  speaker: "alloy", // Default voice
});

// If using default settings the configuration can be simplified to:
const voice = new OpenAIRealtimeVoice();
```

--------------------------------

### Generate Structured Output with Zod and JSON Prompt Injection

Source: https://mastra.ai/docs/v1/agents/overview

Demonstrates how to generate structured output using Zod schemas and the jsonPromptInjection option for agents that do not natively support response formats. It defines a schema for summary and keywords and logs the parsed output.

```typescript
import { z } from "zod";  
  
const response = await testAgentThatDoesntSupportStructuredOutput.generate(  
  [  
    {  
      role: "system",  
      content: "Provide a summary and keywords for the following text:",  
    },  
    {  
      role: "user",  
      content: "Monkey, Ice Cream, Boat",  
    },  
  ],  
  {  
    structuredOutput: {  
      schema: z.object({  
        summary: z.string(),  
        keywords: z.array(z.string()),  
      }),  
      jsonPromptInjection: true,  
    },  
  },  
);  
  
console.log(response.object);
```

--------------------------------

### Navigate Repository Directory (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Changes the current directory to the cloned Mastra application repository. Assumes the repository directory name is known.

```bash
cd "<your-repository>"
```

--------------------------------

### Configure Mastra AI with Dash0 OTEL Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Configures the Mastra AI project to send traces to Dash0 using the OpenTelemetry exporter. Requires an API key and endpoint from Dash0. The service name and optional resource attributes can be set.

```typescript
import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { OtelExporter } from "@mastra/otel-exporter";

export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      otel: {
        serviceName: "my-service",
        exporters: [
          new OtelExporter({
            provider: {
              dash0: {
                apiKey: process.env.DASH0_API_KEY,
                endpoint: process.env.DASH0_ENDPOINT, // e.g., 'ingress.us-west-2.aws.dash0.com:4317'
                dataset: "production", // Optional dataset name
              },
            },
            resourceAttributes: {
              // Optional OpenTelemetry Resource Attributes for the trace
              ["deployment.environment"]: "dev",
            },
          }),
        ],
      },
    },
  }),
});
```

--------------------------------

### Connect to Ampersand MCP Server (stdio) locally using MCPClient

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Run the Ampersand MCP Server locally and connect MCPClient using the stdio transport. This involves specifying the command-line arguments for the server, including project, integration name, and optional group reference, along with environment variables for authentication.

```typescript
// If you prefer to run the MCP server locally:
import { MCPClient } from "@mastra/mcp";

// MCPClient with Ampersand MCP Server using stdio transport
export const mcp = new MCPClient({
  servers: {
    "@amp-labs/mcp-server": {
      command: "npx",
      args: [
        "-y",
        "@amp-labs/mcp-server@latest",
        "--transport",
        "stdio",
        "--project",
        process.env.AMPERSAND_PROJECT_ID,
        "--integrationName",
        process.env.AMPERSAND_INTEGRATION_NAME,
        "--groupRef",
        process.env.AMPERSAND_GROUP_REF, // optional
      ],
      env: {
        AMPERSAND_API_KEY: process.env.AMPERSAND_API_KEY,
      },
    },
  },
});
```

--------------------------------

### Create Weather API Endpoint File

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Creates a new SvelteKit server endpoint file '+server.ts' within the 'src/routes/weather-api' directory. This endpoint will receive city names and return weather information by calling the Mastra weather agent.

```bash
touch src/routes/weather-api/+server.ts

```

--------------------------------

### Connect to mcp.run Managed MCP Servers using MCPClient

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Connect MCPClient to mcp.run managed MCP servers using a secure SSE URL obtained from your mcp.run profile. Treat this URL as a password and store it securely, preferably in environment variables.

```typescript
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    marketing: { // Example profile name
      url: new URL(process.env.MCP_RUN_SSE_URL!), // Get URL from mcp.run profile
    },
  },
});
```

--------------------------------

### Configure Auth0Provider with History for React App

Source: https://mastra.ai/docs/v1/auth/auth0

Sets up the Auth0Provider component in a React application, configuring necessary parameters like domain, client ID, and redirect URI.

```typescript
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "read:current_user update:current_user_metadata"
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
```

--------------------------------

### Configure Sarvam Voice

Source: https://mastra.ai/docs/v1/voice/overview

Sets up the Sarvam voice provider, requiring a Sarvam API key. Configuration includes model name, language code, and style settings. Sarvam may not offer a separate listening model.

```javascript
const voice = new SarvamVoice({
  speechModel: {
    name: "sarvam-voice", // Example model name
    apiKey: process.env.SARVAM_API_KEY,
    language: "en-IN", // Language code
    style: "conversational", // Style setting
  },
  
```

--------------------------------

### NetlifyDeployer Generated Config.json

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/netlify-deployer

Shows the content of the `config.json` file automatically generated by NetlifyDeployer within the `.netlify/v1` directory. This file configures redirects for the Mastra application on Netlify.

```json
{
  "redirects": [
    {
      "force": true,
      "from": "/*",
      "to": "/.netlify/functions/api/:splat",
      "status": 200
    }
  ]
}
```

--------------------------------

### Initialize MastraClient in TypeScript

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Initializes the MastraClient with a base URL, defaulting to http://localhost:4111 if MASTRA_API_URL environment variable is not set. This client provides a type-safe interface for Mastra Server interactions.

```typescript
import { MastraClient } from "@mastra/client-js";  
  
export const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
});
```

--------------------------------

### End-to-end Voice Interaction with Hybrid and Unified Agents

Source: https://mastra.ai/docs/v1/agents/adding-voice

This TypeScript code sets up a scenario where a hybrid voice agent asks a question, saves it as audio, and a unified voice agent listens, processes, and responds. It utilizes multiple providers for voice capabilities and saves audio outputs to files. Dependencies include @mastra/core, @mastra/voice-openai, and @ai-sdk/openai.

```typescript
import "dotenv/config";
  
import path from "path";
import { createReadStream } from "fs";
import { Agent } from "@mastra/core/agent";
import { CompositeVoice } from "@mastra/core/voice";
import { OpenAIVoice } from "@mastra/voice-openai";
import { Mastra } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import * as fs from "fs";
import { createWriteStream } from "fs";

// Saves an audio stream to a file in the audio directory, creating the directory if it doesn't exist.
export const saveAudioToFile = async (
  audio: NodeJS.ReadableStream,
  filename: string,
): Promise<void> => {
  const audioDir = path.join(process.cwd(), "audio");
  const filePath = path.join(audioDir, filename);

  await fs.promises.mkdir(audioDir, { recursive: true });

  const writer = createWriteStream(filePath);
  audio.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

// Saves an audio stream to a file in the audio directory, creating the directory if it doesn't exist.
export const convertToText = async (
  input: string | NodeJS.ReadableStream,
): Promise<string> => {
  if (typeof input === "string") {
    return input;
  }

  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    input.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    input.on("error", reject);
    input.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

export const hybridVoiceAgent = new Agent({
  id: "hybrid-voice-agent",
  name: "Hybrid Voice Agent",
  model: openai("gpt-4o"),
  instructions: "You can speak and listen using different providers.",
  voice: new CompositeVoice({
    input: new OpenAIVoice(),
    output: new OpenAIVoice(),
  }),
});

export const unifiedVoiceAgent = new Agent({
  id: "unified-voice-agent",
  name: "Unified Voice Agent",
  instructions: "You are an agent with both STT and TTS capabilities.",
  model: openai("gpt-4o"),
  voice: new OpenAIVoice(),
});

export const mastra = new Mastra({
  // ...
  agents: { hybridVoiceAgent, unifiedVoiceAgent },
});

const hybridVoiceAgentInstance = mastra.getAgent("hybridVoiceAgent");
const unifiedVoiceAgentInstance = mastra.getAgent("unifiedVoiceAgent");

const question = "What is the meaning of life in one sentence?";

const hybridSpoken = await hybridVoiceAgentInstance.voice.speak(question);

await saveAudioToFile(hybridSpoken!, "hybrid-question.mp3");

const audioStream = createReadStream(
  path.join(process.cwd(), "audio", "hybrid-question.mp3"),
);
const unifiedHeard = await unifiedVoiceAgentInstance.voice.listen(audioStream);

const inputText = await convertToText(unifiedHeard!);

const unifiedResponse = await unifiedVoiceAgentInstance.generate(inputText);
const unifiedSpoken = await unifiedVoiceAgentInstance.voice.speak(unifiedResponse.text);

await saveAudioToFile(unifiedSpoken!, "unified-response.mp3");

```

--------------------------------

### Vercel Build Output Configuration

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/vercel-deployer

Illustrates the structure of the Vercel build output for Mastra applications, specifically the `.vercel/output/config.json` file. This file contains routing information for Vercel functions.

```json
{
  "version": 3,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

--------------------------------

### TypeScript Configuration (tsconfig.json)

Source: https://mastra.ai/docs/v1/getting-started/installation

Provides the necessary TypeScript compiler options for a Mastra project, including module resolution and strict type checking. Requires modern module settings.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

--------------------------------

### Qdrant Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates the Qdrant vector database using the @mastra/qdrant library. It initializes a QdrantVector store, creates an index, and upserts vectors. Requires QDRANT_URL and QDRANT_API_KEY environment variables.

```typescript
import { QdrantVector } from "@mastra/qdrant";

const store = new QdrantVector({
  id: 'qdrant-vector',
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});

await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Using the Speak Method

Source: https://mastra.ai/docs/v1/voice/text-to-speech

Demonstrates how to use the `speak()` method to convert text into an audio stream, with options for specifying the speaker and other provider-specific properties.

```APIDOC
## Using the Speak Method

The primary method for TTS is the `speak()` method, which converts text to speech. This method can accept options that allows you to specify the speaker and other provider-specific options. Here's how to use it:

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { OpenAIVoice } from "@mastra/voice-openai";

const voice = new OpenAIVoice();

const agent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice,
});

const { text } = await agent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const readableStream = await voice.speak(text, {
  speaker: "default", // Optional: specify a speaker
  properties: {
    speed: 1.0, // Optional: adjust speech speed
    pitch: "default", // Optional: specify pitch if supported
  },
});
```

Check out the Adding Voice to Agents documentation to learn how to use TTS in an agent.
```

--------------------------------

### Configure Langfuse API Keys and URL (.env)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langfuse

Sets up environment variables for Langfuse authentication and the base URL. These are required for the exporter to connect to your Langfuse instance.

```dotenv
LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxxxxxx  
LANGFUSE_SECRET_KEY=sk-lf-xxxxxxxxxxxx  
LANGFUSE_BASE_URL=https://cloud.langfuse.com  # Or your self-hosted URL  
```

--------------------------------

### Create Astro Page to Display Weather Form

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Creates a new Astro page file 'test.astro' in the 'src/pages' directory. This page imports and renders the 'Form' component, allowing users to interact with the weather agent.

```astro
---
import { Form } from '../components/form'
---

<h1>Test</h1>
<Form client:load />

```

--------------------------------

### Complete OpenTelemetry Exporter Configuration Options (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Demonstrates the comprehensive configuration options for the OpenTelemetry exporter in Mastra AI. Includes required provider configuration, export settings like timeout and batch size, and optional debug logging levels.

```typescript
new OtelExporter({
  // Provider configuration (required)
  provider: {
    // Use one of: dash0, signoz, newrelic, traceloop, laminar, custom
  },

  // Export configuration
  timeout: 30000, // Export timeout in milliseconds
  batchSize: 100, // Number of spans per batch

  // Debug options
  logLevel: "info", // 'debug' | 'info' | 'warn' | 'error'
});
```

--------------------------------

### Configure Mastra Local HTTPS

Source: https://mastra.ai/docs/v1/getting-started/studio

This snippet shows how to configure local HTTPS for the Mastra development server using custom certificate files. It utilizes the `node:fs` module to read key and certificate files and requires the `@mastra/core` library.

```typescript
import { Mastra } from "@mastra/core";
import fs from "node:fs";

export const mastra = new Mastra({
  server: {
    https: {
      key: fs.readFileSync("path/to/key.pem"),
      cert: fs.readFileSync("path/to/cert.pem"),
    },
  },
});
```

--------------------------------

### Mastra AI: Custom Observability with Default Exporters

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Shows how to configure Mastra AI with custom observability settings while maintaining access to Studio and Cloud by including default exporters. This is useful when adding external exporters like ArizeExporter.

```typescript
import { DefaultExporter, CloudExporter } from "@mastra/observability";
import { ArizeExporter } from "@mastra/arize";

export const mastra = new Mastra({
  observability: new Observability({
    default: { enabled: false }, // Disable default to use custom
    configs: {
      production: {
        serviceName: "my-service",
        exporters: [
          new ArizeExporter({
            // External exporter
            endpoint: process.env.PHOENIX_ENDPOINT,
            apiKey: process.env.PHOENIX_API_KEY,
          }),
          new DefaultExporter(), // Keep Studio access
          new CloudExporter(), // Keep Cloud access
        ],
      },
    },
  }),
});
```

--------------------------------

### Stream Agent Response with V2 Models (AI SDK v5) - 'aisdk' format

Source: https://mastra.ai/docs/v1/streaming/overview

Shows how to stream agent responses using the `.stream()` method with the `format: 'aisdk'` option, ensuring compatibility with AI SDK v5 and `AISDKV5OutputStream`. The output chunks are written to standard output.

```javascript
const testAgent = mastra.getAgent("testAgent");  
  
const stream = await testAgent.stream(  
  [{ role: "user", content: "Help me organize my day" }],  
  { format: "aisdk" },  
);  
  
for await (const chunk of stream.textStream) {  
  process.stdout.write(chunk);  
}
```

--------------------------------

### Configure MCPClient for Local and Remote Servers

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Demonstrates how to configure an MCPClient to connect to both local (via npx) and remote (via URL) MCP servers. It specifies the server 'id', 'command' or 'url', and relevant arguments.

```typescript
import { MCPClient } from "@mastra/mcp";  
  
export const testMcpClient = new MCPClient({  
  id: "test-mcp-client",  
  servers: {  
    wikipedia: {  
      command: "npx",  
      args: ["-y", "wikipedia-mcp"],  
    },
    weather: {  
      url: new URL(  
        `https://server.smithery.ai/@smithery-ai/national-weather-service/mcp?api_key=${process.env.SMITHERY_API_KEY}`,  
      ),  
    },
  },
});  

```

--------------------------------

### Suspend and Resume Tool Execution with Schemas in Mastra AI

Source: https://mastra.ai/docs/v1/agents/human-in-the-loop-with-tools

Implements tool suspension and resumption using `workflow.suspend` and `resumeStream`. Defines `suspendSchema` for data required to suspend and `resumeSchema` for data needed to resume. Requires the Mastra AI SDK and Zod for schema definition.

```typescript
const findUserTool = createTool({
  id: "Find user tool",
  description: "Returns the name and email for a matching user",
  inputSchema: z.object({
    name: z.string(),
  }),
  suspendSchema: z.object({
    message: z.string(),
  }),
  resumeSchema: z.object({
    name: z.string(),
  }),
  execute: async (inputData, { workflow }) => {
    if (!workflow.resumeData) {
      return workflow.suspend({ message: "Please provide the name of the user" });
    }

    return {
      name: workflow?.resumeData?.name,
      email: "test@test.com",
    };
  },
});

```

--------------------------------

### Add LibSQL Memory to Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-libsql

Configures a Mastra AI agent to use LibSQL for memory storage. It initializes a LibSQLStore with a file URL and enables automatic title generation for memories.

```typescript
import { Memory } from "@mastra/memory";  
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { LibSQLStore } from "@mastra/libsql";  
  
export const libsqlAgent = new Agent({  
  id: "libsql-agent",  
  name: "LibSQL Agent",  
  instructions:  
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",  
  model: openai("gpt-4o"),  
  memory: new Memory({  
    storage: new LibSQLStore({  
      id: 'libsql-agent-storage',  
      url: "file:libsql-agent.db",  
    }),  
    options: {  
      generateTitle: true, // Explicitly enable automatic title generation  
    },  
  }),  
});  


```

--------------------------------

### Initialize S3Vectors and Create Index

Source: https://mastra.ai/docs/v1/rag/vector-databases

Shows how to initialize an S3Vectors store with custom client configurations and create an index. Requires predefined embeddings and chunks.

```typescript
import { S3Vectors } from "@mastra/s3vectors";

const store = new S3Vectors({
  vectorBucketName: "my-vector-bucket",
  clientConfig: {
    region: "us-east-1",
  },
  nonFilterableMetadataKeys: ["content"],
});

await store.createIndex({
  indexName: "my-index",
  dimension: 1536,
});
await store.upsert({
  indexName: "my-index",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Register MCPServer in Mastra Instance

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Demonstrates how to register an configured MCPServer with the main Mastra instance using the 'mcpServers' option. This makes the server discoverable and accessible by other systems through the Mastra registry.

```typescript
import { Mastra } from "@mastra/core";  
  
import { testMcpServer } from "./mcp/test-mcp-server";  
  
export const mastra = new Mastra({  
  // ...  
  mcpServers: {  
    testMcpServer,  // Registry key: 'testMcpServer'  
  },
});  
  
// Both retrieval methods work:  
mastra.getMCPServer('testMcpServer');          // By registry key  
mastra.getMCPServerById('test-mcp-server');    // By intrinsic ID  

```

--------------------------------

### Add Vercel Deployer to Mastra Instance (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This TypeScript snippet shows how to configure a Mastra instance with the Vercel deployer. It requires the team slug, project name, and a Vercel API token for authentication and deployment.

```typescript
import { VercelDeployer } from "@mastra/deployer-vercel";

export const mastra = new Mastra({
  // ...other config
  deployer: new VercelDeployer({
    teamSlug: "your_team_slug",
    projectName: "your_project_name",
    // you can get your vercel token from the vercel dashboard by clicking on the user icon in the top right corner
    // and then clicking on "Account Settings" and then clicking on "Tokens" on the left sidebar.
    token: "your_vercel_token",
  }),
});
```

--------------------------------

### Call an Agent with Tools (TypeScript)

Source: https://mastra.ai/docs/v1/agents/using-tools

Demonstrates how to interact with a configured agent that has access to tools. This snippet shows retrieving an agent and then calling its 'generate' method with a user query, allowing the agent to utilize its tools.

```typescript
import { mastra } from "./mastra";

const agent = mastra.getAgent("weatherAgent");

const result = await agent.generate("What's the weather in London?");

```

--------------------------------

### Update Mastra Agent with OpenAI Configuration (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Updates the weather agent's TypeScript file to correctly import and configure the OpenAI SDK. It sets up the API key, ensuring it's available in both development and build environments.

```typescript
- import { openai } from "@ai-sdk/openai";
+ import { createOpenAI } from "@ai-sdk/openai";

+ const openai = createOpenAI({
+   apiKey: import.meta.env?.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_API_KEY,
+   compatibility: "strict"
+ });

```

--------------------------------

### Mastra Dev Server Script (package.json)

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Configures a script in 'package.json' to easily launch Mastra's local development environment. This is useful for debugging and improving agents during development. It uses the 'mastra dev' command.

```json
{
  "scripts": {
    "mastra:dev": "mastra dev"
  }
}

```

--------------------------------

### Bundler Configuration in Mastra Core (TypeScript)

Source: https://mastra.ai/docs/v1/deployment/monorepo

Demonstrates configuring bundler options within the Mastra core initialization in TypeScript. This includes specifying packages to transpile, external dependencies, and enabling sourcemaps for debugging.

```typescript
import { Mastra } from "@mastra/core";  
  
export const mastra = new Mastra({  
  // ...  
  bundler: {  
    transpilePackages: ["utils"],  
    externals: ["ui"],  
    sourcemap: true,  
  },  
});  

```

--------------------------------

### Compose Mastra Workflow with Steps

Source: https://mastra.ai/docs/v1/workflows/overview

Creates a complete Mastra workflow using `createWorkflow`. It defines the overall workflow input/output schemas and chains individual steps together using the `.then()` method. The workflow is finalized with `.commit()`.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const step1 = createStep({...});

export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  })
})
  .then(step1)
  .commit();
```

--------------------------------

### Expanded Mastra Observability Configuration (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Provides a detailed configuration for Mastra's observability, specifying service name, sampling strategy, span output processors (like sensitive data filtering), and multiple exporters (Cloud and Default). This is equivalent to the basic configuration but explicitly defined.

```typescript
import {
  Observability,
  CloudExporter,
  DefaultExporter,
  SensitiveDataFilter,
} from "@mastra/observability";

export const mastra = new Mastra({
  // ... other config
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        sampling: { type: "always" },
        spanOutputProcessors: [new SensitiveDataFilter()],
        exporters: [new CloudExporter(), new DefaultExporter()],
      },
    },
  }),
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db", // Storage is required for tracing
  }),
});
```

--------------------------------

### Vector Query Tool Database-Specific Configurations (JavaScript)

Source: https://mastra.ai/docs/v1/rag/retrieval

Demonstrates how to create Vector Query Tool instances with database-specific configurations for Pinecone, pgVector, Chroma, and LanceDB. Each configuration leverages unique features like namespaces, performance tuning parameters, filtering, and table specificity.

```javascript
// Pinecone with namespace  
const pineconeQueryTool = createVectorQueryTool({
  vectorStoreName: "pinecone",
  indexName: "docs",
  model: openai.embedding("text-embedding-3-small"),
  databaseConfig: {
    pinecone: {
      namespace: "production", // Isolate data by environment
    },
  },
});

// pgVector with performance tuning  
const pgVectorQueryTool = createVectorQueryTool({
  vectorStoreName: "postgres",
  indexName: "embeddings",
  model: openai.embedding("text-embedding-3-small"),
  databaseConfig: {
    pgvector: {
      minScore: 0.7, // Filter low-quality results
      ef: 200, // HNSW search parameter
      probes: 10, // IVFFlat probe parameter
    },
  },
});

// Chroma with advanced filtering  
const chromaQueryTool = createVectorQueryTool({
  vectorStoreName: "chroma",
  indexName: "documents",
  model: openai.embedding("text-embedding-3-small"),
  databaseConfig: {
    chroma: {
      where: { category: "technical" },
      whereDocument: { $contains: "API" },
    },
  },
});

// LanceDB with table specificity  
const lanceQueryTool = createVectorQueryTool({
  vectorStoreName: "lance",
  indexName: "documents",
  model: openai.embedding("text-embedding-3-small"),
  databaseConfig: {
    lance: {
      tableName: "myVectors", // Specify which table to query
      includeAllColumns: true, // Include all metadata columns in results
    },
  },
});
```

--------------------------------

### Create a Weather Tool (TypeScript)

Source: https://mastra.ai/docs/v1/agents/using-tools

Defines a tool for fetching weather data using an external API. It specifies input and output schemas using Zod and implements the tool's execution logic to query a weather service.

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "weather-tool",
  description: "Fetches weather for a location",
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
  execute: async (inputData) => {
    const { location } = inputData;

    const response = await fetch(`https://wttr.in/${location}?format=3`);
    const weather = await response.text();

    return { weather };
  },
});

```

--------------------------------

### Configure Mastra AI with Traceloop OTEL Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Configures the Mastra AI project to send traces to Traceloop using the OpenTelemetry exporter. Requires a Traceloop API key and an optional destination ID.

```typescript
new OtelExporter({
  provider: {
    traceloop: {
      apiKey: process.env.TRACELOOP_API_KEY,
      destinationId: "my-destination", // Optional
    },
  },
});
```

--------------------------------

### Set Up Network API Route with Mastra (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Configures a custom API route for network agent streams using Mastra's `networkRoute()` utility. This utility formats agent network streams into an AI SDK-compatible format, facilitating integration with frontend applications via the `useChat()` hook. Requires `@mastra/core` and `@mastra/ai-sdk`.

```typescript
import { Mastra } from "@mastra/core";
import { networkRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  server: {
    apiRoutes: [
      networkRoute({
        path: "/network",
        agent: "weatherAgent",
      }),
    ],
  },
});

```

--------------------------------

### Server-Side Mastra Initialization with Clerk Auth

Source: https://mastra.ai/docs/v1/auth/clerk

Initializes the Mastra server with Clerk authentication using MastraAuthClerk. It requires passing Clerk credentials from environment variables to the MastraAuthClerk constructor.

```typescript
import { Mastra } from "@mastra/core";
import { MastraAuthClerk } from "@mastra/auth-clerk";

export const mastra = new Mastra({
  // ..
  server: {
    auth: new MastraAuthClerk({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
      jwksUri: process.env.CLERK_JWKS_URI,
    }),
  },
});

```

--------------------------------

### Clone Private Repository (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Clones a private Mastra application repository from GitHub using a personal access token. Requires Git and a GitHub Personal Access Token.

```bash
git clone https://<your-username>:<your-personal-access-token>@github.com/<your-username>/<your-repository>.git
```

--------------------------------

### Setting Initial Working Memory via Thread Metadata

Source: https://mastra.ai/docs/v1/memory/working-memory

This section demonstrates how to set initial working memory when creating a new thread by providing a 'workingMemory' key within the thread's metadata.

```APIDOC
## Setting Initial Working Memory via Thread Metadata

When creating a thread, you can provide initial working memory through the metadata's `workingMemory` key:

```typescript
// Create a thread with initial working memory
const thread = await memory.createThread({
  threadId: "thread-123",
  resourceId: "user-456",
  title: "Medical Consultation",
  metadata: {
    workingMemory: `# Patient Profile
- Name: John Doe
- Blood Type: O+
- Allergies: Penicillin
- Current Medications: None
- Medical History: Hypertension (controlled)
`,
  },
});

// The agent will now have access to this information in all messages
await agent.generate("What's my blood type?", {
  threadId: thread.id,
  resourceId: "user-456",
});
// Response: "Your blood type is O+."
```
```

--------------------------------

### Configure Mastra AI with Laminar OTEL Exporter (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Configures the Mastra AI project to send traces to Laminar using the OpenTelemetry exporter. Requires a Laminar API key and an optional team ID.

```typescript
new OtelExporter({
  provider: {
    laminar: {
      apiKey: process.env.LMNR_PROJECT_API_KEY,
      // teamId: process.env.LAMINAR_TEAM_ID, // Optional, for backwards compatibility
    },
  },
});
```

--------------------------------

### Scaffold Mastra Agent (CLI)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Quickly scaffolds a default Weather agent with sensible defaults using the Mastra CLI. This command can be used with the one-liner integration approach.

```bash
npx mastra@beta init --dir . --components agents,tools --example --llm openai  
```

--------------------------------

### Configure OpenAI API Key for Mastra

Source: https://mastra.ai/docs/v1/agents/overview

Sets the OpenAI API key in the .env file for Mastra's model router to detect. This enables Mastra to authenticate with OpenAI services.

```env
OPENAI_API_KEY=<your-api-key>  

```

--------------------------------

### Create .env File (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Creates an empty .env file to store environment variables for the Mastra application. Requires shell access.

```bash
touch .env
```

--------------------------------

### Create Mastra Agent using Vercel AI SDK

Source: https://mastra.ai/docs/v1/agents/overview

Creates a Mastra agent using the Agent class, integrating with the Vercel AI SDK's OpenAI client. This allows the agent to leverage Vercel's SDK for LLM communication, including specific model instantiation.

```typescript
import { openai } from "@ai-sdk/openai";  
import { Agent } from "@mastra/core/agent";  
  
export const testAgent = new Agent({
  id: "test-agent",  
  name: "Test Agent",  
  instructions: "You are a helpful assistant.",  
  model: openai("gpt-4o-mini"),  
});  


```

--------------------------------

### Use Multiple Tools with an Agent (TypeScript)

Source: https://mastra.ai/docs/v1/agents/using-tools

Illustrates how an agent can be configured to use multiple tools simultaneously. This allows the agent to delegate different parts of a complex task to specialized tools, enhancing its problem-solving capabilities.

```typescript
import { weatherTool } from "../tools/weather-tool";
import { activitiesTool } from "../tools/activities-tool";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  // ..  
  tools: { weatherTool, activitiesTool },
});

```

--------------------------------

### Calling Agent Networks

Source: https://mastra.ai/docs/v1/agents/networks

Demonstrates how to call a Mastra agent network using the `.network()` method with a user message. It explains how to stream and process execution events.

```APIDOC
## API: Call Agent Network

### Description
Call a Mastra agent network using `.network()` with a user message. The method returns a stream of events that you can iterate over to track execution progress and retrieve the final result.

### Method
`network()`

### Endpoint
Not applicable (Method call on an agent object)

### Parameters
#### Input
- **userMessage** (string) - Required - The message or query to send to the agent network.

### Request Example
```javascript
const result = await routingAgent.network(
  "Tell me three cool ways to use Mastra",
);

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

### Response
#### Success Response (Stream of Events)
- **chunk.type** (string) - The type of event emitted during network execution (e.g., `routing-agent-start`, `network-execution-event-step-finish`).
- **chunk.payload.result** (any) - The result of a completed step, available when `chunk.type` is `network-execution-event-step-finish`.

#### Response Example (Event Types)
```
routing-agent-start
routing-agent-end
agent-execution-start
agent-execution-event-start
agent-execution-event-step-start
agent-execution-event-text-start
agent-execution-event-text-delta
agent-execution-event-text-end
agent-execution-event-step-finish
agent-execution-event-finish
agent-execution-end
network-execution-event-step-finish
```
```

--------------------------------

### Sequential Step Execution with .then() in TypeScript

Source: https://mastra.ai/docs/v1/workflows/control-flow

Demonstrates chaining multiple steps sequentially using the `.then()` method in TypeScript. Each step receives the output of the previous one as its input. Schema matching is crucial; if schemas don't align, input data mapping is required.

```typescript
const step1 = createStep({
  //...
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    formatted: z.string()
  })
});

const step2 = createStep({
  // ...
  inputSchema: z.object({
    formatted: z.string()
  }),
  outputSchema: z.object({
    emphasized: z.string()
  })
});

export const testWorkflow = createWorkflow({
  // ...
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    emphasized: z.string()
  })
})
  .then(step1)
  .then(step2)
  .commit();

```

--------------------------------

### Log from Tool using Mastra Logger (TypeScript)

Source: https://mastra.ai/docs/v1/logging

Illustrates how to obtain and use the logger instance within a tool's execute function. This allows for logging tool-specific activities during its execution.

```typescript
import { createTool } from "@mastra/core/tools";  
import { z } from "zod";  
  
export const testTool = createTool({"  
  // ...  
  execute: async ({ mastra }) => {  
    const logger = mastra?.getLogger();  
    logger?.info("tool info log");  
  
    return {  
      output: "",  
    };  
  },"  
});  

```

--------------------------------

### Stream Workflow Events with `.streamVNext()`

Source: https://mastra.ai/docs/v1/streaming/overview

Demonstrates the experimental `.streamVNext()` API for streaming workflow events. This method returns a `ReadableStream` of events that detail the run lifecycle, allowing real-time progress tracking.

```javascript
const run = await testWorkflow.createRun();  
  
const stream = await run.streamVNext({  
  inputData: {  
    value: "initial data",  
  },  
});  
  
for await (const chunk of stream) {  
  console.log(chunk);  
}
```

--------------------------------

### Set Up Deployment Environment Variables

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Configures essential environment variables for the deployment process, including project name, AWS region, and AWS account ID. These variables are used in subsequent commands for building and deploying the application.

```shell
export PROJECT_NAME="your-mastra-app"
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

```

--------------------------------

### Preprocess Step with Prompt Object (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Implements a `preprocess` step using a prompt object for LLM-based data extraction. It's configured to extract ingredients and cooking methods from recipe text, returning them in a structured JSON format defined by `outputSchema`. The `createPrompt` function provides the LLM with instructions and the recipe text.

```javascript
const glutenCheckerScorer = createScorer(...)
.preprocess({
  description: 'Extract ingredients from the recipe',
  outputSchema: z.object({
    ingredients: z.array(z.string()),
    cookingMethods: z.array(z.string())
  }),
  createPrompt: ({ run }) => `  
    Extract all ingredients and cooking methods from this recipe:  
    ${run.output.text}

    Return JSON with ingredients and cookingMethods arrays.  
  `
})

```

--------------------------------

### Initialize Firebase Client Application

Source: https://mastra.ai/docs/v1/auth/firebase

Initializes the Firebase application on the client side using provided configuration. Exports the Firebase auth instance and Google Auth provider.

```typescript
import { initializeApp } from "firebase/app";  
import { getAuth, GoogleAuthProvider } from "firebase/auth";  
  
const firebaseConfig = {  
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,  
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,  
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,  
};  
  
const app = initializeApp(firebaseConfig);  
export const auth = getAuth(app);  
export const googleProvider = new GoogleAuthProvider();  

```

--------------------------------

### Initialize LanceDB and Create Index

Source: https://mastra.ai/docs/v1/rag/vector-databases

Demonstrates initializing a LanceDB vector store and creating an index for storing embeddings. Assumes embeddings and chunks are pre-defined.

```typescript
const store = await LanceVectorStore.create("/path/to/db");

await store.createIndex({
  tableName: "myVectors",
  indexName: "myCollection",
  dimension: 1536,
});

await store.upsert({
  tableName: "myVectors",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Configure Mastra with Global Storage Provider

Source: https://mastra.ai/docs/v1/agents/agent-memory

Initializes the main Mastra instance with a storage provider, such as LibSQLStore, to manage data persistence for all agents. This sets up a centralized storage for conversation history.

```typescript
import { Mastra } from "@mastra/core";  
import { LibSQLStore } from "@mastra/libsql";  
  
export const mastra = new Mastra({
  // ..  
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ":memory:",
  }),
});  

```

--------------------------------

### Set Up Chat API Route with Mastra (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Configures a custom API route for chat functionality using Mastra's `chatRoute()` utility. This utility formats agent streams into an AI SDK-compatible format, simplifying integration with frontend hooks like `useChat()`. Requires `@mastra/core` and `@mastra/ai-sdk`.

```typescript
import { Mastra } from "@mastra/core";
import { chatRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  server: {
    apiRoutes: [
      chatRoute({
        path: "/chat",
        agent: "weatherAgent",
      }),
    ],
  },
});

```

--------------------------------

### Add Basic Voice Capabilities to an Agent (JavaScript)

Source: https://mastra.ai/docs/v1/agents/adding-voice

Demonstrates the simplest way to add voice to an agent using a single provider for both speaking and listening. It initializes an OpenAIVoice provider and an Agent, then uses the agent's voice methods to speak a greeting and transcribe audio input.

```javascript
import { createReadStream } from "fs";
import path from "path";
import { Agent } from "@mastra/core/agent";
import { OpenAIVoice } from "@mastra/voice-openai";
import { openai } from "@ai-sdk/openai";

// Initialize the voice provider with default settings
const voice = new OpenAIVoice();

// Create an agent with voice capabilities
export const agent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions: `You are a helpful assistant with both STT and TTS capabilities.`,
  model: openai("gpt-4o"),
  voice,
});

// The agent can now use voice for interaction
const audioStream = await agent.voice.speak("Hello, I'm your AI assistant!", {
  filetype: "m4a",
});

playAudio(audioStream!);

try {
  const transcription = await agent.voice.listen(audioStream);
  console.log(transcription);
} catch (error) {
  console.error("Error transcribing audio:", error);
}

```

--------------------------------

### Create and Compose Workflows in TypeScript

Source: https://mastra.ai/docs/v1/workflows/agents-and-tools

Demonstrates how to create a child workflow with defined input/output schemas and then use it as a step within a parent workflow. This allows for logic reuse and modularity in workflow design.

```typescript
const step1 = createStep({...});  
const step2 = createStep({...});  
  
const childWorkflow = createWorkflow({
  id: "child-workflow",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    emphasized: z.string()
  })
})
  .then(step1)
  .then(step2)
  .commit();
  
export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    emphasized: z.string()
  })
})
  .then(childWorkflow)
  .commit();
```

--------------------------------

### Configure Assistant UI to Connect to Mastra API

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/assistant-ui

TypeScript/React code snippet demonstrating how to configure the `useChatRuntime` hook in Assistant UI to point to a standalone Mastra server's API endpoint. Replace 'MASTRA_ENDPOINT' with the actual URL.

```typescript
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";

const runtime = useChatRuntime({
  transport: new AssistantChatTransport({
    api: "MASTRA_ENDPOINT",
  }),
});
```

--------------------------------

### Create MastraClient with Auth0 Access Token

Source: https://mastra.ai/docs/v1/auth/auth0

Creates an instance of MastraClient, including the Auth0 access token in the `Authorization` header for authenticated requests to the Mastra API.

```typescript
import { MastraClient } from "@mastra/client-js";

export const createMastraClient = (accessToken: string) => {
  return new MastraClient({
    baseUrl: "https://<mastra-api-url>",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
```

--------------------------------

### Create Routing Agent Network (TypeScript)

Source: https://mastra.ai/docs/v1/agents/networks

Defines a top-level routing agent for an agent network. It configures the agent's ID, name, instructions, LLM model, associated agents, workflows, tools, and memory. The memory is configured using a LibSQLStore for persistence.

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

import { researchAgent } from "./research-agent";
import { writingAgent } from "./writing-agent";

import { cityWorkflow } from "../workflows/city-workflow";
import { weatherTool } from "../tools/weather-tool";

export const routingAgent = new Agent({
  id: "routing-agent",
  name: "Routing Agent",
  instructions: `
      You are a network of writers and researchers.
      The user will ask you to research a topic.
      Always respond with a complete report—no bullet points.
      Write in full paragraphs, like a blog post.
      Do not answer with incomplete or uncertain information.`,
  model: openai("gpt-4o-mini"),
  agents: {
    researchAgent,
    writingAgent,
  },
  workflows: {
    cityWorkflow,
  },
  tools: {
    weatherTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      id: 'mastra-storage',
      url: "file:../mastra.db",
    }),
  }),
});
```

--------------------------------

### Environment Variable Configuration for Mastra API

Source: https://mastra.ai/docs/v1/deployment/monorepo

Shows how to place the `.env` file at the root of the Mastra application (`apps/api`) to manage environment variables like `OPENAI_API_KEY`.

```tree
api/  
├── src/  
│   └── mastra/  
├── .env  
├── package.json  
└── tsconfig.json  

```

--------------------------------

### Define Weather Tool (weather-tool.ts)

Source: https://mastra.ai/docs/v1/getting-started/installation

Implements a Mastra tool for fetching weather information. It defines the tool's ID, description, input/output schemas using Zod, and an execute function.

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async () => {
    return {
      output: "The weather is sunny",
    };
  },
});
```

--------------------------------

### LibSQL Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This code configures a RAG agent for LibSQL. It imports the OpenAI model and the LibSQL prompt, integrating them into the agent's instructions to manage context and queries effectively using a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { LIBSQL_PROMPT } from "@mastra/libsql";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${LIBSQL_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Configure Azure Voice

Source: https://mastra.ai/docs/v1/voice/overview

Sets up the Azure voice provider, defining speech and listening models. Configuration includes Azure speech key and region, along with model name, language, style, pitch, rate, and output format.

```javascript
const voice = new AzureVoice({
  speechModel: {
    name: "en-US-JennyNeural", // Example model name
    apiKey: process.env.AZURE_SPEECH_KEY,
    region: process.env.AZURE_SPEECH_REGION,
    language: "en-US", // Language code
    style: "cheerful", // Voice style
    pitch: "+0Hz", // Pitch adjustment
    rate: "1.0", // Speech rate
  },
  listeningModel: {
    name: "en-US", // Example model name
    apiKey: process.env.AZURE_SPEECH_KEY,
    region: process.env.AZURE_SPEECH_REGION,
    format: "simple", // Output format
  },
});
```

--------------------------------

### Implement Single-Turn Completions with useCompletion Hook (React/TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Shows how to use the useCompletion hook from @ai-sdk/react for single-turn completions. It manages sending a prompt to a Mastra agent and receiving a streamed completion response over HTTP, including input handling and form submission.

```typescript
"use client";

import { useCompletion } from "@ai-sdk/react";

export function Completion() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: "api/completion"
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Name of city" />
      </form>
      <p>Completion result: {completion}</p>
    </div>
  );
}

```

--------------------------------

### Automatic Cloud Exporter Configuration (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/cloud

Demonstrates how the CloudExporter is automatically included when using the default observability configuration if the Mastra Cloud access token is set in the environment variables.

```typescript
import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";

export const mastra = new Mastra({
  observability: new Observability({
    default: { enabled: true }, // Automatically includes CloudExporter if token exists
  }),
});
```

--------------------------------

### Connect to Klavis AI MCP Servers using MCPClient

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Configure MCPClient to connect to Klavis AI's hosted MCP servers for Salesforce and HubSpot. This requires providing the specific instance URLs for each service.

```typescript
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    salesforce: {
      url: new URL("https://salesforce-mcp-server.klavis.ai/mcp/?instance_id={private-instance-id}"),
    },
    hubspot: {
      url: new URL("https://hubspot-mcp-server.klavis.ai/mcp/?instance_id={private-instance-id}"),
    },
  },
});
```

--------------------------------

### Initialize Mastra with Firebase Auth (Custom Configuration)

Source: https://mastra.ai/docs/v1/auth/firebase

Initializes the Mastra server with Firebase authentication using custom constructor arguments for service account path and database ID.

```typescript
import { Mastra } from "@mastra/core";  
import { MastraAuthFirebase } from "@mastra/auth-firebase";  
  
export const mastra = new Mastra({  
  // ..  
  server: {  
    auth: new MastraAuthFirebase({  
      serviceAccount: "/path/to/service-account.json",  
      databaseId: "your-database-id",  
    }),  
  },  
});  

```

--------------------------------

### Configure OpenAI Voice Provider for STT

Source: https://mastra.ai/docs/v1/voice/speech-to-text

Demonstrates how to initialize the OpenAIVoice provider with specific STT model configurations, including the model name and API key. It also shows a simplified initialization using default settings.

```javascript
const voice = new OpenAIVoice({
  listeningModel: {
    name: "whisper-1",
    apiKey: process.env.OPENAI_API_KEY,
  },
});

// If using default settings the configuration can be simplified to:
const voice = new OpenAIVoice();

```

--------------------------------

### Default Exporter Strategy and Batching Configuration

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/default

Illustrates how to configure the tracing strategy and batching parameters for the DefaultExporter. You can let the storage provider decide ('auto'), explicitly set a strategy, or configure batching limits for performance.

```typescript
new DefaultExporter({
  strategy: "auto", // Default - let storage provider decide
  // or explicitly set:
  // strategy: 'realtime' | 'batch-with-updates' | 'insert-only'

  // Batching configuration (applies to both batch-with-updates and insert-only)
  maxBatchSize: 1000, // Max spans per batch
  maxBatchWaitMs: 5000, // Max wait before flushing
  maxBufferSize: 10000, // Max spans to buffer
});

```

--------------------------------

### Update Mastra Weather Agent with OpenAI SDK

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Updates the weather agent code to use the createOpenAI function from the '@ai-sdk/openai' package. It configures the OpenAI client with the API key, ensuring it can communicate with the OpenAI API.

```typescript
- import { openai } from "@ai-sdk/openai";
+ import { createOpenAI } from "@ai-sdk/openai";

+ const openai = createOpenAI({
+   apiKey: import.meta.env?.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
+   compatibility: "strict"
+ });

```

--------------------------------

### Configure Google Voice

Source: https://mastra.ai/docs/v1/voice/overview

Sets up the Google voice provider with specific speech and listening models. Configuration involves the Google API key and includes parameters for model name, language code, gender, speaking rate, and sample rate for listening.

```javascript
const voice = new GoogleVoice({
  speechModel: {
    name: "en-US-Studio-O", // Example model name
    apiKey: process.env.GOOGLE_API_KEY,
    languageCode: "en-US", // Language code
    gender: "FEMALE", // Voice gender
    speakingRate: 1.0, // Speaking rate
  },
  listeningModel: {
    name: "en-US", // Example model name
    sampleRateHertz: 16000, // Sample rate
  },
});
```

--------------------------------

### Configure Vercel Deployer Options

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/vercel-deployer

Shows how to configure optional overrides for the VercelDeployer, such as function execution timeout, memory allocation, and deployment regions. These settings are written to Vercel's output API function config.

```typescript
deployer: new VercelDeployer({
  maxDuration: 600,
  memory: 1536,
  regions: ["sfo1", "iad1"],
});
```

--------------------------------

### Configure MastraClient with WorkOS Access Token

Source: https://mastra.ai/docs/v1/auth/workos

Create a MastraClient instance configured to include a WorkOS access token in the `Authorization` header. This ensures that requests made by the client are authenticated with Mastra.

```typescript
import { MastraClient } from "@mastra/client-js";  
  
export const createMastraClient = (accessToken: string) => {
  return new MastraClient({
    baseUrl: "https://<mastra-api-url>",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

```

--------------------------------

### Implement Weather API Test Page

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Implements a Svelte component for testing the weather API. It includes a form to submit a city name and uses the fetch API to send a POST request to the '/weather-api' endpoint, displaying the returned weather data.

```svelte
<script lang="ts">
	let result = $state<string | null>(null);
	async function handleFormSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const city = formData.get('city')?.toString();
		if (city) {
			const response = await fetch('/weather-api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ city })
			});
			const data = await response.json();
			result = data.result;
		}
	}
</script>

<h1>Test</h1>
<form method="POST" onsubmit={handleFormSubmit}>
	<input name="city" placeholder="Enter city" required />
	<button type="submit">Get Weather</button>
</form>

{#if result}
	<pre>{result}</pre>
{/if}

```

--------------------------------

### Connect to Mastra Server using MastraClient (JavaScript)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/azure-app-services

Demonstrates how to instantiate and use the MastraClient from the '@mastra/client-js' package to connect to a deployed Mastra application on Azure App Services. It requires the base URL of the deployed application.

```javascript
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: "https://<your-app-name>.azurewebsites.net",
});

```

--------------------------------

### chatRoute() Utility

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Use the `chatRoute()` utility to create a route handler that automatically formats the agent stream into an AI SDK-compatible format for chat interactions. You can then use the `useChat()` hook in your application.

```APIDOC
### `chatRoute()`

When setting up a custom API route, use the `chatRoute()` utility to create a route handler that automatically formats the agent stream into an AI SDK-compatible format.

#### Example Setup (`src/mastra/index.ts`)
```typescript
import { Mastra } from "@mastra/core";
import { chatRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  server: {
    apiRoutes: [
      chatRoute({
        path: "/chat",
        agent: "weatherAgent",
      }),
    ],
  },
});
```

#### Usage with `useChat()` hook
```typescript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/chat",
  }),
});
```

#### Passing Extra Options (e.g., memory config)
```typescript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/chat",
    prepareSendMessagesRequest({ messages }) {
      return {
        body: {
          messages,
          // Pass memory config
          memory: {
            thread: "user-1",
            resource: "user-1",
          },
        },
      };
    },
  }),
});
```
```

--------------------------------

### Configure Storage and Vector DB with LibSQL - Mastra AI

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Sets up memory with LibSQLStore for storage and LibSQLVector for vector database operations, which are essential for semantic recall. This uses a local SQLite database file.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

const agent = new Agent({
  memory: new Memory({
    // this is the default storage db if omitted
    storage: new LibSQLStore({
      id: 'agent-storage',
      url: "file:./local.db",
    }),
    // this is the default vector db if omitted
    vector: new LibSQLVector({
      id: 'agent-vector',
      connectionUrl: "file:./local.db",
    }),
  }),
});

```

--------------------------------

### Configure MastraClient with Authorization Header

Source: https://mastra.ai/docs/v1/auth/clerk

Demonstrates how to configure the MastraClient with the necessary Authorization header, including the Clerk access token. This ensures that all subsequent requests made by this client instance are authenticated.

```typescript
import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: "https://<mastra-api-url>",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

```

--------------------------------

### Configure PostgreSQL Memory for Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-pg

Sets up a Mastra agent with PostgreSQL memory persistence using `PostgresStore`. It requires `openai` for the model and `@mastra/pg` for the database interaction. The `DATABASE_URL` environment variable must be set for the connection string.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { PostgresStore } from "@mastra/pg";

export const pgAgent = new Agent({
  id: "pg-agent",
  name: "PG Agent",
  instructions:
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new PostgresStore({
      id: 'pg-agent-storage',
      connectionString: process.env.DATABASE_URL!,
    }),
    options: {
      generateTitle: true, // Explicitly enable automatic title generation
    },
  }),
});

```

--------------------------------

### Real-time Speech to Speech with OpenAI Voice Provider

Source: https://mastra.ai/docs/v1/voice/overview

This snippet illustrates real-time speech-to-speech interaction using the Mastral AI Agent with the OpenAI Realtime Voice provider. It includes setting up the agent, handling audio output from the speaker, and sending continuous audio input from the microphone.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { playAudio, getMicrophoneStream } from "@mastra/node-audio";
import { OpenAIRealtimeVoice } from "@mastra/voice-openai-realtime";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new OpenAIRealtimeVoice(),
});

// Listen for agent audio responses
voiceAgent.voice.on("speaker", ({ audio }) => {
  playAudio(audio);
});

// Initiate the conversation
await voiceAgent.voice.speak("How can I help you today?");

// Send continuous audio from the microphone
const micStream = getMicrophoneStream();
await voiceAgent.voice.send(micStream);
```

--------------------------------

### Connect to Ampersand MCP Server (SSE) using MCPClient

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Configure MCPClient to connect to the Ampersand MCP Server using Server-Sent Events (SSE). This requires an API key, project ID, integration name, and optionally a group reference, typically sourced from environment variables.

```typescript
// MCPClient with Ampersand MCP Server using SSE
export const mcp = new MCPClient({
  servers: {
    "@amp-labs/mcp-server": {
      url: `https://mcp.withampersand.com/v1/sse?${new URLSearchParams({
        apiKey: process.env.AMPERSAND_API_KEY,
        project: process.env.AMPERSAND_PROJECT_ID,
        integrationName: process.env.AMPERSAND_INTEGRATION_NAME,
        groupRef: process.env.AMPERSAND_GROUP_REF,
      })}`,
    },
  },
});
```

--------------------------------

### Runtime Configuration Override for Vector Query Tool (JavaScript)

Source: https://mastra.ai/docs/v1/rag/retrieval

Shows how to dynamically override database configurations for the Vector Query Tool at runtime using the RequestContext. This allows for flexible, context-aware query behavior.

```javascript
import { RequestContext } from "@mastra/core/request-context";

const requestContext = new RequestContext();
requestContext.set("databaseConfig", {
  pinecone: {
    namespace: "runtime-namespace",
  },
});

await pineconeQueryTool.execute({
  context: { queryText: "search query" },
  mastra,
  requestContext,
});
```

--------------------------------

### Add .mastra to .gitignore

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Adds the `.mastra` directory to your `.gitignore` file. This ensures that Mastra-generated files are not tracked by Git.

```gitignore
.mastra

```

--------------------------------

### Define and Execute Client-Side Tools with Mastra AI

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Defines a client-side tool using `createTool` for browser functionality like DOM manipulation. This tool is then passed to an agent via `clientTools` in `.generate()` calls, allowing agents to trigger browser-side actions. Dependencies include `@mastra/client-js` and `zod` for schema validation.

```javascript
import { createTool } from "@mastra/client-js";  
import { z } from "zod";  
  
const handleClientTool = async () => {  
  try {  
    const agent = mastraClient.getAgent("colorAgent");  
  
    const colorChangeTool = createTool({  
      id: "color-change-tool",  
      description: "Changes the HTML background color",  
      inputSchema: z.object({  
        color: z.string(),  
      }),  
      outputSchema: z.object({  
        success: z.boolean(),  
      }),  
      execute: async (inputData) => {  
        const { color } = inputData;  
  
        document.body.style.backgroundColor = color;  
        return { success: true };  
      },  
    });  
  
    const response = await agent.generate({  
      messages: "Change the background to blue",  
      clientTools: { colorChangeTool },  
    });  
  
    console.log(response);  
  } catch (error) {  
    console.error(error);  
  }  
};  

```

--------------------------------

### Configure Environment Variables for Braintrust

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/braintrust

Sets up essential environment variables required for the Braintrust exporter. These include the API key and an optional project name, ensuring secure and correct trace data routing.

```env
BRAINTRUST_API_KEY=sk-xxxxxxxxxxxxxxxx
BRAINTRUST_PROJECT_NAME=my-project  # Optional, defaults to 'mastra-tracing'
```

--------------------------------

### Run Mastra Application (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Runs the built Mastra application using Node.js, loading environment variables from the .env file. The application defaults to port 4111.

```bash
node --env-file=".env" .mastra/output/index.mjs
```

--------------------------------

### Custom Mastra Initialization with WorkOS Auth

Source: https://mastra.ai/docs/v1/auth/workos

Initialize the Mastra server with custom WorkOS authentication configuration. This allows specifying the WorkOS API key and client ID directly, overriding environment variable defaults.

```typescript
import { Mastra } from "@mastra/core";  
import { MastraAuthWorkos } from "@mastra/auth-workos";  
  
export const mastra = new Mastra({
  // ..  
  server: {
    auth: new MastraAuthWorkos({
      apiKey: process.env.WORKOS_API_KEY,
      clientId: process.env.WORKOS_CLIENT_ID,
    }),
  },
});  

```

--------------------------------

### Configure .env for Clerk Authentication

Source: https://mastra.ai/docs/v1/auth/clerk

Sets up essential Clerk credentials in the .env file for Mastra authentication. These include the publishable key, secret key, and JWKS URI, which are necessary for verifying user sessions.

```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URI=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json

```

--------------------------------

### Configure Mastra AI Agent for Color Responses

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Configures a Mastra AI agent (`color-agent`) designed to act as a CSS assistant. It's instructed to respond with hex color codes based on user requests, intended to work with client-side tools that modify the web page's background color. Uses `@ai-sdk/openai` and `@mastra/core/agent`.

```javascript
import { openai } from "@ai-sdk/openai";  
import { Agent } from "@mastra/core/agent";  
  
export const colorAgent = new Agent({  
  id: "color-agent",  
  name: "Color Agent",  
  instructions: `You are a helpful CSS assistant.  
  You can change the background color of web pages.  
  Respond with a hex reference for the color requested by the user`,  
  model: openai("gpt-4o-mini"),  
});  

```

--------------------------------

### Define an Agent with Tools Configuration

Source: https://mastra.ai/docs/v1/agents/overview

Shows how to define a Mastra AI agent and configure it to use external tools. The `tools` property in the Agent constructor accepts an object mapping tool names to tool implementations.

```typescript
export const testAgent = new Agent({  
  id: "test-agent",  
  name: "Test Agent",  
  // ...  
  tools: { testTool },  
});
```

--------------------------------

### Configure Mastra Instance with Inngest API Endpoint (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This snippet demonstrates how to configure a Mastra instance with a workflow and set up the Inngest API endpoint. It uses the Mastra core library and the Inngest adapter to integrate workflows with Inngest functions, handling unique run IDs, execution engines, and state persistence.

```typescript
import { Mastra } from "@mastra/core";
import { serve as inngestServe } from "@mastra/inngest";
import { incrementWorkflow } from "./workflows";
import { inngest } from "./inngest";
import { PinoLogger } from "@mastra/loggers";

// Configure Mastra with the workflow and Inngest API endpoint
export const mastra = new Mastra({
  workflows: {
    incrementWorkflow,
  },
  server: {
    // The server configuration is required to allow local docker container can connect to the mastra server
    host: "0.0.0.0",
    apiRoutes: [
      // This API route is used to register the Mastra workflow (inngest function) on the inngest server
      {
        path: "/api/inngest",
        method: "ALL",
        createHandler: async ({ mastra }) => inngestServe({ mastra, inngest }),
        // The inngestServe function integrates Mastra workflows with Inngest by:
        // 1. Creating Inngest functions for each workflow with unique IDs (workflow.${workflowId})
        // 2. Setting up event handlers that:
        //    - Generate unique run IDs for each workflow execution
        //    - Create an InngestExecutionEngine to manage step execution
        //    - Handle workflow state persistence and real-time updates
        // 3. Establishing a publish-subscribe system for real-time monitoring
        //    through the workflow:${workflowId}:${runId} channel
        //
        // Optional: You can also pass additional Inngest functions to serve alongside workflows:
        // createHandler: async ({ mastra }) => inngestServe({
        //   mastra,
        //   inngest,
        //   functions: [customFunction1, customFunction2] // User-defined Inngest functions
        // }),
      },
    ],
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
```

--------------------------------

### Configure OpenAI Realtime Voice Provider in JavaScript

Source: https://mastra.ai/docs/v1/voice/overview

Configures the OpenAI Realtime voice provider, including settings for both speech and listening models. It requires an API key for OpenAI and specifies model names, language, audio format for listening, and a speaker.

```javascript
const voice = new OpenAIRealtimeVoice({
  speechModel: {
    name: "gpt-3.5-turbo", // Example model name
    apiKey: process.env.OPENAI_API_KEY,
    language: "en-US", // Language code
  },
  listeningModel: {
    name: "whisper-1", // Example model name
    apiKey: process.env.OPENAI_API_KEY,
    format: "ogg", // Audio format
  },
  speaker: "alloy", // Example speaker name
});
```

--------------------------------

### TypeScript Configuration for Mastra Projects

Source: https://mastra.ai/docs/v1/server-db/mastra-server

Recommended TypeScript configuration for Mastra projects, ensuring compatibility with modern Node.js versions and Mastra's packages. It uses ES2022 modules and bundler resolution, with strict type checking enabled.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}

```

--------------------------------

### pgVector Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet demonstrates creating a RAG agent configured for pgVector. It imports the necessary OpenAI model and the pgVector prompt, then initializes an Agent with specific instructions that include the pgVector prompt and a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { PGVECTOR_PROMPT } from "@mastra/pg";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${PGVECTOR_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Create Vector Query Tool for Agents

Source: https://mastra.ai/docs/v1/rag/retrieval

Creates a tool that allows an agent to query a vector database directly. This tool enables the agent to dynamically decide retrieval strategies, combining semantic search with optional filtering and re-ranking based on its understanding of the user's needs. Key parameters include the vector store name, index name, and the embedding model. Requires a Mastra integration (e.g., `createVectorQueryTool`).

```typescript
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "pgVector",
  indexName: "embeddings",
  model: openai.embedding("text-embedding-3-small"),
});
```

--------------------------------

### Query Processing with Tools

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet shows how to process queries using a vector query tool, integrating a prompt template and a vector query function. It's designed for concise and relevant response generation.

```javascript
console.log(`
  Process queries using the provided context. Structure responses to be concise and relevant.  
  ${S3VECTORS_PROMPT}  
  `,  
  tools: { vectorQueryTool },  
});  

```

--------------------------------

### Configure Mastra with CopilotKit

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Configures a Mastra instance to include CopilotKit's runtime endpoint. This involves registering the CopilotKit endpoint and setting up context for the weather agent.

```typescript
import { Mastra } from "@mastra/core";
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { weatherAgent } from "./agents/weather-agent";

type WeatherRequestContext = {
  "user-id": string;
  "temperature-scale": "celsius" | "fahrenheit";
};

export const mastra = new Mastra({
  agents: { weatherAgent },
  server: {
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      registerCopilotKit<WeatherRequestContext>({
        path: "/copilotkit",
        resourceId: "weatherAgent",
        setContext: (c, requestContext) => {
          requestContext.set(
            "user-id",
            c.req.header("X-User-ID") || "anonymous",
          );
          requestContext.set("temperature-scale", "celsius");
        },
      }),
    ],
  },
});
```

--------------------------------

### Configure ElevenLabs Voice

Source: https://mastra.ai/docs/v1/voice/overview

Initializes the ElevenLabs voice provider with a specified voice ID and model. Requires an ElevenLabs API key and supports language and emotion settings. Note: ElevenLabs may not offer a separate listening model.

```javascript
const voice = new ElevenLabsVoice({
  speechModel: {
    voiceId: "your-voice-id", // Example voice ID
    model: "eleven_multilingual_v2", // Example model name
    apiKey: process.env.ELEVENLABS_API_KEY,
    language: "en", // Language code
    emotion: "neutral", // Emotion setting
  },
  // ElevenLabs may not have a separate listening model
});
```

--------------------------------

### Vector Query Tool for Agents

Source: https://mastra.ai/docs/v1/rag/retrieval

Describes how to create a Vector Query Tool that allows an AI agent to directly query a vector database. This enables agents to make retrieval decisions dynamically, combining semantic search with optional filtering and re-ranking.

```APIDOC
## Vector Query Tool for Agents

### Description
This tool allows an AI agent to interact directly with a vector database. The agent can control the retrieval process, including semantic search and applying filters, based on its understanding of the user's needs. This is particularly useful for dynamic and complex information retrieval scenarios.

### Method
N/A (This is a tool configuration for an agent)

### Endpoint
N/A

### Parameters
#### Tool Configuration Parameters
- **vectorStoreName** (String) - Required - The name or identifier of the vector store to be queried.
- **indexName** (String) - Required - The name of the index within the vector store.
- **model** (Object) - Required - The embedding model to use for query vectorization.
- **toolName** (String) - Optional - A custom name for the tool (e.g., "SearchKnowledgeBase").
- **toolDescription** (String) - Optional - A description to help the agent understand when to use the tool.

### Request Example
```javascript
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "pgVector",
  indexName: "embeddings",
  model: openai.embedding("text-embedding-3-small"),
  // Optional parameters:
  // toolName: "SearchDocumentation",
  // toolDescription: "Search through our documentation to find relevant information about X topic."
});
```

### Response
This function returns a tool object that can be integrated into an AI agent's toolset. The agent will then use this tool to perform queries based on its internal logic and the provided tool description.
```

--------------------------------

### Connect to Composio.dev SSE-based MCP Servers using MCPClient

Source: https://mastra.ai/docs/v1/tools-mcp/mcp-overview

Configure MCPClient to connect to Composio.dev's registry of SSE-based MCP servers, such as those for Google Sheets and Gmail. These URLs are typically tied to a single user account.

```typescript
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    googleSheets: {
      url: new URL("https://mcp.composio.dev/googlesheets/[private-url-path]"),
    },
    gmail: {
      url: new URL("https://mcp.composio.dev/gmail/[private-url-path]"),
    },
  },
});
```

--------------------------------

### Infer Multiple Mastra Tool Types with InferUITools (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

The InferUITools type helper infers the input and output types for a collection of Mastra tools. It allows you to define a set of tools and then generate a comprehensive type that includes the input and output schemas for each tool in the set. This is beneficial for managing and using multiple tools within an application.

```typescript
import { InferUITools, createTool } from "@mastra/core/tools";
import { z } from "zod";

// Assuming weatherTool is defined as in the previous example
// const weatherTool = createTool({...});

const tools = {
  weather: weatherTool,
  calculator: createTool({
    id: "calculator",
    description: "Perform basic arithmetic",
    inputSchema: z.object({
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      a: z.number(),
      b: z.number(),
    }),
    outputSchema: z.object({
      result: z.number(),
    }),
    execute: async (inputData) => {
      // implementation...
      return { result: 0 };
    },
  }),
};

// Infer types from the tool set
export type MyUITools = InferUITools<typeof tools>;
// This creates:
// {
//   weather: { input: { location: string }; output: { temperature: number; conditions: string } };
//   calculator: { input: { operation: "add" | "subtract" | "multiply" | "divide"; a: number; b: number }; output: { result: number } };
// }
```

--------------------------------

### Set Up Workflow API Route with Mastra (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Configures a custom API route for workflow execution using Mastra's `workflowRoute()` utility. This formats agent workflow streams into an AI SDK-compatible format, enabling interaction via the `useChat()` hook with specific input data handling. Requires `@mastra/core` and `@mastra/ai-sdk`.

```typescript
import { Mastra } from "@mastra/core";
import { workflowRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  server: {
    apiRoutes: [
      workflowRoute({
        path: "/workflow",
        agent: "weatherAgent",
      }),
    ],
  },
});

```

--------------------------------

### Run Workflow (Stream Mode)

Source: https://mastra.ai/docs/v1/workflows/overview

Details how to run a workflow in 'stream' mode, which emits events as each step executes. This is useful for monitoring progress or triggering actions during execution. It uses `createRun()` and `.stream()` to initiate execution, and the results can be iterated over using `for await...of`.

```javascript
const run = await testWorkflow.createRun();

const result = await run.stream({
  inputData: {
    message: "Hello world"
  }
});

for await (const chunk of result.stream) {
  console.log(chunk);
}
```

--------------------------------

### Implement Real-time Chat with useChat Hook (React/TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Demonstrates how to use the useChat hook from @ai-sdk/react to manage real-time chat interactions. It handles sending prompts to a Mastra agent and receiving streaming responses via HTTP, including basic input state management and form submission.

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { DefaultChatTransport } from 'ai';

export function Chat() {
  const [inputValue, setInputValue] = useState('')
  const { messages, sendMessage} = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4111/chat',
    }),
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: inputValue });
  };

  return (
    <div>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      <form onSubmit={handleFormSubmit}>
        <input value={inputValue} onChange={e=>setInputValue(e.target.value)} placeholder="Name of city" />
      </form>
    </div>
  );
}

```

--------------------------------

### Configure Mastra AI with Custom OTEL Endpoints (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/otel

Configures the Mastra AI project to send traces to custom or generic OTEL-compatible endpoints. Allows specifying the endpoint URL, protocol (http/protobuf, http/json, grpc), and custom headers.

```typescript
new OtelExporter({
  provider: {
    custom: {
      endpoint: "https://your-collector.example.com/v1/traces",
      protocol: "http/protobuf", // 'http/json' | 'http/protobuf' | 'grpc'
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    },
  },
});
```

--------------------------------

### Analyze Images and Extract Text with Mastra AI Agent

Source: https://mastra.ai/docs/v1/agents/overview

Shows how to enable an agent to analyze images by passing an object with type 'image' and the image URL. It combines image content with a text prompt to describe the image and extract any text within it.

```typescript
const response = await testAgent.generate([  
  {  
    role: "user",  
    content: [  
      {  
        type: "image",  
        image: "https://placebear.com/cache/395-205.jpg",  
        mimeType: "image/jpeg",  
      },  
      {  
        type: "text",  
        text: "Describe the image in detail, and extract all the text in the image.",  
      },  
    ],  
  },  
]);  
  
console.log(response.text);
```

--------------------------------

### Use Gemini Live Agent with STS

Source: https://mastra.ai/docs/v1/voice/speech-to-speech

Integrates an Agent with GeminiLiveVoice for real-time communication. It establishes a connection, plays back audio responses, logs text streams, initiates speech, and sends microphone input. Requires GOOGLE_API_KEY or Vertex AI credentials.

```javascript
import { Agent } from "@mastra/core/agent";
import { GeminiLiveVoice } from "@mastra/voice-google-gemini-live";
import { playAudio, getMicrophoneStream } from "@mastra/node-audio";

const agent = new Agent({
  id: "agent",
  name: "Gemini Live Agent",
  instructions:
    "You are a helpful assistant with real-time voice capabilities.",
  // Model used for text generation; voice provider handles realtime audio
  model: openai("gpt-4o"),
  voice: new GeminiLiveVoice({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash-exp",
    speaker: "Puck",
    debug: true,
    // Vertex AI option:
    // vertexAI: true,
    // project: 'your-gcp-project',
    // location: 'us-central1',
    // serviceAccountKeyFile: '/path/to/service-account.json',
  }),
});

await agent.voice.connect();

agent.voice.on("speaker", ({ audio }) => {
  playAudio(audio);
});

agent.voice.on("writing", ({ role, text }) => {
  console.log(`${role}: ${text}`);
});

await agent.voice.speak("How can I help you today?");

const micStream = getMicrophoneStream();
await agent.voice.send(micStream);
```

--------------------------------

### Workflow Run Event Structure (JavaScript)

Source: https://mastra.ai/docs/v1/streaming/overview

This JavaScript code snippet demonstrates the structure of an event output from `Run.stream()`. It includes top-level properties like `runId` and `from`, and a `payload` containing details about the step execution, such as `stepName`, `args`, and `status`. This structure facilitates easier tracking of workflow runs.

```javascript
// ...
{
  type: 'step-start',
  runId: '1eeaf01a-d2bf-4e3f-8d1b-027795ccd3df',
  from: 'WORKFLOW',
  payload: {
    stepName: 'step-1',
    args: { value: 'initial data' },
    stepCallId: '8e15e618-be0e-4215-a5d6-08e58c152068',
    startedAt: 1755121710066,
    status: 'running'
  }
}

```

--------------------------------

### OpenSearch Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates the OpenSearch vector database using the @mastra/opensearch library. It initializes an OpenSearchVector store with the cluster URL, creates an index, and upserts vectors. Requires OPENSEARCH_URL environment variable.

```typescript
import { OpenSearchVector } from "@mastra/opensearch";

const store = new OpenSearchVector({ url: process.env.OPENSEARCH_URL });

await store.createIndex({
  indexName: "my-collection",
  dimension: 1536,
});

await store.upsert({
  indexName: "my-collection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Configure Upstash Environment Variables

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-upstash

Sets up environment variables for Upstash Redis and Vector services, including API keys and REST URLs. These are necessary for connecting Mastra's memory system to Upstash.

```env
OPENAI_API_API_KEY=<your-api-key>  
UPSTASH_REDIS_REST_URL=<your-redis-url>  
UPSTASH_REDIS_REST_TOKEN=<your-redis-token>  
UPSTASH_VECTOR_REST_URL=<your-vector-index-url>  
UPSTASH_VECTOR_REST_TOKEN=<your-vector-index-token>  


```

--------------------------------

### Configure Google Gemini Live Voice

Source: https://mastra.ai/docs/v1/voice/speech-to-speech

Set up the GeminiLiveVoice for real-time interactions with Google Gemini. This requires API keys and can optionally use Vertex AI with project and service account details. Debugging can be enabled via the 'debug' option.

```javascript
const agent = new Agent({
  id: "agent",
  name: "Gemini Live Agent",
  instructions:
    "You are a helpful assistant with real-time voice capabilities.",
  // Model used for text generation; voice provider handles realtime audio
  model: openai("gpt-4o"),
  voice: new GeminiLiveVoice({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash-exp",
    speaker: "Puck",
    debug: true,
    // Vertex AI option:
    // vertexAI: true,
    // project: 'your-gcp-project',
    // location: 'us-central1',
    // serviceAccountKeyFile: '/path/to/service-account.json',
  }),
});
```

--------------------------------

### Update .gitignore

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Adds the `.mastra` directory to your `.gitignore` file to prevent Mastra's generated files from being committed to version control.

```gitignore
.mastra  
```

--------------------------------

### Upstash Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet sets up a RAG agent for Upstash. It includes the OpenAI model and the Upstash prompt in the agent's instructions, enabling the agent to process queries with context using a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { UPSTASH_PROMPT } from "@mastra/upstash";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${UPSTASH_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Create Test Route Component (React)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Creates a React component for the 'test' route, which includes a form to interact with a Mastra agent. This component demonstrates sending a request to the Weather agent and displaying the response.

```typescript
import { useState } from "react";
import { mastraClient } from "../../lib/mastra";

export default function Test() {
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const city = formData.get("city")?.toString();
    const agent = mastraClient.getAgent("weatherAgent");

    const response = await agent.generate({
      messages: [{ role: "user", content: `What's the weather like in ${city}?` }]
    });

    setResult(response.text);
  }

  return (
    <>
      <h1>Test</h1>
      <form onSubmit={handleSubmit}>
        <input name="city" placeholder="Enter city" required />
        <button type="submit">Get Weather</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
}

```

--------------------------------

### Always Sample Strategy Configuration (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Defines the 'always' sampling strategy for Mastra tracing, ensuring that 100% of traces are collected. This is ideal for development and debugging scenarios requiring complete visibility.

```typescript
sampling: {
  type: "always";
}
```

--------------------------------

### Use Chat Hook with Custom Request Preparation (JavaScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Enhances the `useChat()` hook configuration by providing a `prepareSendMessagesRequest` function. This allows for customization of the request body, such as adding memory configurations for conversation threading. It leverages `DefaultChatTransport`.

```javascript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/chat",
    prepareSendMessagesRequest({ messages }) {
      return {
        body: {
          messages,
          // Pass memory config
          memory: {
            thread: "user-1",
            resource: "user-1",
          },
        },
      };
    },
  }),
});

```

--------------------------------

### Combine OpenAI STT and PlayAI TTS with CompositeVoice in JavaScript

Source: https://mastra.ai/docs/v1/voice/overview

Demonstrates using CompositeVoice to combine OpenAI for speech-to-text (STT) and PlayAI for text-to-speech (TTS). It initializes each provider with their respective configurations (API keys, model names) and then uses the combined 'voice' object to listen and speak.

```javascript
import { OpenAIVoice } from "@mastra/voice-openai";
import { PlayAIVoice } from "@mastra/voice-playai";
import { CompositeVoice } from "@mastra/core/voice";
import { playAudio, getMicrophoneStream } from "@mastra/node-audio";

// Initialize OpenAI voice for STT
const input = new OpenAIVoice({
  listeningModel: {
    name: "whisper-1",
    apiKey: process.env.OPENAI_API_KEY,
  },
});

// Initialize PlayAI voice for TTS
const output = new PlayAIVoice({
  speechModel: {
    name: "playai-voice",
    apiKey: process.env.PLAYAI_API_KEY,
  },
});

// Combine the providers using CompositeVoice
const voice = new CompositeVoice({
  input,
  output,
});

// Implement voice interactions using the combined voice provider
const audioStream = getMicrophoneStream(); // Assume this function gets audio input
const transcript = await voice.listen(audioStream);

// Log the transcribed text
console.log("Transcribed text:", transcript);

// Convert text to speech
const responseAudio = await voice.speak(`You said: ${transcript}`, {
  speaker: "default", // Optional: specify a speaker,
  responseFormat: "wav", // Optional: specify a response format
});

// Play the audio response
playAudio(responseAudio);
```

--------------------------------

### Langfuse Exporter Batch Mode Configuration (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langfuse

Configures the Langfuse exporter for batch mode (default), automatically batching traces for better performance. Suitable for production environments.

```javascript
new LangfuseExporter({  
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,  
  secretKey: process.env.LANGFUSE_SECRET_KEY!,  
  realtime: false, // Default - batch traces  
});  
```

--------------------------------

### Remove LibSQLStore from Weather Agent Memory (TypeScript)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers

This code snippet illustrates the removal of `LibSQLStore` from the memory configuration of the weather agent in `src/mastra/agents/weather-agent.ts`. This modification is crucial for cloud deployments where local file storage is not persistent.

```typescript
export const weatherAgent = new Agent({
  id: "weather-agent",
  // ..
  memory: new Memory({
    // [!code --]
    storage: new LibSQLStore({
      id: 'mastra-storage',
      // [!code --]
      url: "file:../mastra.db", // path is relative to the .mastra/output directory // [!code --]
    }), // [!code --]
  }), // [!code --]
});

```

--------------------------------

### Available TTS Providers

Source: https://mastra.ai/docs/v1/voice/text-to-speech

An overview of the Text-to-Speech providers supported by Mastra, including OpenAI, Azure, ElevenLabs, and others.

```APIDOC
## Available Providers

Mastra supports a wide range of Text-to-Speech providers, each with their own unique capabilities and voice options. You can choose the provider that best suits your application's needs:
  * **OpenAI** - High-quality voices with natural intonation and expression
  * **Azure** - Microsoft's speech service with a wide range of voices and languages
  * **ElevenLabs** - Ultra-realistic voices with emotion and fine-grained control
  * **PlayAI** - Specialized in natural-sounding voices with various styles
  * **Google** - Google's speech synthesis with multilingual support
  * **Cloudflare** - Edge-optimized speech synthesis for low-latency applications
  * **Deepgram** - AI-powered speech technology with high accuracy
  * **Speechify** - Text-to-speech optimized for readability and accessibility
  * **Sarvam** - Specialized in Indic languages and accents
  * **Murf** - Studio-quality voice overs with customizable parameters

Each provider is implemented as a separate package that you can install as needed:

```bash
pnpm add @mastra/voice-openai@beta  # Example for OpenAI
```
```

--------------------------------

### Stream Agent Response with V2 Models (AI SDK v5)

Source: https://mastra.ai/docs/v1/streaming/overview

Demonstrates how to stream responses from an agent using the `.stream()` method, compatible with V2 models and AI SDK v5. It iterates over the `textStream` to process chunks as they are generated.

```javascript
const testAgent = mastra.getAgent("testAgent");  
  
const stream = await testAgent.stream([  
  { role: "user", content: "Help me organize my day" },  
]);  
  
for await (const chunk of stream.textStream) {  
  process.stdout.write(chunk);  
}
```

--------------------------------

### LibSQL Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates with LibSQL using the @mastra/core/vector/libsql library. It initializes a LibSQLVector store with a database URL and an optional auth token for Turso cloud databases. It then creates an index and upserts vectors.

```typescript
import { LibSQLVector } from "@mastra/core/vector/libsql";

const store = new LibSQLVector({
  id: 'libsql-vector',
  connectionUrl: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN, // Optional: for Turso cloud databases
});

await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});

await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Transcribe Audio Input from a File (JavaScript)

Source: https://mastra.ai/docs/v1/agents/adding-voice

Illustrates how to transcribe an audio file using the agent's `listen` method. It reads an audio file into a stream and passes it to `agent.voice.listen` for transcription.

```javascript
import { createReadStream } from "fs";
import path from "path";

// Read audio file and transcribe
const audioFilePath = path.join(process.cwd(), "/agent.m4a");
const audioStream = createReadStream(audioFilePath);

try {
  console.log("Transcribing audio file...");
  const transcription = await agent.voice.listen(audioStream, {
    filetype: "m4a",
  });
  console.log("Transcription:", transcription);
} catch (error) {
  console.error("Error transcribing audio:", error);
}

```

--------------------------------

### Tag and Push Docker Image to ECR

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Tags the locally built Docker image with the ECR repository URI and pushes it to the ECR repository. This makes the image available for use with AWS Lambda.

```shell
docker tag "$PROJECT_NAME":latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PROJECT_NAME":latest
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PROJECT_NAME":latest

```

--------------------------------

### Configure Google Gemini Live Voice Provider in JavaScript

Source: https://mastra.ai/docs/v1/voice/overview

Sets up the Google Gemini Live voice provider. This configuration requires an API key and specifies the speech model name and speaker. Google Gemini Live is a real-time bidirectional API and does not use separate speech and listening models.

```javascript
const voice = new GeminiLiveVoice({
  speechModel: {
    name: "gemini-2.0-flash-exp", // Example model name
    apiKey: process.env.GOOGLE_API_KEY,
  },
  speaker: "Puck", // Example speaker name
  // Google Gemini Live is a realtime bidirectional API without separate speech and listening models
});
```

--------------------------------

### Mastra Agent with Provider-Specific Options

Source: https://mastra.ai/docs/v1/agents/overview

Configures a Mastra agent's system instruction with provider-specific options, such as 'reasoningEffort' for OpenAI or 'cacheControl' for Anthropic. This allows fine-tuning of LLM behavior based on the provider.

```typescript
// With provider-specific options (e.g., caching, reasoning)  
instructions: {
  role: "system",  
  content:
    "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",  
  providerOptions: {
    openai: { reasoningEffort: "high" },        // OpenAI's reasoning models  
    anthropic: { cacheControl: { type: "ephemeral" } }  // Anthropic's prompt caching  
  }
}

```

--------------------------------

### Control Agent LLM Calls with maxSteps Parameter

Source: https://mastra.ai/docs/v1/agents/overview

Illustrates how to use the `maxSteps` parameter to limit the maximum number of sequential LLM calls an agent can make. This helps prevent infinite loops and control resource usage.

```typescript
const response = await testAgent.generate("Help me organize my day", {  
  maxSteps: 5,  
});  
  
console.log(response.text);
```

--------------------------------

### Next.js API Route for Local Mastra Agents

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

A Next.js API route handler (`app/api/copilotkit/route.ts`) that connects to local Mastra agents. It initializes the CopilotRuntime with local agents and sets up the request handling endpoint.

```typescript
import { NextRequest } from "next/server";
import { MastraAgent } from "@ag-ui/mastra";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

export const POST = async (req: NextRequest) => {
  const mastraAgents = MastraAgent.getLocalAgents({
    mastra,
    agentId: "weatherAgent",
  });

  const runtime = new CopilotRuntime({
    agents: mastraAgents,
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

--------------------------------

### networkRoute() Utility

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Use the `networkRoute()` utility to create a route handler that automatically formats the agent network stream into an AI SDK-compatible format. This is suitable for network-related agent interactions.

```APIDOC
### `networkRoute()`

Use the `networkRoute()` utility to create a route handler that automatically formats the agent network stream into an AI SDK-compatible format.

#### Example Setup (`src/mastra/index.ts`)
```typescript
import { Mastra } from "@mastra/core";
import { networkRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  server: {
    apiRoutes: [
      networkRoute({
        path: "/network",
        agent: "weatherAgent",
      }),
    ],
  },
});
```

#### Usage with `useChat()` hook
```typescript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/network",
  }),
});
```
```

--------------------------------

### Create Next.js API Route for Weather Information (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

This TypeScript code defines a Next.js API route (`/api/test.ts`) that handles POST requests to fetch weather information for a given city using the Mastra AI agent. It requires the 'next' package for request/response handling and the 'mastra' library for agent interaction. The input is a JSON object with a 'city' property, and the output is the generated weather text.

```typescript
import type { NextApiRequest, NextApiResponse } from "next";

import { mastra } from "../../mastra";

export default async function getWeatherInfo(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const city = req.body.city;
  const agent = mastra.getAgent("weatherAgent");

  const result = await agent.generate(`What's the weather like in ${city}?`);

  return res.status(200).json(result.text);
}
```

--------------------------------

### Create a Mastra Agent with OpenAI Model

Source: https://mastra.ai/docs/v1/agents/overview

Defines a Mastra agent using the Agent class, specifying a unique ID, name, system instructions, and the OpenAI model to use. This agent is configured to interact with the 'openai/gpt-4o-mini' model.

```typescript
import { Agent } from "@mastra/core/agent";  
  
export const testAgent = new Agent({
  id: "test-agent",  
  name: "Test Agent",  
  instructions: "You are a helpful assistant.",  
  model: "openai/gpt-4o-mini",  
});  


```

--------------------------------

### Initialize Mastra with JwtAuth

Source: https://mastra.ai/docs/v1/auth/jwt

Demonstrates initializing the Mastra core with JWT authentication enabled. It uses the MastraJwtAuth class, requiring a JWT secret from environment variables.

```typescript
import { Mastra } from "@mastra/core";
import { MastraJwtAuth } from "@mastra/auth";

export const mastra = new Mastra({
  // ..
  server: {
    auth: new MastraJwtAuth({
      secret: process.env.MASTRA_JWT_SECRET,
    }),
  },
});
```

--------------------------------

### Configure OpenAI Provider in Weather Agent (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Modifies the weather agent's TypeScript code to correctly instantiate the OpenAI provider, passing the API key from Vite's environment variables for strict compatibility.

```typescript
- import { openai } from "@ai-sdk/openai";
+ import { createOpenAI } from "@ai-sdk/openai";

+ const openai = createOpenAI({
+   apiKey: import.meta.env?.OPENAI_API_KEY,
+   compatibility: "strict"
+ });

```

--------------------------------

### Add Mastra and Vercel Directories to .gitignore

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Updates the .gitignore file to exclude the '.mastra' and '.vercel' directories, ensuring these generated or temporary files are not committed to version control.

```gitignore
.mastra
.vercel

```

--------------------------------

### Configure Agent Model Based on RequestContext

Source: https://mastra.ai/docs/v1/agents/overview

Demonstrates how to dynamically configure the language model used by an agent based on request-specific values accessed via `RequestContext`. This allows for conditional model selection, such as choosing between different OpenAI models based on user tier.

```typescript
export type UserTier = {  
  "user-tier": "enterprise" | "pro";  
};  
  
export const testAgent = new Agent({  
  id: "test-agent",  
  name: "Test Agent",  
  // ...  
  model: ({ requestContext }) => {  
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];  
  
    return userTier === "enterprise"  
      ? openai("gpt-4o-mini")  
      : openai("gpt-4.1-nano");  
  },  
});
```

--------------------------------

### Add LibSQL Memory with Fastembed to Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-libsql

Configures a Mastra AI agent with LibSQL storage and Fastembed for local embeddings. This enables semantic recall by converting messages into vector embeddings.

```typescript
import { Memory } from "@mastra/memory";  
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";  
import { fastembed } from "@mastra/fastembed";  
  
export const libsqlAgent = new Agent({  
  id: "libsql-agent",  
  name: "LibSQL Agent",  
  instructions:  
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",  
  model: openai("gpt-4o"),  
  memory: new Memory({  
    storage: new LibSQLStore({  
      id: 'libsql-agent-storage',  
      url: "file:libsql-agent.db",  
    }),  
    vector: new LibSQLVector({  
      id: 'libsql-agent-vector',  
      connectionUrl: "file:libsql-agent.db",  
    }),  
    embedder: fastembed,  
    options: {  
      lastMessages: 10,  
      semanticRecall: {  
        topK: 3,  
        messageRange: 2,  
      },  
      threads: {  
        generateTitle: true, // Explicitly enable automatic title generation  
      },  
    },  
  }),  
});  


```

--------------------------------

### Call Agent Network (JavaScript)

Source: https://mastra.ai/docs/v1/agents/networks

Demonstrates how to call a Mastra agent network with a user message using the `.network()` method. It shows how to iterate over the returned stream of events to track progress and retrieve the final result.

```javascript
const result = await routingAgent.network(
  "Tell me three cool ways to use Mastra",
);

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

--------------------------------

### Environment Variables for Mastra MongoDB Integration

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-mongodb

Configuration for Mastra's MongoDB integration requires setting environment variables for OpenAI API key, MongoDB connection string, and database name. These are essential for the system to connect to the database and authenticate with OpenAI.

```env
OPENAI_API_KEY=<your-api-key>
MONGODB_URI=<your-connection-string>
MONGODB_DB_NAME=<your-db-name>
```

--------------------------------

### Langfuse Exporter Realtime Mode Configuration (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langfuse

Configures the Langfuse exporter for realtime mode, flushing traces after each event. Ideal for development and debugging purposes.

```javascript
new LangfuseExporter({  
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,  
  secretKey: process.env.LANGFUSE_SECRET_KEY!,  
  realtime: true, // Flush after each event  
});  
```

--------------------------------

### Configure Deepgram Voice

Source: https://mastra.ai/docs/v1/voice/overview

Sets up the Deepgram voice provider with speech and listening models. Requires Deepgram API key and supports parameters like model name, speaker, language, tone, and audio format.

```javascript
const voice = new DeepgramVoice({
  speechModel: {
    name: "nova-2", // Example model name
    speaker: "aura-english-us", // Example speaker name
    apiKey: process.env.DEEPGRAM_API_KEY,
    language: "en-US", // Language code
    tone: "formal", // Tone setting
  },
  listeningModel: {
    name: "nova-2", // Example model name
    format: "flac", // Audio format
  },
});
```

--------------------------------

### Create Astro Action for Weather Information

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Creates a new TypeScript file 'index.ts' within the 'src/actions' directory and defines an Astro Action named 'getWeatherInfo'. This action takes a city name as input and uses a Mastra agent to fetch weather details.

```typescript
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { mastra } from "../mastra";

export const server = {
  getWeatherInfo: defineAction({
    input: z.object({
      city: z.string(),
    }),
    handler: async (input) => {
      const city = inputData.city;
      const agent = mastra.getAgent("weatherAgent");

      const result = await agent.generate(
        `What's the weather like in ${city}?`,
      );

      return result.text;
    },
  }),
};

```

--------------------------------

### Configure Local Embeddings with Fastembed for Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-pg

Enhances the Mastra agent configuration to include local embeddings using `@mastra/fastembed`. This allows for semantic recall based on message meaning rather than keywords. It requires `PostgresStore` for storage and `PgVector` for vector operations, alongside the `fastembed` embedder.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { PostgresStore, PgVector } from "@mastra/pg";
import { fastembed } from "@mastra/fastembed";

export const pgAgent = new Agent({
  id: "pg-agent",
  name: "PG Agent",
  instructions:
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new PostgresStore({
      id: 'pg-agent-storage',
      connectionString: process.env.DATABASE_URL!,
    }),
    vector: new PgVector({
      id: 'pg-agent-vector',
      connectionString: process.env.DATABASE_URL!,
    }),
    embedder: fastembed,
    options: {
      lastMessages: 10,
      semanticRecall: {
        topK: 3,
        messageRange: 2,
      },
    },
  }),
});

```

--------------------------------

### Configure Speechify Voice

Source: https://mastra.ai/docs/v1/voice/overview

Initializes the Speechify voice provider, specifying the model, speaker, and language. Requires a Speechify API key and allows for speech speed adjustment. Speechify may not have a separate listening model.

```javascript
const voice = new SpeechifyVoice({
  speechModel: {
    name: "speechify-voice", // Example model name
    speaker: "matthew", // Example speaker name
    apiKey: process.env.SPEECHIFY_API_KEY,
    language: "en-US", // Language code
    speed: 1.0, // Speech speed
  },
  // Speechify may not have a separate listening model
});
```

--------------------------------

### Mastra AI Page with Form (Next.js App Router)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

A server component written in TypeScript for the Next.js App Router that renders a page with a form. It imports and displays the `Form` component, providing a UI for users to interact with the Mastra AI weather agent. This serves as the entry point for the test feature.

```typescript
import { Form } from "./form";  
  
export default async function Page() {  
  return (  
    <>  
      <h1>Test</h1>  
      <Form />  
    </>  
  );  
}  
```

--------------------------------

### Complete LangSmith Exporter Configuration Options (TypeScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/langsmith

Provides a comprehensive configuration for the LangSmith exporter, including API key, optional API URL, caller options (timeout, retries), logging level, and options to hide input/output data in the LangSmith UI. This allows for fine-grained control over data sent and exporter behavior.

```typescript
new LangSmithExporter({  
  // Required credentials  
  apiKey: process.env.LANGSMITH_API_KEY!,  
  
  // Optional settings  
  apiUrl: process.env.LANGSMITH_BASE_URL, // Default: https://api.smith.langchain.com  
  callerOptions: {  
    // HTTP client options  
    timeout: 30000, // Request timeout in ms  
    maxRetries: 3, // Retry attempts  
  },  
  logLevel: "info", // Diagnostic logging: debug | info | warn | error  
  
  // LangSmith-specific options  
  hideInputs: false, // Hide input data in UI  
  hideOutputs: false, // Hide output data in UI  
});  

```

--------------------------------

### Define Mastra Agent with Model Routing (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Defines a Mastra agent specifying an AI SDK-supported model. This allows Mastra to route requests to the appropriate AI model. No external dependencies beyond Mastra core are required for this basic definition.

```typescript
import { Agent } from "@mastra/core/agent";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: "Instructions for the agent...",
  model: "openai/gpt-4-turbo",
});

```

--------------------------------

### Retrieve Supabase Access Token (TypeScript)

Source: https://mastra.ai/docs/v1/auth/supabase

Shows how to authenticate a user with Supabase using email and password and retrieve the access token. This token is essential for making authenticated Mastra requests.

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("<supabase-url>", "<supabase-key>");

const authTokenResponse = await supabase.auth.signInWithPassword({
  email: "<user's email>",
  password: "<user's password>",
});

const accessToken = authTokenResponse.data?.session?.access_token;
```

--------------------------------

### Configure Resource-Scoped Working Memory (JavaScript)

Source: https://mastra.ai/docs/v1/memory/working-memory

This code configures resource-scoped working memory, which persists across all conversation threads for the same user. It initializes a Memory instance with a storage adapter and specifies working memory options, including enabling it, setting the scope to 'resource', and providing a markdown template for user profile information.

```javascript
const memory = new Memory({
  storage,
  options: {
    workingMemory: {
      enabled: true,
      scope: "resource", // Memory persists across all user threads
      template: "# User Profile  \n- **Name**:  \n- **Location**:  \n- **Interests**:  \n- **Preferences**:  \n- **Long-term Goals**:  \n",
    },
  },
});
```

--------------------------------

### Modify GitHub Actions Workflow for Mastra App Deployment

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/azure-app-services

This snippet shows modifications required for the GitHub Actions workflow file to correctly build and package Mastra applications for Azure App Services deployment. It specifically addresses updating the build step and the artifact zipping process to ensure only necessary build outputs are included.

```yaml
run: (cd .mastra/output && zip ../../release.zip -r .)

```

--------------------------------

### Chroma Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates the Chroma vector database using the @mastra/chroma library. It supports both local and cloud deployments. Initialization requires Chroma API credentials for cloud deployments. It creates an index and upserts vectors.

```typescript
import { ChromaVector } from "@mastra/chroma";

// Running Chroma locally
// const store = new ChromaVector()

// Running on Chroma Cloud
const store = new ChromaVector({
  id: 'chroma-vector',
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});

await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Create Astro API Endpoint for Weather Agent

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Defines a POST endpoint at `/api/test` that receives a city name, retrieves weather information using the Mastra weather agent, and returns the result as JSON. This endpoint serves as the backend for your weather query.

```typescript
import type { APIRoute } from "astro";

import { mastra } from "../../mastra";

export const POST: APIRoute = async ({ request }) => {
  const { city } = await new Response(request.body).json();
  const agent = mastra.getAgent("weatherAgent");

  const result = await agent.generate(`What's the weather like in ${city}?`);

  return new Response(JSON.stringify(result.text));
};

```

--------------------------------

### Next.js API Route for Remote Mastra Agents

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

A Next.js API route handler (`app/api/copilotkit/route.ts`) for connecting to remote Mastra agents. It uses `MastraClient` to fetch remote agents and then initializes the CopilotRuntime.

```typescript
import { MastraClient } from "@mastra/client-js";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const baseUrl = process.env.MASTRA_BASE_URL || "http://localhost:4111";
  const mastraClient = new MastraClient({ baseUrl });

  const mastraAgents = await MastraAgent.getRemoteAgents({ mastraClient });

  const runtime = new CopilotRuntime({
    agents: mastraAgents,
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

--------------------------------

### Infer Single Mastra Tool Types with InferUITool (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

The InferUITool type helper infers the input and output types of a single Mastra tool. It takes a Mastra tool definition as input and provides a type that represents the tool's input and output schemas. This is useful for ensuring type safety when interacting with individual tools.

```typescript
import { InferUITool, createTool } from "@mastra/core/tools";
import { z } from "zod";

const weatherTool = createTool({
  id: "get-weather",
  description: "Get the current weather",
  inputSchema: z.object({
    location: z.string().describe("The city and state"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
  }),
  execute: async (inputData) => {
    return {
      temperature: 72,
      conditions: "sunny",
    };
  },
});

// Infer the types from the tool
type WeatherUITool = InferUITool<typeof weatherTool>;
// This creates:
// {
//   input: { location: string };
//   output: { temperature: number; conditions: string };
// }
```

--------------------------------

### Querying Messages

Source: https://mastra.ai/docs/v1/server-db/storage

API endpoints for retrieving messages from threads, supporting pagination and querying by message IDs. Also includes utilities for converting messages to AI SDK formats for UI rendering.

```APIDOC
## Querying Messages

### Description
Messages are stored in the `MastraDBMessage` format, which provides a consistent structure across the entire Mastra system. This section details how to query messages, including pagination and conversion utilities.

### Method
`POST` (for `listMessages` and `listMessagesById`)

### Endpoint
`/storage/listMessages`
`/storage/listMessagesById`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **threadId** (string) - Required - The ID of the thread to retrieve messages from.
- **page** (integer) - Optional - The page number for pagination. Defaults to 0.
- **perPage** (integer) - Optional - The number of messages per page. Defaults to 50.
- **messageIds** (array of strings) - Required - An array of message IDs to retrieve.

#### Request Body
For `listMessages`:
- **threadId** (string) - Required - The ID of the thread.
- **page** (integer) - Optional - The page number.
- **perPage** (integer) - Optional - The number of messages per page.

For `listMessagesById`:
- **messageIds** (array of strings) - Required - An array of message IDs.

### Request Example
```javascript
// Get messages for a thread with pagination
const result = await mastra
  .getStorage()
  .listMessages({
    threadId: "your-thread-id",
    page: 0,
    perPage: 50
  });

console.log(result.messages); // MastraDBMessage[]
console.log(result.total); // Total count
console.log(result.hasMore); // Whether more pages exist

// Get messages by their IDs
const messages = await mastra
  .getStorage()
  .listMessagesById({ messageIds: messageIdArr });

// Convert to AI SDK v5 UIMessage format for UI rendering
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui';
const uiMessages = toAISdkV5Messages(result.messages);
```

### Response
#### Success Response (200)
- **messages** (array of MastraDBMessage) - An array of message objects.
- **total** (integer) - The total number of messages available.
- **hasMore** (boolean) - Indicates if there are more pages of messages.

#### Response Example
```json
{
  "messages": [
    {
      "id": "msg_123",
      "threadId": "thread_abc",
      "content": "Hello!",
      "sender": "user",
      "createdAt": 1678886400000
    }
  ],
  "total": 100,
  "hasMore": true
}
```
```

--------------------------------

### Basic Retrieval with Semantic Search

Source: https://mastra.ai/docs/v1/rag/retrieval

Demonstrates how to perform basic semantic search using vector similarity to retrieve relevant document chunks. It includes converting a user query to an embedding, querying a vector store, and displaying the results with text, score, and metadata.

```APIDOC
## Basic Retrieval with Semantic Search

### Description
This endpoint retrieves document chunks semantically similar to a given query using vector similarity. The process involves embedding the query, comparing it against stored embeddings in a vector store, and returning the top matching chunks along with their similarity scores and metadata.

### Method
POST (Implicit through `pgVector.query`)

### Endpoint
`/vectorStore/query` (Conceptual endpoint for vector store interaction)

### Parameters
#### Query Parameters
- **queryVector** (Array<Float>) - Required - The embedding vector of the user's query.
- **indexName** (String) - Required - The name of the index in the vector store to query.
- **topK** (Integer) - Required - The number of top results to retrieve.
- **filter** (Object) - Optional - Metadata filters to apply to the search.

### Request Example
```javascript
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { PgVector } from "@mastra/pg";

// Convert query to embedding
const { embedding } = await embed({
  value: "What are the main points in the article?",
  model: openai.embedding("text-embedding-3-small"),
});

// Query vector store
const pgVector = new PgVector({
  id: 'pg-vector',
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
});

// Display results
console.log(results);
```

### Response
#### Success Response (200)
- **text** (String) - The content of the retrieved document chunk.
- **score** (Float) - The similarity score between the query embedding and the chunk embedding.
- **metadata** (Object) - Associated metadata for the chunk.

#### Response Example
```json
[
  {
    "text": "Climate change poses significant challenges...",
    "score": 0.89,
    "metadata": { "source": "article1.txt" },
  },
  {
    "text": "Rising temperatures affect crop yields...",
    "score": 0.82,
    "metadata": { "source": "article1.txt" },
  }
]
```
```

--------------------------------

### OpenTelemetry Integration for Mastra Traces (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Seamlessly integrates Mastra traces into an OpenTelemetry observability platform. It retrieves the current OpenTelemetry span context and passes its `traceId` and `spanId` to Mastra's `tracingOptions`.

```javascript
import { trace } from "@opentelemetry/api";

// Get the current OpenTelemetry span
const currentSpan = trace.getActiveSpan();
const spanContext = currentSpan?.spanContext();

if (spanContext) {
  const result = await agent.generate(userMessage, {
    tracingOptions: {
      traceId: spanContext.traceId,
      parentSpanId: spanContext.spanId,
    },
  });
}
```

--------------------------------

### Use Agent with Text-to-Speech in JavaScript

Source: https://mastra.ai/docs/v1/voice/text-to-speech

Illustrates integrating TTS into a Mastra `Agent`. It shows how to initialize an agent with a voice provider and then use the `speak()` method to convert the agent's text response into an audio stream, with options for speaker and speech properties.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { OpenAIVoice } from "@mastra/voice-openai";

const voice = new OpenAIVoice();

const agent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice,
});

const { text } = await agent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const readableStream = await voice.speak(text, {
  speaker: "default", // Optional: specify a speaker
  properties: {
    speed: 1.0, // Optional: adjust speech speed
    pitch: "default", // Optional: specify pitch if supported
  },
});

```

--------------------------------

### Add MongoDB Memory to Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-mongodb

This TypeScript code demonstrates how to initialize a Mastra AI agent with MongoDB as its memory storage backend. It uses `MongoDBStore` and configures thread title generation.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { MongoDBStore } from "@mastra/mongodb";

export const mongodbAgent = new Agent({
  id: "mongodb-agent",
  name: "mongodb-agent",
  instructions:
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new MongoDBStore({
      url: process.env.MONGODB_URI!,
      dbName: process.env.MONGODB_DB_NAME!,
    }),
    options: {
      threads: {
        generateTitle: true,
      },
    },
  }),
});
```

--------------------------------

### Add Prebuilt Scorers to Agent

Source: https://mastra.ai/docs/v1/evals/overview

Demonstrates how to add prebuilt scorers, such as answer relevancy and toxicity, to an agent. It utilizes specific scorer creation functions and configures sampling rates for evaluation.

```typescript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import {  
  createAnswerRelevancyScorer,  
  createToxicityScorer,  
} from "@mastra/evals/scorers/prebuilt";  
  
export const evaluatedAgent = new Agent({  
  // ...  
  scorers: {  
    relevancy: {  
      scorer: createAnswerRelevancyScorer({ model: openai("gpt-4o-mini") }),  
      sampling: { type: "ratio", rate: 0.5 },  
    },  
    safety: {  
      scorer: createToxicityScorer({ model: openai("gpt-4o-mini") }),  
      sampling: { type: "ratio", rate: 1 },  
    },  
  },  
});  

```

--------------------------------

### Create Next.js Page for Weather Input and Display (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

This TypeScript code defines a React component for a Next.js page (`/test.tsx`) that allows users to input a city name and display the weather information fetched from the API. It uses the `useState` hook for managing the result and handles form submission to make a POST request to the `/api/test` endpoint. The component renders a form with an input field and a submit button, and displays the weather result in a `<pre>` tag.

```typescript
import { useState } from "react";

export default function Test() {
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const city = formData.get("city")?.toString();

    const response = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city })
    });

    const text = await response.json();
    setResult(text);
  }

  return (
    <>
      <h1>Test</h1>
      <form onSubmit={handleSubmit}>
        <input name="city" placeholder="Enter city" required />
        <button type="submit">Get Weather</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
}
```

--------------------------------

### Configure MastraClient with Function URL

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Initializes the MastraClient from the '@mastra/client-js' library. It requires the base URL of the deployed Lambda function, which should be replaced with the actual function URL.

```typescript
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: "https://your-function-url.lambda-url.us-east-1.on.aws",
});

```

--------------------------------

### Create CopilotKit Component (Next.js)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Defines a client-side React component for CopilotKit chat in a Next.js app. It sets up the CopilotKit provider and CopilotChat UI, requiring a runtime URL and agent name.

```tsx
'use client';
import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export function CopilotKitComponent({ runtimeUrl }: { runtimeUrl: string}) {
  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
      agent="weatherAgent"
    >
      <CopilotChat
        labels={{
          title: "Your Assistant",
          initial: "Hi! 👋 How can I assist you today?",
        }}
      />
    </CopilotKit>
  );
}
```

--------------------------------

### Astra Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates the Astra DB vector database using the @mastra/astra library. It initializes an AstraVector store with connection details and credentials, creates an index, and upserts vectors. Requires ASTRA_DB_TOKEN, ASTRA_DB_ENDPOINT, and ASTRA_DB_KEYSPACE environment variables.

```typescript
import { AstraVector } from "@mastra/astra";

const store = new AstraVector({
  token: process.env.ASTRA_DB_TOKEN,
  endpoint: process.env.ASTRA_DB_ENDPOINT,
  keyspace: process.env.ASTRA_DB_KEYSPACE,
});

await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});

await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Add Environment Variables to .env (Bash)

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/amazon-ec2

Adds essential environment variables, such as OPENAI_API_KEY, to the .env file. This is crucial for application configuration.

```bash
OPENAI_API_KEY=<your-openai-api-key>
# Add other required environment variables
```

--------------------------------

### Pipe agent text stream to workflow writer (JavaScript)

Source: https://mastra.ai/docs/v1/streaming/workflow-streaming

This code demonstrates integrating agent output into a workflow by piping the agent's `textStream` directly to the workflow step's `writer`. This allows for streaming partial agent responses as workflow results and automatically aggregates agent usage.

```javascript
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const testStep = createStep({
  // ...
  execute: async ({ inputData, mastra, writer }) => {
    const { city } = inputData;

    const testAgent = mastra?.getAgent("testAgent");
    const stream = await testAgent?.stream(`What is the weather in ${city}$?`);

    await stream!.textStream.pipeTo(writer!);

    return {
      value: await stream!.text,
    };
  },
});
```

--------------------------------

### Re-ranking Search Results with OpenAI

Source: https://mastra.ai/docs/v1/rag/retrieval

This code demonstrates how to re-rank initial search results obtained from a vector database using OpenAI's language models for more accurate relevance scoring. It requires initial results, a query, and a relevance scorer.

```javascript
import { openai } from "@ai-sdk/openai";  
import {  
  rerankWithScorer as rerank,  
  MastraAgentRelevanceScorer  
} from "@mastra/rag";  
  
// Get initial results from vector search  
const initialResults = await pgVector.query({  
  indexName: "embeddings",  
  queryVector: queryEmbedding,  
  topK: 10,  
});  
  
// Create a relevance scorer  
const relevanceProvider = new MastraAgentRelevanceScorer('relevance-scorer', openai("gpt-4o-mini"));  
  
// Re-rank the results  
const rerankedResults = await rerank({  
  results: initialResults,  
  query,  
  provider: relevanceProvider,  
  options: {  
    topK: 10,  
  },  
);

```

--------------------------------

### Authenticate with Cloudflare Wrangler CLI

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/cloudflare-deployer

Logs in and authenticates the user with Cloudflare using the Wrangler CLI. This is required for manual deployments.

```bash
npx wrangler login  

```

--------------------------------

### workflowRoute() Utility

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Use the `workflowRoute()` utility to create a route handler that automatically formats the workflow stream into an AI SDK-compatible format. This is useful for complex, multi-step processes.

```APIDOC
### `workflowRoute()`

Use the `workflowRoute()` utility to create a route handler that automatically formats the workflow stream into an AI SDK-compatible format.

#### Example Setup (`src/mastra/index.ts`)
```typescript
import { Mastra } from "@mastra/core";
import { workflowRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  server: {
    apiRoutes: [
      workflowRoute({
        path: "/workflow",
        agent: "weatherAgent",
      }),
    ],
  },
});
```

#### Usage with `useChat()` hook (for workflow)
```typescript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/workflow",
    prepareSendMessagesRequest({ messages }) {
      return {
        body: {
          inputData: {
            city: messages[messages.length - 1].parts[0].text,
          },
          //Or resumeData for resuming a suspended workflow
          resumeData: {
            confirmation: messages[messages.length - 1].parts[0].text
          }
        },
      };
    },
  }),
});
```
```

--------------------------------

### Create Weather Agent with OpenAI Model

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Defines a Mastra agent specialized for weather-related queries using the OpenAI 'gpt-4o-mini' model. It specifies instructions for the agent's behavior and integrates the previously defined `weatherTool` for fetching data.

```typescript
import { openai } from "@ai-sdk/openai";  
import { Agent } from "@mastra/core/agent";  
import { weatherTool } from "../tools/weather-tool";  
  
export const weatherAgent = new Agent({  
  id: "weather-agent",  
  name: "Weather Agent",  
  instructions: `  
      You are a helpful weather assistant that provides accurate weather information.  

      Your primary function is to help users get weather details for specific locations. When responding:  
      - Always ask for a location if none is provided  
      - If the location name isn't in English, please translate it  
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")  
      - Include relevant details like humidity, wind conditions, and precipitation  
      - Keep responses concise but informative  

      Use the weatherTool to fetch current weather data.  
`,  
  model: openai("gpt-4o-mini"),  
  tools: { weatherTool },  
});  

```

--------------------------------

### Build Docker Image Locally

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Builds the Docker image for the Mastra AI application locally using the project name defined in the environment variables. This command assumes a Dockerfile is present in the current directory.

```shell
docker build -t "$PROJECT_NAME" .

```

--------------------------------

### Cloudflare Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates with Cloudflare vector store using the @mastra/vectorize library. It initializes a CloudflareVector store using account ID and API token, creates an index, and upserts vectors. Requires CF_ACCOUNT_ID and CF_API_TOKEN environment variables.

```typescript
import { CloudflareVector } from "@mastra/vectorize";

const store = new CloudflareVector({
  accountId: process.env.CF_ACCOUNT_ID,
  apiToken: process.env.CF_API_TOKEN,
});
await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});
await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Create CopilotKit Component (React)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Defines a React component that integrates CopilotKit chat functionality. It requires a runtime URL and an agent name, and it initializes CopilotChat with custom labels.

```tsx
import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export function CopilotKitComponent({ runtimeUrl }: { runtimeUrl: string }) {
  return (
    <CopilotKit runtimeUrl={runtimeUrl} agent="weatherAgent">
      <CopilotChat
        labels={{
          title: "Your Assistant",
          initial: "Hi! 👋 How can I assist you today?",
        }}
      />
    </CopilotKit>
  );
}
```

--------------------------------

### Generate Agent Response with MastraClient in TypeScript

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Generates a response from a Mastra agent by sending an array of message objects. Handles potential errors during the generation process. Requires the MastraClient to be initialized.

```typescript
import { mastraClient } from "lib/mastra-client";  
  
const testAgent = async () => {  
  try {  
    const agent = mastraClient.getAgent("testAgent");  
  
    const response = await agent.generate({
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
    });

    console.log(response.text);
  } catch (error) {
    return "Error occurred while generating response";
  }
};

```

--------------------------------

### Pinecone Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This code snippet shows the creation of a RAG agent for Pinecone. It utilizes the OpenAI model and the Pinecone prompt, embedding the prompt within the agent's instructions alongside a vector query tool for enhanced context processing.

```typescript
import { openai } from "@ai-sdk/openai";
import { PINECONE_PROMPT } from "@mastra/pinecone";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${PINECONE_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Save Speech Output to a File (JavaScript)

Source: https://mastra.ai/docs/v1/agents/adding-voice

Shows how to save the audio generated by the agent's `speak` method to a file. It pipes the returned audio stream to a file write stream, ensuring the audio is saved locally.

```javascript
import { createWriteStream } from "fs";
import path from "path";

// Generate speech and save to file
const audio = await agent.voice.speak("Hello, World!");
const filePath = path.join(process.cwd(), "agent.mp3");
const writer = createWriteStream(filePath);

audio.pipe(writer);

await new Promise<void>((resolve, reject) => {
  writer.on("finish", () => resolve());
  writer.on("error", reject);
});

```

--------------------------------

### Use OpenAI Realtime Agent with STS

Source: https://mastra.ai/docs/v1/voice/speech-to-speech

Integrates the Agent with OpenAIRealtimeVoice for real-time speech capabilities. It connects to the voice service, listens for agent audio responses, plays them back, and sends continuous audio from the microphone. Requires @mastra/core, @mastra/voice-openai-realtime, and @mastra/node-audio.

```javascript
import { Agent } from "@mastra/core/agent";
import { OpenAIRealtimeVoice } from "@mastra/voice-openai-realtime";
import { playAudio, getMicrophoneStream } from "@mastra/node-audio";

const agent = new Agent({
  id: "agent",
  name: "OpenAI Realtime Agent",
  instructions: `You are a helpful assistant with real-time voice capabilities.`,
  model: openai("gpt-4o"),
  voice: new OpenAIRealtimeVoice(),
});

// Connect to the voice service
await agent.voice.connect();

// Listen for agent audio responses
agent.voice.on("speaker", ({ audio }) => {
  playAudio(audio);
});

// Initiate the conversation
await agent.voice.speak("How can I help you today?");

// Send continuous audio from the microphone
const micStream = getMicrophoneStream();
await agent.voice.send(micStream);
```

--------------------------------

### Configure Batch Processing for Arize Exporter (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Configures batch processing options for the Arize Exporter, specifically focusing on Phoenix endpoint. This allows control over the number of spans to batch (`batchSize`) and the maximum time to wait before exporting (`timeout`).

```javascript
new ArizeExporter({  
  endpoint: process.env.PHOENIX_ENDPOINT!,  
  apiKey: process.env.PHOENIX_API_KEY,  
  
  // Batch processing configuration  
  batchSize: 512, // Number of spans to batch (default: 512)  
  timeout: 30000, // Max time in ms to wait before export (default: 30000)  
});  
```

--------------------------------

### Mark a Specific Tool for Approval in Mastra AI

Source: https://mastra.ai/docs/v1/agents/human-in-the-loop-with-tools

Marks an individual tool with `requireApproval: true` during creation. The agent will pause execution only when this specific tool is invoked, allowing for granular control. Requires the Mastra AI SDK and Zod for schema definition.

```typescript
const findUserTool = createTool({
  id: "Find user tool",
  description: "Returns the name and email for a matching user",
  inputSchema: z.object({
    name: z.string(),
  }),
  execute: async (inputData) => {
    return mockFindUser(inputData);
  },
  requireApproval: true,
});

```

--------------------------------

### Analyze Step: LLM Prompt Object for Gluten Analysis (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Uses prompt objects with LLMs for analysis. It defines a description, an output schema using Zod, and a function to create the prompt for analyzing recipe gluten content.

```javascript
const glutenCheckerScorer = createScorer({...})
.preprocess(...)
.analyze({
  description: 'Analyze recipe for gluten content',
  outputSchema: z.object({
    isGlutenFree: z.boolean(),
    glutenSources: z.array(z.string()),
    confidence: z.number().min(0).max(1)
  }),
  createPrompt: ({ run, results }) => `  
    Analyze this recipe for gluten content:  
    "${results.preprocessStepResult.recipeText}"  

    Look for wheat, barley, rye, and hidden sources like soy sauce.  
    Return JSON with isGlutenFree, glutenSources array, and confidence (0-1).  
  `
})

```

--------------------------------

### Streaming Custom Data Parts from Tool Execution

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

This snippet demonstrates how to emit custom UI message parts from within a tool's `execute` function using the `writer.custom()` method. It shows sending a 'data-tool-progress' part with a 'pending' status before an asynchronous operation (like a fetch request) and another with a 'success' status afterward. This allows for real-time progress updates to be sent to the client.

```typescript
import { createTool } from "@mastra/core/tools";  
  
export const testTool = createTool({  
  // ...  
  execute: async ({ context, writer }) => {  
    const { value } = context;  
  
   await writer?.custom({  
      type: "data-tool-progress",  
      status: "pending"  
    });  
  
    const response = await fetch(...);  
  
   await writer?.custom({  
      type: "data-tool-progress",  
      status: "success"  
    });  
  
    return {  
      value: ""  
    };  
  }  
});  

```

--------------------------------

### Querying Messages from MastraDB

Source: https://mastra.ai/docs/v1/server-db/storage

Demonstrates how to retrieve messages from MastraDB, supporting pagination and retrieval by specific message IDs. The `listMessages` function takes `threadId`, `page`, and `perPage` as arguments, returning messages along with pagination metadata. `listMessagesById` retrieves messages based on an array of message IDs. All queries return messages in `MastraDBMessage[]` format.

```javascript
const result = await mastra
  .getStorage()
  .listMessages({
    threadId: "your-thread-id",
    page: 0,
    perPage: 50
  });

console.log(result.messages); // MastraDBMessage[]
console.log(result.total); // Total count
console.log(result.hasMore); // Whether more pages exist

// Get messages by their IDs
const messages = await mastra
  .getStorage()
  .listMessagesById({ messageIds: messageIdArr });

```

--------------------------------

### Pinecone Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates the Pinecone vector database using the @mastra/pinecone library. It initializes a PineconeVector store, creates an index with a specified dimension, and upserts vectors with metadata. Requires PINECONE_API_KEY environment variable.

```typescript
import { PineconeVector } from "@mastra/pinecone";

const store = new PineconeVector({
  id: 'pinecone-vector',
  apiKey: process.env.PINECONE_API_KEY,
});
await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});
await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Define Agent with Tools in Mastra

Source: https://mastra.ai/docs/v1/streaming/tool-streaming

This code defines a Mastra agent that utilizes a specific tool. It sets up the agent's ID, name, instructions, model, and available tools. This is a foundational step for integrating tools into agent workflows.

```typescript
import { openai } from "@ai-sdk/openai";  
import { Agent } from "@mastra/core/agent";  
  
import { testTool } from "../tools/test-tool";  
  
export const testAgent = new Agent({
  id: "test-agent",  
  name: "Test Agent",  
  instructions: "You are a weather agent.",  
  model: openai("gpt-4o-mini"),  
  tools: { testTool },  
});  

```

--------------------------------

### Basic Semantic Search with Mastra and PgVector

Source: https://mastra.ai/docs/v1/rag/retrieval

Performs a basic semantic search by converting a user query into an embedding and comparing it to stored embeddings in a PgVector store. It retrieves the top K most similar chunks along with their text content, similarity score, and metadata. Dependencies include '@ai-sdk/openai', 'ai', and '@mastra/pg'.

```typescript
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { PgVector } from "@mastra/pg";

// Convert query to embedding
const { embedding } = await embed({
  value: "What are the main points in the article?",
  model: openai.embedding("text-embedding-3-small"),
});

// Query vector store
const pgVector = new PgVector({
  id: 'pg-vector',
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
});

// Display results
console.log(results);

/*
Example results:
[
  {
    text: "Climate change poses significant challenges...",
    score: 0.89,
    metadata: { source: "article1.txt" },
  },
  {
    text: "Rising temperatures affect crop yields...",
    score: 0.82,
    metadata: { source: "article1.txt" },
  },
  // ... more results
];
*/
```

--------------------------------

### Populate RequestContext via Mastra Server Middleware

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Illustrates how to set custom data into the `RequestContext` using server middleware in Mastra. This allows for dynamic data injection based on request properties, leveraging `@mastra/core`.

```typescript
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  agents: { weatherAgent },
  server: {
    middleware: [
      async (c, next) => {
        const requestContext = c.get("requestContext");

        if (c.req.method === "POST") {
          try {
            const clonedReq = c.req.raw.clone();
            const body = await clonedReq.json();

            if (body?.data) {
              for (const [key, value] of Object.entries(body.data)) {
                requestContext.set(key, value);
              }
            }
          } catch {}
        }
        await next();
      },
    ],
  },
});

```

--------------------------------

### Register Mastra API Routes (Server/NextJS)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/cedar-os

Register API routes in your Mastra server or NextJS serverless routes for handling chat requests. This includes endpoints for non-streaming POST requests and streaming Server-Sent Events (SSE).

```javascript
import { registerApiRoute } from "@mastra/core/server";  

// POST /chat  
// The chat's non-streaming default endpoint  
registerApiRoute("/chat", {  
  method: "POST",  
  // …validate input w/ zod  
  handler: async (c) => {  
    /* your agent.generate() logic */  
  },
});  

// POST /chat/stream (SSE)  
// The chat's streaming default endpoint  
registerApiRoute("/chat/stream", {  
  method: "POST",  
  handler: async (c) => {  
    /* stream agent output in SSE format */  
  },
});

```

--------------------------------

### Configure OpenAI Voice

Source: https://mastra.ai/docs/v1/voice/overview

Configures the OpenAI voice provider with specified speech and listening models. Requires OpenAI API key and accepts parameters for model name, language, voice type, speaker, and audio format.

```javascript
const voice = new OpenAIVoice({
  speechModel: {
    name: "gpt-3.5-turbo", // Example model name
    apiKey: process.env.OPENAI_API_KEY,
    language: "en-US", // Language code
    voiceType: "neural", // Type of voice model
  },
  listeningModel: {
    name: "whisper-1", // Example model name
    apiKey: process.env.OPENAI_API_KEY,
    language: "en-US", // Language code
    format: "wav", // Audio format
  },
  speaker: "alloy", // Example speaker name
});
```

--------------------------------

### Mastra AI Form Component with Action (Next.js App Router)

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

A client component written in TypeScript for the Next.js App Router that renders a form. It uses the `getWeatherInfo` server action to fetch and display weather data based on user input. This showcases client-server interaction using server actions.

```typescript
"use client";  
  
import { useState } from "react";  
import { getWeatherInfo } from "./action";  
  
export function Form() {  
  const [result, setResult] = useState<string | null>(null);  
  
  async function handleSubmit(formData: FormData) {  
    const res = await getWeatherInfo(formData);  
    setResult(res);  
  }  
  
  return (  
    <>  
      <form action={handleSubmit}>  
        <input name="city" placeholder="Enter city" required />  
        <button type="submit">Get Weather</button>  
      </form>  
      {result && <pre>{result}</pre>}  
    </>  
  );  
}  
```

--------------------------------

### Configure External Storage for Mastra on Lambda

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Configures an external storage provider, like Turso, for Mastra applications on AWS Lambda to ensure data persistence across invocations. Requires setting the TURSO_AUTH_TOKEN environment variable.

```typescript
import { LibSQLStore } from "@mastra/libsql";

const storage = new LibSQLStore({
  id: 'mastra-storage',
  url: "libsql://your-database.turso.io", // External Turso database
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

--------------------------------

### Re-ranking with ZeroEntropy Provider

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet illustrates using ZeroEntropy for re-ranking search results, offering another alternative to OpenAI or Cohere for semantic relevance scoring.

```javascript
const relevanceProvider = new ZeroEntropyRelevanceScorer("zerank-1");  

```

--------------------------------

### Configure Mastra Agent with OpenRouter

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/openrouter

Configures a Mastra agent to use the OpenRouter service. It sets up the OpenRouter client with an API key from environment variables and specifies the model to be used.

```typescript
import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const assistant = new Agent({
  id: "assistant",
  name: "assistant",
  instructions: "You are a helpful assistant.",
  model: openrouter("anthropic/claude-sonnet-4"),
});
```

--------------------------------

### Configure In-Memory Storage for Mastra

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Sets up an in-memory storage provider for Mastra applications deployed on AWS Lambda. This is the simplest configuration and suitable when data persistence across invocations is not required.

```typescript
import { LibSQLStore } from "@mastra/libsql";

const storage = new LibSQLStore({
  id: 'mastra-storage',
  url: ":memory:", // in-memory storage
});
```

--------------------------------

### Log from Workflow Step using Mastra Logger (TypeScript)

Source: https://mastra.ai/docs/v1/logging

Shows how to access and use the logger instance within a workflow step's execute function. The logger supports 'debug', 'info', 'warn', and 'error' levels.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";  
import { z } from "zod";  
  
const step1 = createStep({"  
  //...  
  execute: async ({ mastra }) => {  
  
    const logger = mastra.getLogger();  
    logger.info("workflow info log");  
  
    return {  
      output: ""  
    };  
  }"  
});  
  
export const testWorkflow = createWorkflow({...})  
  .then(step1)  
  .commit();  

```

--------------------------------

### Astra Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet showcases the implementation of a RAG agent tailored for Astra. It leverages the OpenAI model and the Astra prompt within the agent's instructions, ensuring effective context processing and query handling via a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { ASTRA_PROMPT } from "@mastra/astra";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${ASTRA_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Environment Variable for Mastra Cloud Access Token

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/cloud

Shows the format for setting the Mastra Cloud access token as an environment variable. This token is required for authentication when sending traces to Mastra Cloud.

```dotenv
MASTRA_CLOUD_ACCESS_TOKEN=mst_xxxxxxxxxxxxxxxx
```

--------------------------------

### Register Workflow in Mastra Instance

Source: https://mastra.ai/docs/v1/workflows/overview

Illustrates how to register a workflow within the Mastra instance. This makes the workflow accessible throughout the application and grants it access to shared resources like logging and observability features. Workflows can then be invoked from agents or tools.

```typescript
import { Mastra } from "@mastra/core/mastra";
import { testWorkflow } from "./workflows/test-workflow";

export const mastra = new Mastra({
  // ...
  workflows: { testWorkflow },
});
```

--------------------------------

### Understanding runEvals Results Structure

Source: https://mastra.ai/docs/v1/evals/running-in-ci

This JSON object illustrates the structure of the data returned by the `runEvals` function. It includes an object `scores` containing average scores for each scorer, and a `summary` object with details like the `totalItems` processed.

```json
{
  "scores": {
    "location-accuracy": 1.0,  // Average score across all items
    "another-scorer": 0.85
  },
  "summary": {
    "totalItems": 3
  }
}
```

--------------------------------

### Serve Custom Inngest Functions with Mastra Workflows (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This code snippet shows how to integrate custom Inngest functions into a Mastra application. By passing an array of custom functions to the `functions` parameter of `inngestServe`, both Mastra workflows and custom functions are served on the same API endpoint. This requires importing `inngestServe` and the custom functions.

```typescript
import { Mastra } from "@mastra/core";
import { serve as inngestServe } from "@mastra/inngest";
import { incrementWorkflow } from "./workflows";
import { inngest } from "./inngest";
import {
  customEmailFunction,
  customWebhookFunction,
} from "./inngest/custom-functions";

export const mastra = new Mastra({
  workflows: {
    incrementWorkflow,
  },
  server: {
    host: "0.0.0.0",
    apiRoutes: [
      {
        path: "/api/inngest",
        method: "ALL",
        createHandler: async ({ mastra }) =>
          inngestServe({
            mastra,
            inngest,
            functions: [customEmailFunction, customWebhookFunction], // Add your custom functions
          }),
      },
    ],
  },
});
```

--------------------------------

### Define Narrative Working Memory Template

Source: https://mastra.ai/docs/v1/memory/working-memory

This JavaScript code illustrates setting up a Memory object with a narrative-style Markdown template for working memory. It's designed to capture important user details in a short paragraph format.

```javascript
const paragraphMemory = new Memory({
  options: {
    workingMemory: {
      enabled: true,
      template: `Important Details:\n\nKeep a short paragraph capturing the user's important facts (name, main goal, current task).`,
    },
  },
});
```

--------------------------------

### Make Authenticated Agent Request with MastraClient (React)

Source: https://mastra.ai/docs/v1/auth/supabase

A React component demonstrating how to use the configured MastraClient to call a Mastra agent. It retrieves an agent and calls its generate method with messages.

```typescript
import { mastraClient } from "../../lib/mastra-client";

export const TestAgent = () => {
  async function handleClick() {
    const agent = mastraClient.getAgent("weatherAgent");

    const response = await agent.generate({
      messages: "What's the weather like in New York"
    });

    console.log(response);
  }

  return <button onClick={handleClick}>Test Agent</button>;
};
```

--------------------------------

### Require Approval for All Tools in Mastra AI Stream

Source: https://mastra.ai/docs/v1/agents/human-in-the-loop-with-tools

Enforces approval on every tool invocation by setting `requireToolApproval: true` during agent stream initiation. Use `approveToolCall` or `declineToolCall` with the `runId` to manage the tool call. Requires the Mastra AI SDK.

```typescript
const stream = await myAgent.stream("Find the user with name - John Smith", {  
  requireToolApproval: true,  
});  

const approvedToolCallStream = await myAgent.approveToolCall({ runId: stream.runId });  
const declinedToolCallStream = await myAgent.declineToolCall({ runId: stream.runId });  
```

--------------------------------

### Log with Additional Data using Mastra Logger (TypeScript)

Source: https://mastra.ai/docs/v1/logging

Demonstrates logging a message with an associated data object, such as an agent instance. This provides richer context for log entries.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";  
import { z } from "zod";  
  
const step1 = createStep({"  
  //...  
  execute: async ({ mastra }) => {  
  
    const testAgent = mastra.getAgent("testAgent");  
  
    const logger = mastra.getLogger();  
    logger.info("workflow info log", { agent: testAgent });  
  
    return {  
      output: ""  
    };  
  }"  
});  
  
export const testWorkflow = createWorkflow({...})  
  .then(step1)  
  .commit();  

```

--------------------------------

### Use Chat Hook for Network Route (JavaScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Sets up the `useChat()` hook to communicate with a network API endpoint using `DefaultChatTransport`. This is a straightforward configuration for streaming agent network data. The API endpoint is specified as `http://localhost:4111/network`.

```javascript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/network",
  }),
});

```

--------------------------------

### Authenticate and Call Mastra AI Agent with WorkOS (Node.js)

Source: https://mastra.ai/docs/v1/auth/workos

This Node.js function demonstrates how to use WorkOS to authenticate and obtain an access token, which is then used to configure the MastraClient for making authenticated agent requests. It requires WorkOS API key, authentication code, and client ID as inputs, and returns the generated text from the weather agent.

```typescript
import { WorkOS } from '@workos-inc/node';
import { MastraClient } from '@mastra/client-js';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export const callMastraWithWorkos = async (code: string, clientId: string) => {
  const authenticationResponse = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });

  const token = authenticationResponse.accessToken;

  const mastra = new MastraClient({
    baseUrl: "http://localhost:4111",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const weatherAgent = mastra.getAgent("weatherAgent");
  const response = await weatherAgent.generate({
    messages: "What's the weather like in Nairobi",
  });

  return response.text;
};

```

--------------------------------

### Initialize Mastra with Firebase Auth (Environment Variables)

Source: https://mastra.ai/docs/v1/auth/firebase

Initializes the Mastra server with Firebase authentication using environment variables. It automatically reads FIREBASE_SERVICE_ACCOUNT and FIRESTORE_DATABASE_ID.

```typescript
import { Mastra } from "@mastra/core";  
import { MastraAuthFirebase } from "@mastra/auth-firebase";  
  
// Automatically uses FIREBASE_SERVICE_ACCOUNT and FIRESTORE_DATABASE_ID env vars  
export const mastra = new Mastra({  
  // ..  
  server: {  
    auth: new MastraAuthFirebase(),  
  },  
});  

```

--------------------------------

### Use Listen Method for STT in Mastra Agent

Source: https://mastra.ai/docs/v1/voice/speech-to-text

Illustrates how to use the `listen()` method within a Mastra agent to convert an audio stream from a microphone into text. It includes setting up the agent, obtaining an audio stream, and processing the transcript.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { OpenAIVoice } from "@mastra/voice-openai";
import { getMicrophoneStream } from "@mastra/node-audio";

const voice = new OpenAIVoice();

const agent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that provides recommendations based on user input.",
  model: openai("gpt-4o"),
  voice,
});

const audioStream = getMicrophoneStream(); // Assume this function gets audio input

const transcript = await agent.voice.listen(audioStream, {
  filetype: "m4a", // Optional: specify the audio file type
});

console.log(`User said: ${transcript}`);

const { text } = await agent.generate(
  `Based on what the user said, provide them a recommendation: ${transcript}`,
);

console.log(`Recommendation: ${text}`);

```

--------------------------------

### Randomly Sample Traces by Percentage (Ratio Sampling)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Randomly samples a percentage of traces, ideal for production environments needing statistical insights. The probability value ranges from 0 (no traces) to 1 (all traces).

```yaml
sampling: {
  type: 'ratio',
  probability: 0.1  // Sample 10% of traces
}
```

--------------------------------

### Advanced Configuration: Model-specific Options for OpenRouter

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/openrouter

Shows how to pass model-specific configuration options directly when defining the model for an agent. This allows for fine-tuning parameters for a particular model, like setting `max_tokens`.

```typescript
import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const assistant = new Agent({
  id: "assistant",
  name: "assistant",
  instructions: "You are a helpful assistant.",
  model: openrouter("anthropic/claude-sonnet-4", {
    extraBody: {
      reasoning: {
        max_tokens: 10,
      },
    },
  }),
});
```

--------------------------------

### Setting Initial Working Memory via Thread Metadata (TypeScript)

Source: https://mastra.ai/docs/v1/memory/working-memory

Demonstrates how to set initial working memory for a thread when creating it. This injects user data like name, preferences, or other critical information that the agent needs access to without being passed in every request. The working memory is stored within the thread's metadata.

```typescript
const thread = await memory.createThread({
  threadId: "thread-123",
  resourceId: "user-456",
  title: "Medical Consultation",
  metadata: {
    workingMemory: `# Patient Profile  
- Name: John Doe  
- Blood Type: O+  
- Allergies: Penicillin  
- Current Medications: None  
- Medical History: Hypertension (controlled)  
`,
  },
});

// The agent will now have access to this information in all messages
await agent.generate("What's my blood type?", {
  threadId: thread.id,
  resourceId: "user-456",
});
// Response: "Your blood type is O+."
```

--------------------------------

### Couchbase Vector Store Integration (TypeScript)

Source: https://mastra.ai/docs/v1/rag/vector-databases

Integrates the Couchbase vector database using the @mastra/couchbase library. It initializes a CouchbaseVector store with connection details and credentials, creates an index, and upserts vectors. Requires COUCHBASE_CONNECTION_STRING, COUCHBASE_USERNAME, COUCHBASE_PASSWORD, COUCHBASE_BUCKET, COUCHBASE_SCOPE, and COUCHBASE_COLLECTION environment variables.

```typescript
import { CouchbaseVector } from "@mastra/couchbase";

const store = new CouchbaseVector({
  connectionString: process.env.COUCHBASE_CONNECTION_STRING,
  username: process.env.COUCHBASE_USERNAME,
  password: process.env.COUCHBASE_PASSWORD,
  bucketName: process.env.COUCHBASE_BUCKET,
  scopeName: process.env.COUCHBASE_SCOPE,
  collectionName: process.env.COUCHBASE_COLLECTION,
});
await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});
await store.upsert({
  indexName: "myCollection",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
```

--------------------------------

### Define Weather Tool (TypeScript)

Source: https://mastra.ai/docs/v1/agents/networks

Defines a weather tool using Mastra's `createTool` function. It includes an ID, a description of its purpose, and input/output schemas defined with Zod. This tool retrieves current weather information.

```typescript
export const weatherTool = createTool({
  id: "weather-tool",
  description: ` Retrieves current weather information using the wttr.in API.  
    Accepts a city or location name as input and returns a short weather summary.  
    Use this tool whenever up-to-date weather data is requested.  
  `,
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
  // ...
});
```

--------------------------------

### Configure PlayAI Voice

Source: https://mastra.ai/docs/v1/voice/overview

Configures the PlayAI voice provider, specifying the model, speaker, and language. It requires a PlayAI API key and allows adjustment of speech speed. PlayAI may not have a distinct listening model.

```javascript
const voice = new PlayAIVoice({
  speechModel: {
    name: "playai-voice", // Example model name
    speaker: "emma", // Example speaker name
    apiKey: process.env.PLAYAI_API_KEY,
    language: "en-US", // Language code
    speed: 1.0, // Speech speed
  },
  // PlayAI may not have a separate listening model
});
```

--------------------------------

### Upstash Storage Integration for Mastra Snapshots

Source: https://mastra.ai/docs/v1/workflows/snapshots

Shows how to configure Mastra to use Upstash (Redis) for storing workflow snapshots. Requires Redis URL and token for authentication.

```typescript
import { Mastra } from "@mastra/core";
import { UpstashStore } from "@mastra/upstash";

export const mastra = new Mastra({
  // ...
  storage: new UpstashStore({
  id: 'mastra-storage',
    url: "<upstash-redis-rest-url>",
    token: "<upstash-redis-rest-token>",
  }),
});
```

--------------------------------

### Configure Dedicated LibSQL Storage for an Agent

Source: https://mastra.ai/docs/v1/memory/overview

Assigns dedicated LibSQL file-based storage to an agent's memory. This isolates the agent's memory, conversations, and recalled information from other agents.

```typescript
import { Memory } from "@mastra/memory";  
import { Agent } from "@mastra/core/agent";  
import { LibSQLStore } from "@mastra/libsql";  

export const testAgent = new Agent({
  id: "test-agent",
  // ...  
  memory: new Memory({
    // ...  
    storage: new LibSQLStore({
      id: 'test-agent-storage',
      url: "file:agent-memory.db",
    }),
    // ...  
  }),
});

```

--------------------------------

### Text-to-Speech (TTS) Configuration

Source: https://mastra.ai/docs/v1/voice/text-to-speech

This section details how to configure the Text-to-Speech (TTS) provider in Mastra, including specifying the speech model and speaker options.

```APIDOC
## Configuration

To use TTS in Mastra, you need to provide a `speechModel` when initializing the voice provider. This includes parameters such as:
  * **`name`**: The specific TTS model to use.
  * **`apiKey`**: Your API key for authentication.
  * **Provider-specific options** : Additional options that may be required or supported by the specific voice provider.

The **`speaker`** option allows you to select different voices for speech synthesis. Each provider offers a variety of voice options with distinct characteristics for **Voice diversity**, **Quality**, **Voice personality**, and **Multilingual support**

**Note**: All of these parameters are optional. You can use the default settings provided by the voice provider, which will depend on the specific provider you are using.

```javascript
const voice = new OpenAIVoice({
  speechModel: {
    name: "tts-1-hd",
    apiKey: process.env.OPENAI_API_KEY,
  },
  speaker: "alloy",
});

// If using default settings the configuration can be simplified to:
const voice = new OpenAIVoice();
```
```

--------------------------------

### Define Weather Agent (weather-agent.ts)

Source: https://mastra.ai/docs/v1/getting-started/installation

Defines a Mastra agent responsible for providing weather information. It includes instructions, specifies the model, and integrates the weatherTool.

```typescript
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
  `,
  model: "google/gemini-2.5-pro",
  tools: { weatherTool },
});
```

--------------------------------

### Dynamic Model and Instructions for Title Generation

Source: https://mastra.ai/docs/v1/memory/threads-and-resources

This code configures dynamic model and instruction selection for thread title generation using functions. These functions can adapt the model and instructions based on request context, such as user tier or language, allowing for personalized title generation.

```javascript
export const testAgent = new Agent({  
  // ...  
  memory: new Memory({  
    options: {  
      threads: {  
        generateTitle: {  
          model: ({ requestContext }) => {  
            const userTier = requestContext.get("userTier");  
            return userTier === "premium"  
              ? openai("gpt-4.1")  
              : openai("gpt-4.1-nano");  
          },  
          instructions: ({ requestContext }) => {  
            const language = requestContext.get("userLanguage") || "English";  
            return `Generate a concise, engaging title in ${language} based on the user's first message.`;  
          },  
        },  
      },  
    },  
  }),  
});  
```

--------------------------------

### Create a Mastra Workflow Step

Source: https://mastra.ai/docs/v1/workflows/overview

Defines a single step within a Mastra workflow using `createStep`. It specifies input and output schemas using Zod for data validation and an `execute` function containing the step's business logic. This function can call external APIs, agents, or tools.

```typescript
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

const step1 = createStep({
  id: "step-1",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    formatted: z.string()
  }),
  execute: async ({ inputData }) => {
    const { message } = inputData;

    return {
      formatted: message.toUpperCase()
    };
  }
});
```

--------------------------------

### Inspect Workflow Streams with for await

Source: https://mastra.ai/docs/v1/streaming/events

Iterate over a workflow's stream using a `for await...of` loop to inspect all emitted event chunks. This code demonstrates creating a workflow run, streaming its output, and logging each chunk.

```javascript
const testWorkflow = mastra.getWorkflow("testWorkflow");

const run = await testWorkflow.createRun();

const stream = await run.stream({
  inputData: {
    value: "initial data",
  },
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

--------------------------------

### Implement Custom Sampling Logic

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Implements custom sampling logic based on request context, metadata, or business rules. Perfect for complex scenarios like sampling based on user tier or request type.

```javascript
sampling: {
  type: 'custom',
  sampler: (options) => {
    // Sample premium users at higher rate
    if (options?.metadata?.userTier === 'premium') {
      return Math.random() < 0.5; // 50% sampling
    }

    // Default 1% sampling for others
    return Math.random() < 0.01;
  }
}
```

--------------------------------

### Configure MastraClient with Supabase Bearer Token (TypeScript)

Source: https://mastra.ai/docs/v1/auth/supabase

Configures the MastraClient to include the Supabase access token in the Authorization header for authenticated requests. The token must be prefixed with 'Bearer '.

```typescript
import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: "https://<mastra-api-url>",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

--------------------------------

### Batching Streamed Output with BatchPartsProcessor (TypeScript)

Source: https://mastra.ai/docs/v1/agents/guardrails

The BatchPartsProcessor combines multiple stream parts before emitting them to the client. This reduces network overhead and improves user experience by consolidating small chunks into larger batches. It requires configuration for batchSize, maxWaitTime, and emitOnNonText.

```TypeScript
import { BatchPartsProcessor } from "@mastra/core/processors";  
  
export const batchedAgent = new Agent({
  id: "batched-agent",
  name: "Batched Agent",
  // ...
  outputProcessors: [
    new BatchPartsProcessor({
      batchSize: 5,
      maxWaitTime: 100,
      emitOnNonText: true,
    }),
  ],
});
```

--------------------------------

### Weather Tool

Source: https://mastra.ai/docs/v1/agents/networks

Defines a tool for retrieving current weather information using the wttr.in API. It accepts a location and returns a weather summary.

```APIDOC
## Tool: weather-tool

### Description
Retrieves current weather information using the wttr.in API. Accepts a city or location name as input and returns a short weather summary. Use this tool whenever up-to-date weather data is requested.

### Method
Not applicable (Tool definition)

### Endpoint
Not applicable (Tool definition)

### Parameters
#### Input Schema
- **location** (string) - Required - The city or location name for which to retrieve weather information.

#### Output Schema
- **weather** (string) - Description of the current weather conditions.
```

--------------------------------

### Cancel Agent Generation with AbortController in Mastra

Source: https://mastra.ai/docs/v1/tools-mcp/advanced-usage

Shows how to initiate an agent interaction with an AbortSignal and how to cancel it using an AbortController. When the controller's `abort()` method is called, the agent generation process, including any ongoing tool executions that forward the signal, will be terminated. Errors related to abortion are caught and handled.

```typescript
import { Agent } from "@mastra/core/agent";
// Assume 'agent' is an Agent instance with longRunningTool configured

const controller = new AbortController();

// Start the agent call
const promise = agent.generate("Perform the long computation.", {
  abortSignal: controller.signal,
});

// Sometime later, if needed:
// controller.abort();

try {
  const result = await promise;
  console.log(result.text);
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Agent generation was aborted.");
  } else {
    console.error("An error occurred:", error);
  }
}
```

--------------------------------

### GenerateReason Step: LLM Prompt Object for Explanation (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Uses prompt objects with LLMs for generating explanations. It defines a description and a function to create a prompt for explaining the gluten assessment score.

```javascript
const glutenCheckerScorer = createScorer({...})
.preprocess(...)
.analyze(...)
.generateScore(...)
.generateReason({
  description: 'Explain the gluten assessment',
  createPrompt: ({ results, score }) => `  
    Explain why this recipe received a score of ${score}.  
    Analysis: ${JSON.stringify(results.analyzeStepResult)}  

    Provide a clear explanation for someone with dietary restrictions.  
  `
})

```

--------------------------------

### Configure Memory with Thread and Resource IDs

Source: https://mastra.ai/docs/v1/memory/threads-and-resources

This code snippet demonstrates how to configure memory with specific thread and resource IDs when streaming a message to an agent. Both `thread` and `resource` must be provided for agents to store and recall information.

```javascript
const stream = await agent.stream("message for agent", {  
  memory: {  
    thread: "conversation-123",  
    resource: "user-123",  
  },  
});  
```

--------------------------------

### Configure MastraClient with Firebase ID Token (TypeScript)

Source: https://mastra.ai/docs/v1/auth/firebase

Creates an instance of MastraClient, requiring a Firebase ID token for authentication. This client is used to make requests to the Mastra API. It depends on the '@mastra/client-js' package.

```typescript
import { MastraClient } from "@mastra/client-js";  
  
export const createMastraClient = (idToken: string) => {  
  return new MastraClient({  
    baseUrl: "https://<mastra-api-url>",  
    headers: {  
      Authorization: `Bearer ${idToken}`,  
    },  
  });  
};

```

--------------------------------

### Transform Client-Side Streams to AI SDK Format (TypeScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Wraps a client-side response stream into a ReadableStream of ChunkType and pipes it through toAISdkFormat to convert it into the AI SDK format. This is useful for processing custom SSE streams into a format compatible with the AI SDK without manual parsing.

```typescript
import {
  createUIMessageStream,
} from "ai";
import { toAISdkFormat } from "@mastra/ai-sdk";
import type { ChunkType, MastraModelOutput } from "@mastra/core/stream";

// Client SDK agent stream
const response = await agent.stream({
  messages: "What is the weather in Tokyo",
});

const chunkStream: ReadableStream<ChunkType> = new ReadableStream<ChunkType>({
  start(controller) {
    response
      .processDataStream({
        onChunk: async (chunk) => {
          controller.enqueue(chunk as ChunkType);
        },
      })
      .finally(() => controller.close());
  },
});

const uiMessageStream = createUIMessageStream({
  execute: async ({ writer }) => {
    for await (const part of toAISdkFormat(
      chunkStream as unknown as MastraModelOutput,
      { from: "agent" },
    )) {
      writer.write(part);
    }
  },
});

for await (const part of uiMessageStream) {
  console.log(part);
}

```

--------------------------------

### Resume a Suspended Tool Call in Mastra AI

Source: https://mastra.ai/docs/v1/agents/human-in-the-loop-with-tools

Resumes a suspended tool execution by calling `resumeStream` with the necessary `resumeData` and the `runId`. This allows the workflow to continue from the suspension point. Requires the Mastra AI SDK.

```typescript
const resumedStream = await myAgent.resumeStream(
  { name: "John Smith" },
  { runId: stream.runId },
);

```

--------------------------------

### Conditional Logic with .branch() in TypeScript

Source: https://mastra.ai/docs/v1/workflows/control-flow

Shows how to implement conditional execution paths using `.branch()`. This method takes an array of tuples, where each tuple contains a condition function and a step. All steps within a branch must have identical `inputSchema` and `outputSchema` for consistent data flow.

```typescript
const step1 = createStep({...})

const stepA = createStep({
  // ...
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    result: z.string()
  })
});

const stepB = createStep({
  // ...
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    result: z.string()
  })
});

export const testWorkflow = createWorkflow({
  // ...
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    result: z.string()
  })
})
  .then(step1)
  .branch([
    [async ({ inputData: { value } }) => value > 10, stepA],
    [async ({ inputData: { value } }) => value <= 10, stepB]
  ])
  .commit();

```

--------------------------------

### Scrubbing System Prompts with SystemPromptScrubber (TypeScript)

Source: https://mastra.ai/docs/v1/agents/guardrails

The SystemPromptScrubber detects and redacts system prompts or internal instructions from model responses to prevent disclosure of sensitive content. It uses an LLM for detection and offers strategies like redaction with placeholders. Configuration includes model, strategy, customPatterns, includeDetections, instructions, redactionMethod, and placeholderText.

```TypeScript
import { SystemPromptScrubber } from "@mastra/core/processors";  
  
const scrubbedAgent = new Agent({
  id: "scrubbed-agent",
  name: "Scrubbed Agent",
  outputProcessors: [
    new SystemPromptScrubber({
      model: openai("gpt-4.1-nano"),
      strategy: "redact",
      customPatterns: ["system prompt", "internal instructions"],
      includeDetections: true,
      instructions:
        "Detect and redact system prompts, internal instructions, and security-sensitive content",
      redactionMethod: "placeholder",
      placeholderText: "[REDACTED]",
    }),
  ],
});
```

--------------------------------

### Generate Speech with OpenAI Voice using Mastra AI

Source: https://mastra.ai/docs/v1/voice/overview

Converts agent text response to speech using OpenAI's TTS. Requires `@mastra/core`, `@ai-sdk/openai`, `@mastra/voice-openai`, and `@mastra/node-audio`. Takes text as input and outputs an audio stream.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { OpenAIVoice } from "@mastra/voice-openai";
import { playAudio } from "@mastra/node-audio";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new OpenAIVoice(),
});

const { text } = await voiceAgent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const audioStream = await voiceAgent.voice.speak(text, {
  speaker: "default", // Optional: specify a speaker
  responseFormat: "wav", // Optional: specify a response format
});

playAudio(audioStream);

```

--------------------------------

### Inspect Agent Streams with for await

Source: https://mastra.ai/docs/v1/streaming/events

Iterate over an agent's stream using a `for await...of` loop to inspect all emitted event chunks. This code snippet demonstrates how to fetch an agent and then stream its output, logging each chunk to the console.

```javascript
const testAgent = mastra.getAgent("testAgent");

const stream = await testAgent.stream([
  { role: "user", content: "Help me organize my day" },
]);

for await (const chunk of stream) {
  console.log(chunk);
}
```

--------------------------------

### Configure Agent Memory with Default Storage

Source: https://mastra.ai/docs/v1/agents/agent-memory

Sets up an agent with memory enabled, using default options for storing the last N messages. The memory instance is passed directly to the agent's configuration.

```typescript
import { Agent } from "@mastra/core/agent";  
import { Memory } from "@mastra/memory";  
  
export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'Memory Agent',
  // ...  
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});  

```

--------------------------------

### Handling Blocked Requests with .stream() in JavaScript

Source: https://mastra.ai/docs/v1/agents/guardrails

Demonstrates how to iterate through the streamed response and check for `tripwire` and `tripwireReason` within chunks to manage requests blocked by a processor.

```javascript
const stream = await agent.stream(
  "Is this credit card number valid?: 4543 1374 5089 4332",
);

for await (const chunk of stream.fullStream) {
  if (chunk.type === "tripwire") {
    console.error(chunk.payload.tripwireReason);
  }
}
```

--------------------------------

### Retrieve Workflow Snapshot using Mastra SDK

Source: https://mastra.ai/docs/v1/workflows/snapshots

This JavaScript code snippet demonstrates how to retrieve a workflow snapshot from storage using the Mastra SDK. It requires a storage instance obtained from the Mastra class and specifies the run ID and workflow name to identify the snapshot.

```javascript
const storage = mastra.getStorage();

const snapshot = await storage!.loadWorkflowSnapshot({
  runId: "<run-id>",
  workflowName: "<workflow-id>",
});

console.log(snapshot);
```

--------------------------------

### Enable Memory for an Agent

Source: https://mastra.ai/docs/v1/memory/overview

Enables the memory feature for a specific agent by instantiating and passing a `Memory` object to the agent's configuration. This allows the agent to utilize Mastra's memory capabilities.

```typescript
import { Memory } from "@mastra/memory";  
import { Agent } from "@mastra/core/agent";  

export const testAgent = new Agent({
  id: "test-agent",
  // ...  
  memory: new Memory(),
});

```

--------------------------------

### Generate Embeddings with OpenAI and Cohere using Mastra AI

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

This code snippet demonstrates how to process a document, chunk it, and generate embeddings using both OpenAI and Cohere embedding models via the Mastra AI SDK. It requires the 'ai', '@ai-sdk/openai', '@ai-sdk/cohere', and '@mastra/rag' libraries. The input is text, and the output is an array of embeddings and potentially upserted vectors in a vector store.

```typescript
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { cohere } from "@ai-sdk/cohere";

import { MDocument } from "@mastra/rag";

// Initialize document
const doc = MDocument.fromText(
  `  
  Climate change poses significant challenges to global agriculture.  
  Rising temperatures and changing precipitation patterns affect crop yields.  
`);

// Create chunks
const chunks = await doc.chunk({
  strategy: "recursive",
  maxSize: 256,
  overlap: 50,
});

// Generate embeddings with OpenAI
const { embeddings: openAIEmbeddings } = await embedMany({
  model: openai.embedding("text-embedding-3-small"),
  values: chunks.map((chunk) => chunk.text),
});

// OR

// Generate embeddings with Cohere
const { embeddings: cohereEmbeddings } = await embedMany({
  model: cohere.embedding("embed-english-v3.0"),
  values: chunks.map((chunk) => chunk.text),
});

// Store embeddings in your vector database
await vectorStore.upsert({
  indexName: "embeddings",
  vectors: embeddings,
});

```

--------------------------------

### Define HITL Workflow Step with Suspend - Mastra Core

Source: https://mastra.ai/docs/v1/workflows/human-in-the-loop

This TypeScript snippet demonstrates defining a workflow step using Mastra Core's createStep function. It includes input, output, resume, and suspend schemas, and implements logic to suspend the workflow for human approval. Dependencies include `@mastra/core/workflows` and `zod`.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";  
import { z } from "zod";  
  
const step1 = createStep({
  id: "step-1",  
  inputSchema: z.object({
    userEmail: z.string()
  }),  
  outputSchema: z.object({
    output: z.string()
  }),  
  resumeSchema: z.object({
    approved: z.boolean()
  }),  
suspendSchema: z.object({
    reason: z.string()
  }),  
  execute: async ({ inputData, resumeData, suspend }) => {
    const { userEmail } = inputData;
    const { approved } = resumeData ?? {};

    if (!approved) {
      return await suspend({
        reason: "Human approval required."
      });
    }

    return {
      output: `Email sent to ${userEmail}`
    };
  }
});

export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: z.object({
    userEmail: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  })
})
  .then(step1)
  .commit();

```

--------------------------------

### Optimize Thread Title Generation with Custom Model and Instructions

Source: https://mastra.ai/docs/v1/memory/threads-and-resources

This snippet illustrates how to optimize thread title generation by specifying a custom, smaller model and custom instructions. This approach separates title generation logic from the main conversation flow, potentially reducing costs and improving behavior.

```javascript
export const testAgent = new Agent({  
  // ...  
  memory: new Memory({  
    options: {  
      threads: {  
        generateTitle: {  
          model: openai("gpt-4.1-nano"),  
          instructions:  
            "Generate a concise title based on the user's first message",  
        },  
      },  
    },  
  }),  
});  
```

--------------------------------

### Convert Messages Between AI SDK and Mastra Formats

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Provides the `convertMessages` utility function from `@mastra/core/agent` for manually translating messages between AI SDK (v4 and v5) and Mastra formats. This is useful for direct database interactions.

```typescript
import { convertMessages } from "@mastra/core/agent";

// Convert AI SDK v4 messages to v5
const aiv5Messages = convertMessages(aiv4Messages).to("AIV5.UI");

// Convert Mastra messages to AI SDK v5
const aiv5Messages = convertMessages(mastraMessages).to("AIV5.Core");

// Supported output formats:
// 'Mastra.V2', 'AIV4.UI', 'AIV5.UI', 'AIV5.Core', 'AIV5.Model'

```

--------------------------------

### Advanced Configuration: Provider-specific Options in Generate Call

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/openrouter

Illustrates how to include provider-specific options within a `generate` call to the agent. This allows for dynamic configuration per request, such as setting caching behavior for Anthropic.

```typescript
// Get a response with provider-specific options
const response = await assistant.generate([
  {
    role: "system",
    content:
      "You are Chef Michel, a culinary expert specializing in ketogenic (keto) diet...",
    providerOptions: {
      // Provider-specific options - key can be 'anthropic' or 'openrouter'
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  },
  {
    role: "user",
    content: "Can you suggest a keto breakfast?",
  },
]);
```

--------------------------------

### Define Workflow Step with Suspend Logic (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/suspend-and-resume

This TypeScript code defines a workflow step using Mastra AI's `createStep` function. It includes input and output schemas, a `resumeSchema` for handling resumed data, and an `execute` function that conditionally pauses the workflow using `suspend()` based on `resumeData`. The workflow is then created using `createWorkflow` and chained with the defined step.

```typescript
const step1 = createStep({
  id: "step-1",
  inputSchema: z.object({
    userEmail: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  }),
  resumeSchema: z.object({
    approved: z.boolean()
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { userEmail } = inputData;
    const { approved } = resumeData ?? {};

    if (!approved) {
      return await suspend({});
    }

    return {
      output: `Email sent to ${userEmail}`
    };
  }
});

export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: z.object({
    userEmail: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  })
})
  .then(step1)
  .commit();
```

--------------------------------

### Generate Full Response using Javascript

Source: https://mastra.ai/docs/v1/agents/overview

Generates the complete response from the agent for a given prompt. This method is suitable for short, internal responses or debugging purposes. It accepts prompts as strings or arrays of message objects and logs the response text.

```javascript
const response = await testAgent.generate([
  { role: "user", content: "Help me organize my day" },
  { role: "user", content: "My day starts at 9am and finishes at 5.30pm" },
  { role: "user", content: "I take lunch between 12:30 and 13:30" },
  {
    role: "user",
    content: "I have meetings Monday to Friday between 10:30 and 11:30",
  },
]);

console.log(response.text);

```

--------------------------------

### Generate Speech with ElevenLabs Voice using Mastra AI

Source: https://mastra.ai/docs/v1/voice/overview

Converts agent text response to speech using ElevenLabs TTS. Requires `@mastra/core`, `@ai-sdk/openai`, `@mastra/voice-elevenlabs`, and `@mastra/node-audio`. Takes text as input and outputs an audio stream.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { ElevenLabsVoice } from "@mastra/voice-elevenlabs";
import { playAudio } from "@mastra/node-audio";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new ElevenLabsVoice(),
});

const { text } = await voiceAgent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const audioStream = await voiceAgent.voice.speak(text, {
  speaker: "default", // Optional: specify a speaker
});

playAudio(audioStream);

```

--------------------------------

### Access User Tier in Weather Tool using TypeScript

Source: https://mastra.ai/docs/v1/server-db/request-context

This TypeScript code snippet demonstrates how to access the 'user-tier' from the request context within the execute function of a weather tool. It uses the .get() method and type assertion to retrieve and check the user's tier, allowing for conditional logic. The `createTool` function is a dependency.

```typescript
export type UserTier = {
  "user-tier": "enterprise" | "pro";
};

export const weatherTool = createTool({
  id: "weather-tool",
  execute: async ({ requestContext }) => {
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];

    if (userTier === "enterprise") {
      // ...
    }
    // ...
  },
});

```

--------------------------------

### Chunk Document using Semantic Markdown Strategy

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

Splits Markdown documents based on semantic relationships between headers. This strategy is useful for maintaining the context of sections and requires specifying a join threshold and the model name for processing.

```javascript
const chunks = await doc.chunk({  
  strategy: "semantic-markdown",  
  joinThreshold: 500,  
  modelName: "gpt-3.5-turbo",  
});  
```

--------------------------------

### Generate Embeddings using AI SDK

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

Generates embeddings for document chunks directly using AI SDK packages, such as OpenAI's embedding model. This method involves importing the specific provider (e.g., 'openai') and using the embedMany function.

```javascript
import { openai } from "@ai-sdk/openai";  
import { embedMany } from "ai";  
  
const { embeddings } = await embedMany({  
  model: openai.embedding("text-embedding-3-small"),  
  values: chunks.map((chunk) => chunk.text),  
});  
```

--------------------------------

### Create React Form Component for Weather Input

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

Creates a new React component file 'form.tsx' in the 'src/components' directory. This component renders a form for users to input a city name and triggers the 'getWeatherInfo' Astro Action upon submission.

```typescript
import { actions } from "astro:actions";
import { useState } from "react";

export const Form = () => {
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const city = formData.get("city")!.toString();
    const { data } = await actions.getWeatherInfo({ city });

    setResult(data || null);
  }

  return (
    <>
      <form action={handleSubmit}>
        <input name="city" placeholder="Enter city" required />
        <button type="submit">Get Weather</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
};

```

--------------------------------

### Use CopilotKit Component in App

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/copilotkit

Integrates the previously defined CopilotKitComponent into the main App component. It passes the Mastra server URL to the CopilotKitComponent.

```tsx
import { CopilotKitComponent } from "./components/copilotkit-component";

function App() {
  return <CopilotKitComponent runtimeUrl="http://localhost:4111/copilotkit" />;
}

export default App;
```

--------------------------------

### Handling Blocked Requests with .generate() in JavaScript

Source: https://mastra.ai/docs/v1/agents/guardrails

Illustrates how to check the response object for `tripwire` and `tripwireReason` properties after calling the `generate` method to handle requests blocked by a processor.

```javascript
const result = await agent.generate(
  "Is this credit card number valid?: 4543 1374 5089 4332",
);

console.error(result.tripwire);
console.error(result.tripwireReason);
```

--------------------------------

### Loop with .dountil() until condition is true (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/control-flow

Demonstrates using the .dountil() method to repeatedly execute a step until a specified condition evaluates to true. This is useful for scenarios requiring a step to run until a certain state is achieved. The condition is checked after each execution of the step.

```TypeScript
const step1 = createStep({...});

const step2 = createStep({
  // ...
  execute: async ({ inputData }) => {
    const { number } = inputData;
    return {
      number: number + 1
    };
  }
});

export const testWorkflow = createWorkflow({
  // ...
})
  .then(step1)
  .dountil(step2, async ({ inputData: { number } }) => number > 10)
  .commit();
```

--------------------------------

### Text to Speech with Deepgram Voice Provider

Source: https://mastra.ai/docs/v1/voice/overview

This snippet demonstrates how to use the Mastral AI Agent with the Deepgram voice provider to convert an audio file to text and then generate a text response. It requires the '@mastra/core' and '@ai-sdk/openai' packages, as well as a Deepgram voice implementation.

```javascript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { DeepgramVoice } from "@mastra/voice-deepgram";
import { createReadStream } from "fs";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new DeepgramVoice(),
});

// Use an audio file from a URL
const audioStream = await createReadStream("./how_can_i_help_you.mp3");

// Convert audio to text
const transcript = await voiceAgent.voice.listen(audioStream);
console.log(`User said: ${transcript}`);

// Generate a response based on the transcript
const { text } = await voiceAgent.generate(transcript);
```

--------------------------------

### Pass Additional Data to Mastra Chat

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Demonstrates sending custom data from the frontend to Mastra using the `sendMessage` function. This data is then available as `RequestContext` on the server. It requires `@ai-sdk/react` and `ai` packages.

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { DefaultChatTransport } from 'ai';

export function ChatExtra() {
  const [inputValue, setInputValue] = useState('')
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4111/chat',
    }),
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: inputValue }, {
      body: {
        data: {
          userId: "user123",
          preferences: {
            language: "en",
            temperature: "celsius"
          }
        }
      }
    });
  };

  return (
    <div>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      <form onSubmit={handleFormSubmit}>
        <input value={inputValue} onChange={e=>setInputValue(e.target.value)} placeholder="Name of city" />
      </form>
    </div>
  );
}

```

--------------------------------

### Generate Speech with PlayAI Voice using Mastra AI

Source: https://mastra.ai/docs/v1/voice/overview

Converts agent text response to speech using PlayAI TTS. Requires `@mastra/core`, `@ai-sdk/openai`, `@mastra/voice-playai`, and `@mastra/node-audio`. Takes text as input and outputs an audio stream.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { PlayAIVoice } from "@mastra/voice-playai";
import { playAudio } from "@mastra/node-audio";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new PlayAIVoice(),
});

const { text } = await voiceAgent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const audioStream = await voiceAgent.voice.speak(text, {
  speaker: "default", // Optional: specify a speaker
});

playAudio(audioStream);

```

--------------------------------

### Clone Workflow for Independent Tracking

Source: https://mastra.ai/docs/v1/workflows/overview

Shows how to clone an existing workflow using `cloneWorkflow()`. This creates a separate instance of the workflow logic with a new ID, allowing it to be tracked and monitored independently in logs and observability tools. It's useful for reusing logic while maintaining distinct execution histories.

```typescript
import { cloneWorkflow } from "@mastra/core/workflows";

const step1 = createStep({...});

const parentWorkflow = createWorkflow({...})
const clonedWorkflow = cloneWorkflow(parentWorkflow, { id: "cloned-workflow" });

export const testWorkflow = createWorkflow({...})
  .then(step1)
  .then(clonedWorkflow)
  .commit();
```

--------------------------------

### Applying Multiple Processors in TypeScript

Source: https://mastra.ai/docs/v1/agents/guardrails

Demonstrates how to sequentially apply multiple built-in processors like UnicodeNormalizer, PromptInjectionDetector, PIIDetector, and ModerationProcessor to an agent's input.

```typescript
import {
  UnicodeNormalizer,
  ModerationProcessor,
  PromptInjectionDetector,
  PIIDetector,
} from "@mastra/core/processors";

export const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  // ...
  inputProcessors: [
    new UnicodeNormalizer({
      //...
    }),
    new PromptInjectionDetector({
      // ...
    }),
    new PIIDetector({
      // ...
    }),
    new ModerationProcessor({
      // ...
    }),
  ],
});
```

--------------------------------

### Configure Upstash Agent with Fastembed (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-upstash

Enhances the Mastra agent configuration to include Upstash Vector for semantic recall and Fastembed for local embedding generation. This allows for more sophisticated memory retrieval based on meaning.

```typescript
import { Memory } from "@mastra/memory";  
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { UpstashStore, UpstashVector } from "@mastra/upstash";  
import { fastembed } from "@mastra/fastembed";  
  
export const upstashAgent = new Agent({  
  id: "upstash-agent",  
  name: "Upstash Agent",  
  instructions:  
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",  
  model: openai("gpt-4o"),  
  memory: new Memory({  
    storage: new UpstashStore({  
      id: 'upstash-agent-storage',  
      url: process.env.UPSTASH_REDIS_REST_URL!,  
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,  
    }),  
    vector: new UpstashVector({  
      id: 'upstash-agent-vector',  
      url: process.env.UPSTASH_VECTOR_REST_URL!,  
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,  
    }),  
    embedder: fastembed,  
    options: {  
      lastMessages: 10,  
      semanticRecall: {  
        topK: 3,  
        messageRange: 2,  
      },  
    },  
  }),  
});  


```

--------------------------------

### Configure Semantic Recall Parameters - Mastra AI

Source: https://mastra.ai/docs/v1/memory/semantic-recall

Configures the behavior of semantic recall by setting topK (number of similar messages to retrieve), messageRange (context window size), and scope (search scope).

```typescript
const agent = new Agent({
  memory: new Memory({
    options: {
      semanticRecall: {
        topK: 3, // Retrieve 3 most similar messages
        messageRange: 2, // Include 2 messages before and after each match
        scope: "resource", // Search across all threads for this user (default setting if omitted)
      },
    },
  }),
});

```

--------------------------------

### Input Data Mapping with .map() in TypeScript

Source: https://mastra.ai/docs/v1/workflows/control-flow

Demonstrates how to transform data between steps using `.map()`. This is useful when the output schema of one step does not match the input schema of the next. The `.map()` function receives `inputData` and returns a new data shape.

```typescript
const step1 = createStep({...});
const step2 = createStep({...});

export const testWorkflow = createWorkflow({...})
  .then(step1)
  .map(async ({ inputData }) => {
    const { foo } = inputData;
    return {
      bar: `new ${foo}`,
    };
  })
  .then(step2)
  .commit();

```

--------------------------------

### Add Upstash Memory to Mastra Agent (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-upstash

Demonstrates how to integrate Upstash Redis as a storage backend for an AI agent's memory using Mastra. It initializes an Agent with UpstashStore for memory persistence.

```typescript
import { Memory } from "@mastra/memory";  
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { UpstashStore } from "@mastra/upstash";  
  
export const upstashAgent = new Agent({  
  id: "upstash-agent",  
  name: "Upstash Agent",  
  instructions:  
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",  
  model: openai("gpt-4o"),  
  memory: new Memory({  
    storage: new UpstashStore({  
      id: 'upstash-agent-storage',  
      url: process.env.UPSTASH_REDIS_REST_URL!,  
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,  
    }),  
    options: {  
      generateTitle: true, // Explicitly enable automatic title generation  
    },  
  }),  
});  


```

--------------------------------

### Configure Murf Voice Provider in JavaScript

Source: https://mastra.ai/docs/v1/voice/overview

Sets up the Murf voice provider for use in Mastra AI. It requires an API key and specifies the speech model name, language, and desired emotion. Note that Murf may not have a separate listening model.

```javascript
const voice = new MurfVoice({
  speechModel: {
    name: "murf-voice", // Example model name
    apiKey: process.env.MURF_API_KEY,
    language: "en-US", // Language code
    emotion: "happy", // Emotion setting
  },
  // Murf may not have a separate listening model
});
```

--------------------------------

### Generate Speech with Murf Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This code snippet demonstrates using the Mastra AI Agent with the Murf voice provider. It initializes the agent with MurfVoice, generates text, converts it into an audio stream, and then plays the audio using the playAudio function.

```javascript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { MurfVoice } from "@mastra/voice-murf";  
import { playAudio } from "@mastra/node-audio";  
  
const voiceAgent = new Agent({  
  id: "voice-agent",  
  name: "Voice Agent",  
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new MurfVoice(),  
});  
  
const { text } = await voiceAgent.generate("What color is the sky?");  
  
// Convert text to speech to an Audio Stream  
const audioStream = await voiceAgent.voice.speak(text, {  
  speaker: "default", // Optional: specify a speaker  
});  
  
playAudio(audioStream);
```

--------------------------------

### Call Agent Network for Workflow (JavaScript)

Source: https://mastra.ai/docs/v1/agents/networks

Illustrates calling an agent network to execute a workflow, such as gathering historical facts about a city. It uses the `.network()` method and iterates through the event stream to log progress and results.

```javascript
const result = await routingAgent.network(
  "Tell me some historical facts about London",
);

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

--------------------------------

### Create Vector Store Index

Source: https://mastra.ai/docs/v1/rag/vector-databases

This snippet illustrates the process of creating a vector store index with a specified name and dimension. The dimension must match the embedding model's output.

```typescript
// Create an index with dimension 1536 (for text-embedding-3-small)
await store.createIndex({
  indexName: "myCollection",
  dimension: 1536,
});
```

--------------------------------

### Generate Speech with Speechify Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This code snippet illustrates how to utilize the Mastra AI Agent with the Speechify voice provider. It sets up the agent with the SpeechifyVoice and then generates an audio stream from text, which is subsequently played using playAudio.

```javascript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { SpeechifyVoice } from "@mastra/voice-speechify";  
import { playAudio } from "@mastra/node-audio";  
  
const voiceAgent = new Agent({  
  id: "voice-agent",  
  name: "Voice Agent",  
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new SpeechifyVoice(),  
});  
  
const { text } = await voiceAgent.generate("What color is the sky?");  
  
// Convert text to speech to an Audio Stream  
const audioStream = await voiceAgent.voice.speak(text, {  
  speaker: "matthew", // Optional: specify a speaker  
});  
  
playAudio(audioStream);
```

--------------------------------

### Define Weather Tool for Mastra Agent

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Defines a reusable tool for fetching weather information. It includes input and output schemas using Zod for validation and an execute function that currently returns a placeholder value. This structure allows for integrating external API calls.

```typescript
import { createTool } from "@mastra/core/tools";  
import { z } from "zod";  
  
export const weatherTool = createTool({  
  id: "get-weather",  
  description: "Get current weather for a location",  
  inputSchema: z.object({  
    location: z.string().describe("City name"),  
  }),  
  outputSchema: z.object({  
    output: z.string(),  
  }),  
  execute: async () => {  
    return {  
      output: "The weather is sunny",  
    };  
  },  
});  

```

--------------------------------

### Set Vercel Token Environment Variable (Shell)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This command sets the `VERCEL_TOKEN` environment variable, which is used by the Vercel deployer for authentication when deploying Mastra workflows to Vercel.

```shell
export VERCEL_TOKEN=your_vercel_token
```

--------------------------------

### Mastra Workflow with State Management

Source: https://mastra.ai/docs/v1/workflows/overview

Demonstrates a Mastra workflow that utilizes state management. Both individual steps and the overall workflow define `stateSchema` to declare shared state variables. The `setState` function within a step's `execute` method allows for updating this shared state across subsequent steps.

```typescript
const step1 = createStep({
  // ...
  stateSchema: z.object({
    processedItems: z.array(z.string()),
  }),
  execute: async ({ inputData, state, setState }) => {
    const { message } = inputData;
    const { processedItems } = state;

    setState({
      ...state,
      processedItems: [...processedItems, "item-1", "item-2"],
    });

    return {
      formatted: message.toUpperCase(),
    };
  },
});

const step2 = createStep({
  // ...
  stateSchema: z.object({
    metadata: z.object({
      processedBy: z.string(),
    }),
  }),
  execute: async ({ inputData, state }) => {
    const { formatted } = inputData;
    const { metadata } = state;

    return {
      emphasized: `${formatted}!! ${metadata.processedBy}`,
    };
  },
});

export const testWorkflow = createWorkflow({
  // ...
  stateSchema: z.object({
    processedItems: z.array(z.string()),
    metadata: z.object({
      processedBy: z.string(),
    }),
  }),
})
  .then(step1)
  .then(step2)
  .commit();
```

--------------------------------

### Loop with .foreach() for array items (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/control-flow

Shows how to use the .foreach() method to iterate over an array, applying a specific step to each element. This is ideal for processing collections of data. The input to the workflow must be an array for this method to function correctly.

```TypeScript
const step1 = createStep({
  // ...
  inputSchema: z.string(),
  outputSchema: z.string(),
  execute: async ({ inputData }) => {
    return inputData.toUpperCase();
  }
});

const step2 = createStep({...});

export const testWorkflow = createWorkflow({
  // ...
  inputSchema: z.array(z.string()),
  outputSchema: z.array(z.string())
})
  .foreach(step1)
  .then(step2)
  .commit();
```

--------------------------------

### Reference a Registered Mastra Agent

Source: https://mastra.ai/docs/v1/agents/overview

Retrieves a reference to a registered agent from a Mastra instance using its ID. This method is preferred over direct import as it provides access to the Mastra instance's configuration and resources.

```javascript
const testAgent = mastra.getAgent("testAgent");  

```

--------------------------------

### Define City Workflow Description and Schema (TypeScript)

Source: https://mastra.ai/docs/v1/agents/networks

Defines a city-specific workflow for an agent network. It includes a description of its purpose (handling city research), an input schema expecting a city name (string), and an output schema returning a text report (string).

```typescript
export const cityWorkflow = createWorkflow({
  id: "city-workflow",
  description: `This workflow handles city-specific research tasks.  
    It first gathers factual information about the city, then synthesizes  
    that research into a full written report. Use it when the user input  
    includes a city to be researched.`,
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  //...
});
```

--------------------------------

### S3Vectors Agent with RAG

Source: https://mastra.ai/docs/v1/rag/retrieval

This snippet showcases the implementation of a RAG agent tailored for S3Vectors. It leverages the OpenAI model and the S3Vectors prompt within the agent's instructions, ensuring effective context processing and query handling via a vector query tool.

```typescript
import { openai } from "@ai-sdk/openai";
import { S3VECTORS_PROMPT } from "@mastra/s3vectors";

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "RAG Agent",
  model: openai("gpt-4o-mini"),
  instructions: `
  Process queries using the provided context. Structure responses to be concise and relevant.
  ${S3VECTORS_PROMPT}
  `,
  tools: { vectorQueryTool },
});
```

--------------------------------

### Configure Thread-Scoped Working Memory (JavaScript)

Source: https://mastra.ai/docs/v1/memory/working-memory

This snippet illustrates the configuration of thread-scoped working memory, where memory is isolated to each individual conversation thread. It sets up a Memory instance, enabling working memory with the scope set to 'thread' and defining a markdown template for thread-specific user profile information.

```javascript
const memory = new Memory({
  storage,
  options: {
    workingMemory: {
      enabled: true,
      scope: "thread", // Memory is isolated per thread
      template: "# User Profile  \n- **Name**:  \n- **Interests**:  \n- **Current Goal**:  \n",
    },
  },
});
```

--------------------------------

### Register Weather Agent in Mastra Configuration

Source: https://mastra.ai/docs/v1/frameworks/servers/express

Adds the newly created `weatherAgent` to the main Mastra configuration. This step makes the agent available for use within the Mastra instance managed by your Express application.

```typescript
import { Mastra } from "@mastra/core";  
import { weatherAgent } from "./agents/weather-agent";  
  
export const mastra = new Mastra({  
  agents: { weatherAgent },  
});  

```

--------------------------------

### Accessing RequestContext in Agent Instructions and Model

Source: https://mastra.ai/docs/v1/server-db/request-context

Shows how to access and utilize RequestContext within an agent's configuration, specifically in the `instructions` and `model` functions. It demonstrates retrieving 'user-tier' to conditionally adjust agent behavior.

```typescript
export type UserTier = {  
  "user-tier": "enterprise" | "pro";  
};  
  
export const weatherAgent = new Agent({  
  id: "weather-agent",  
  name: "Weather Agent",  
  instructions: async ({ requestContext }) => {  
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];  
  
    if (userTier === "enterprise") {  
      // ...  
    }  
    // ...  
  },  
  model: ({ requestContext }) => {  
    // ...  
  },  
  tools: ({ requestContext }) => {  
    // ...  
  },  
  memory: ({ requestContext }) => {  
    // ...  
  },  
});  
```

--------------------------------

### Global Middleware Configuration in Mastra Server

Source: https://mastra.ai/docs/v1/server-db/middleware

Configures global middleware for the Mastra server, including an authentication check and a request logger. It intercepts requests for '/api/*' paths and logs all requests.

```typescript
import { Mastra } from "@mastra/core";
  
export const mastra = new Mastra({
  server: {
    middleware: [
      {
        handler: async (c, next) => {
          // Example: Add authentication check
          const authHeader = c.req.header("Authorization");
          if (!authHeader) {
            return new Response("Unauthorized", { status: 401 });
          }

          await next();
        },
        path: "/api/*",
      },
      // Add a global request logger
      async (c, next) => {
        console.log(`${c.req.method} ${c.req.url}`);
        await next();
      },
    ],
  },
});
```

--------------------------------

### Preprocess Step with JavaScript Function (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Defines a `preprocess` step for the `glutenCheckerScorer` using a JavaScript function. This function cleans and transforms the recipe text by converting it to lowercase, calculating word count, and checking for common gluten-containing words. The extracted data is returned for subsequent steps.

```javascript
const glutenCheckerScorer = createScorer(...)
.preprocess(({ run }) => {
  // Extract and clean recipe text
  const recipeText = run.output.text.toLowerCase();
  const wordCount = recipeText.split(' ').length;

  return {
    recipeText,
    wordCount,
    hasCommonGlutenWords: /flour|wheat|bread|pasta/.test(recipeText)
  };
})

```

--------------------------------

### Generate Speech with Azure Voice using Mastra AI

Source: https://mastra.ai/docs/v1/voice/overview

Converts agent text response to speech using Azure's TTS. Requires `@mastra/core`, `@ai-sdk/openai`, `@mastra/voice-azure`, and `@mastra/node-audio`. Takes text as input and outputs an audio stream.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { AzureVoice } from "@mastra/voice-azure";
import { playAudio } from "@mastra/node-audio";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new AzureVoice(),
});

const { text } = await voiceAgent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const audioStream = await voiceAgent.voice.speak(text, {
  speaker: "en-US-JennyNeural", // Optional: specify a speaker
});

playAudio(audioStream);

```

--------------------------------

### Configuring Processor Strategy in TypeScript

Source: https://mastra.ai/docs/v1/agents/guardrails

Shows how to set a specific strategy, such as 'block', for a processor like PIIDetector to control its behavior when sensitive information is detected.

```typescript
import { PIIDetector } from "@mastra/core/processors";

export const privateAgent = new Agent({
  id: "private-agent",
  name: "Private Agent",
  // ...
  inputProcessors: [
    new PIIDetector({
      // ...
      strategy: "block",
    }),
  ],
});
```

--------------------------------

### Create Amazon ECR Repository

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Creates a new repository in Amazon Elastic Container Registry (ECR) to store the Docker image. The repository name is derived from the project name environment variable and is region-specific.

```shell
aws ecr create-repository --repository-name "$PROJECT_NAME" --region "$AWS_REGION"

```

--------------------------------

### Enable Default Sensitive Data Filter in Mastra

Source: https://mastra.ai/docs/v1/observability/tracing/processors/sensitive-data-filter

Demonstrates how to enable the Sensitive Data Filter with default settings by initializing Mastra with the standard configuration. This automatically includes the filter to redact common sensitive fields.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    default: { enabled: true }, // Automatically includes SensitiveDataFilter
  }),
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: "file:./mastra.db",
  }),
});
```

--------------------------------

### Run Evals for Weather Agent Tests (Vitest)

Source: https://mastra.ai/docs/v1/evals/running-in-ci

This snippet demonstrates how to use the `runEvals` function from `@mastra/core/evals` to test the `weatherAgent`. It processes an array of test cases, each with an input and expected ground truth, using a `locationScorer`. The results, including aggregate scores and a summary, are then asserted using Vitest.

```typescript
import { describe, it, expect } from 'vitest';
import { createScorer, runEvals } from "@mastra/core/evals";
import { weatherAgent } from "./weather-agent";
import { locationScorer } from "../scorers/location-scorer";

describe('Weather Agent Tests', () => {
  it('should correctly extract locations from queries', async () => {
    const result = await runEvals({
      data: [
        {
          input: 'weather in Berlin',
          groundTruth: { expectedLocation: 'Berlin', expectedCountry: 'DE' }
        },
        {
          input: 'weather in Berlin, Maryland',
          groundTruth: { expectedLocation: 'Berlin', expectedCountry: 'US' }
        },
        {
          input: 'weather in Berlin, Russia',
          groundTruth: { expectedLocation: 'Berlin', expectedCountry: 'RU' }
        },
      ],
      target: weatherAgent,
      scorers: [locationScorer]
    });

    // Assert aggregate score meets threshold
    expect(result.scores['location-accuracy']).toBe(1);
    expect(result.summary.totalItems).toBe(3);
  });
});
```

--------------------------------

### Configure Mastra Server Port and Timeout (TypeScript)

Source: https://mastra.ai/docs/v1/server-db/mastra-server

Set the port and timeout for the Mastra HTTP server. The port defaults to 4111 and timeout to 30000ms (30s). This configuration is done within the Mastra instance initialization.

```typescript
import { Mastra } from "@mastra/core";  
  
export const mastra = new Mastra({
  // ...  
  server: {  
    port: 3000, // Defaults to 4111  
    timeout: 10000, // Defaults to 30000 (30s)  
  },
});  

```

--------------------------------

### Log In to Amazon ECR

Source: https://mastra.ai/docs/v1/deployment/cloud-providers/aws-lambda

Authenticates the local Docker client with the Amazon ECR registry. This command retrieves a password using AWS STS and pipes it to the Docker login command, allowing subsequent image pushes.

```shell
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

```

--------------------------------

### Configure Mastra Server CORS Settings (TypeScript)

Source: https://mastra.ai/docs/v1/server-db/mastra-server

Configure Cross-Origin Resource Sharing (CORS) for the Mastra server. This allows specifying allowed origins, methods, headers, and whether credentials should be included.

```typescript
import { Mastra } from "@mastra/core";  
  
export const mastra = new Mastra({
  // ...  
  server: {
    cors: {
      origin: ["https://example.com"], // Allow specific origins or '*' for all  
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    },
  },
});

```

--------------------------------

### Define Schema-Based Working Memory

Source: https://mastra.ai/docs/v1/memory/working-memory

This TypeScript/JavaScript snippet defines a structured working memory using Zod schemas for type safety. It imports necessary modules and defines a `userProfileSchema` for capturing user details like name, location, and preferences.

```typescript
import { z } from "zod";
import { Memory } from "@mastra/memory";

const userProfileSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  preferences:
    z.object({
      communicationStyle: z.string().optional(),
      projectGoal: z.string().optional(),
      deadlines: z.array(z.string()).optional(),
    })
    .optional(),
});

const memory = new Memory({
  options: {
    workingMemory: {
      enabled: true,
      schema: userProfileSchema,
      // template: ... (do not set)
    },
  },
});
```

--------------------------------

### Create Child Spans for Database Operations in Mastra

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Shows how to create a child span specifically for a database query operation within a workflow step using Mastra. This includes passing input data, metadata, and handling success and error scenarios with span ending and error reporting.

```typescript
execute: async ({ inputData, tracingContext }) => {
  // Create another child span for the main database operation
  const querySpan = tracingContext.currentSpan?.createChildSpan({
    type: "generic",
    name: "database-query",
    input: { query: inputData.query },
    metadata: { database: "production" },
  });

  try {
    const results = await db.query(inputData.query);
    querySpan?.end({
      output: results.data,
      metadata: {
        rowsReturned: results.length,
        queryTimeMs: results.executionTime,
        cacheHit: results.fromCache,
      },
    });
    return results;
  } catch (error) {
    querySpan?.error({
      error,
      metadata: { retryable: isRetryableError(error) },
    });
    throw error;
  }
};
```

--------------------------------

### Configure Next.js for Mastra AI

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/next-js

Modifies the `next.config.ts` file to include Mastra's server external packages. This is a crucial step for ensuring Mastra functions correctly within the Next.js environment, especially when using server actions or API routes.

```typescript
import type { NextConfig } from "next";  
  
const nextConfig: NextConfig = {  
  serverExternalPackages: ["@mastra/*"],  
};

export default nextConfig;  
```

--------------------------------

### Exclude .mastra Directory in tsconfig.json

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/sveltekit

Modifies the `tsconfig.json` file to exclude the `.mastra` directory from compilation. This prevents Mastra-specific files from being included in your project's build output.

```json
{
  ...
  "exclude": ["dist", ".mastra"]
}

```

--------------------------------

### Authenticate and Call Mastra API with cURL

Source: https://mastra.ai/docs/v1/auth/auth0

This cURL command shows how to make an authenticated POST request to the Mastra AI API's weatherAgent. It includes the necessary Content-Type and Authorization headers, along with a JSON payload containing the user's message. Replace `<your-auth0-access-token>` with your actual Auth0 access token.

```bash
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-auth0-access-token>" \
  -d '{
    "messages": "Weather in London"
  }'
```

--------------------------------

### Generate Embeddings using Model Router

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

Generates embeddings for document chunks using Mastra's Model Router, which simplifies selecting embedding models like OpenAI's 'text-embedding-3-small'. It requires importing ModelRouterEmbeddingModel and using the embedMany function from the 'ai' SDK. API keys are auto-detected.

```javascript
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";  
import { embedMany } from "ai";  
  
const embeddingModel = new ModelRouterEmbeddingModel(  
  "openai/text-embedding-3-small",  
);  
  
const { embeddings } = await embedMany({  
  model: embeddingModel,  
  values: chunks.map((chunk) => chunk.text),  
});  
```

--------------------------------

### Configure MastraClient with JWT Token

Source: https://mastra.ai/docs/v1/auth/jwt

Configures the MastraClient for making authenticated requests. It sets the base URL and includes the JWT in the Authorization header, fetched from environment variables.

```typescript
import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: "https://<mastra-api-url>",
  headers: {
    Authorization: `Bearer ${process.env.MASTRA_JWT_TOKEN}`,
  },
});
```

--------------------------------

### Direct Memory Update

Source: https://mastra.ai/docs/v1/memory/working-memory

This section describes the direct method for updating working memory using `updateWorkingMemory`, which is useful for immediate or resource-scoped memory modifications.

```APIDOC
## Direct Memory Update

Alternatively, use the `updateWorkingMemory` method directly:

```typescript
await memory.updateWorkingMemory({
  threadId: "thread-123",
  resourceId: "user-456", // Required for resource-scoped memory
  workingMemory: "Updated memory content...",
});
```
```

--------------------------------

### Add Resource Attributes to Arize Exporter

Source: https://mastra.ai/docs/v1/observability/tracing/exporters/arize

Configures the Arize Exporter to add custom resource attributes to all exported spans. This includes setting environment, namespace, instance ID, and custom key-value pairs. Requires environment variables for endpoint and node environment.

```javascript
new ArizeExporter({
  endpoint: process.env.PHOENIX_ENDPOINT!,
  resourceAttributes: {
    "deployment.environment": process.env.NODE_ENV,
    "service.namespace": "production",
    "service.instance.id": process.env.HOSTNAME,
    "custom.attribute": "value",
  },
});
```

--------------------------------

### Make Authenticated Request to Mastra AI Agent (cURL)

Source: https://mastra.ai/docs/v1/auth/workos

This cURL command shows how to make an authenticated POST request to the Mastra AI weather agent's generate endpoint. It requires the agent URL, Content-Type, Authorization header with a Bearer token, and a JSON payload containing the messages for the agent.

```curl
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-workos-access-token>" \
  -d '{
    "messages": "Weather in London"
  }'

```

--------------------------------

### Loop with .dowhile() while condition is true (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/control-flow

Illustrates the use of the .dowhile() method, which executes a step repeatedly as long as a given condition remains true. This method is suitable for loops that should continue operating under a specific ongoing circumstance. The condition is checked before each execution of the step.

```TypeScript
const step1 = createStep({...});

const step2 = createStep({
  // ...
  execute: async ({ inputData }) => {
    const { number } = inputData;
    return {
      number: number + 1
    };
  }
});

export const testWorkflow = createWorkflow({
  // ...
})
  .then(step1)
  .dowhile(step2, async ({ inputData: { number } }) => number < 10)
  .commit();
```

--------------------------------

### Custom Snapshot Metadata with Zod Schemas in Mastra Workflows

Source: https://mastra.ai/docs/v1/workflows/snapshots

Defines a Mastra workflow step with custom input, suspend, resume, and output schemas using Zod. This enables structured data handling during workflow suspension and resumption.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const approvalStep = createStep({
  id: "approval-step",
  description: "Accepts a value, waits for confirmation",
  inputSchema: z.object({
    value: z.number(),
    user: z.string(),
    requiredApprovers: z.array(z.string()),
  }),
  suspendSchema: z.object({
    message: z.string(),
    requestedBy: z.string(),
    approvers: z.array(z.string()),
  }),
  resumeSchema: z.object({
    confirm: z.boolean(),
    approver: z.string(),
  }),
  outputSchema: z.object({
    value: z.number(),
    approved: z.boolean(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { value, user, requiredApprovers } = inputData;
    const { confirm } = resumeData ?? {};

    if (!confirm) {
      return await suspend({
        message: "Workflow suspended",
        requestedBy: user,
        approvers: [...requiredApprovers],
      });
    }

    return {
      value,
      approved: confirm,
    };
  },
});
```

--------------------------------

### Configure Custom Sensitive Data Filter and Redaction Styles

Source: https://mastra.ai/docs/v1/observability/tracing/processors/sensitive-data-filter

Shows how to customize the Sensitive Data Filter by specifying custom sensitive fields, a unique redaction token, and the redaction style (full or partial). This allows fine-grained control over data redaction.

```typescript
import { SensitiveDataFilter, DefaultExporter, Observability } from "@mastra/observability";

export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      production: {
        serviceName: "my-service",
        exporters: [new DefaultExporter()],
        spanOutputProcessors: [
          new SensitiveDataFilter({
            // Add custom sensitive fields
            sensitiveFields: [
              // Default fields
              "password",
              "token",
              "secret",
              "key",
              "apikey",
              // Custom fields for your application
              "creditCard",
              "bankAccount",
              "routingNumber",
              "email",
              "phoneNumber",
              "dateOfBirth",
            ],
            // Custom redaction token
            redactionToken: "***SENSITIVE***",
            // Redaction style
            redactionStyle: "full", // or 'partial'
          }),
        ],
      },
    },
  }),
});
```

--------------------------------

### Enable Request Cancellation with AbortSignal in TypeScript

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Initializes the MastraClient with an AbortSignal for request cancellation. This allows for canceling in-flight requests, useful for user-initiated aborts or cleaning up stale network calls. Requires Node.js AbortController.

```typescript
import { MastraClient } from "@mastra/client-js";  
  
export const controller = new AbortController();  
  
export const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
  abortSignal: controller.signal,
});

```

--------------------------------

### Use Chat Hook for Workflow with Custom Input Data (JavaScript)

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

Configures the `useChat()` hook to interact with a workflow API endpoint. It uses `DefaultChatTransport` and customizes the request to send `inputData` (e.g., city name) or `resumeData` for suspended workflows. The input is derived from the last message.

```javascript
const { error, status, sendMessage, messages, regenerate, stop } = useChat({
  transport: new DefaultChatTransport({
    api: "http://localhost:4111/workflow",
    prepareSendMessagesRequest({ messages }) {
      return {
        body: {
          inputData: {
            city: messages[messages.length - 1].parts[0].text,
          },
          //Or resumeData for resuming a suspended workflow
          resumeData: {
            confirmation: messages[messages.length - 1].parts[0].text
          }
        },
      };
    },
  }),
});

```

--------------------------------

### Mastra Headers Inspection Middleware

Source: https://mastra.ai/docs/v1/server-db/middleware

Middleware that inspects special Mastra headers like 'x-mastra-cloud', 'x-mastra-client-type', and 'x-studio' to tailor request behavior based on the origin or client type.

```javascript
{
  handler: async (c, next) => {
    const isFromMastraCloud = c.req.header('x-mastra-cloud') === 'true';
    const clientType = c.req.header('x-mastra-client-type');
    const isStudio =
      c.req.header('x-studio') === 'true';

    if (isFromMastraCloud) {
      // Special handling
    }
    await next();
  },
}
```

--------------------------------

### Generate Speech with Google Voice using Mastra AI

Source: https://mastra.ai/docs/v1/voice/overview

Converts agent text response to speech using Google TTS. Requires `@mastra/core`, `@ai-sdk/openai`, `@mastra/voice-google`, and `@mastra/node-audio`. Takes text as input and outputs an audio stream.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { GoogleVoice } from "@mastra/voice-google";
import { playAudio } from "@mastra/node-audio";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new GoogleVoice(),
});

const { text } = await voiceAgent.generate("What color is the sky?");

// Convert text to speech to an Audio Stream
const audioStream = await voiceAgent.voice.speak(text, {
  speaker: "en-US-Studio-O", // Optional: specify a speaker
});

playAudio(audioStream);

```

--------------------------------

### Speech to Text with OpenAI Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This code snippet demonstrates how to transcribe audio to text using the OpenAI voice provider within the Mastra AI Agent. It takes an audio file stream as input and outputs the transcribed text, which is then used to generate a response.

```typescript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { OpenAIVoice } from "@mastra/voice-openai";  
import { createReadStream } from "fs";  
  
const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new OpenAIVoice(),  
});  
  
// Use an audio file from a URL  
const audioStream = await createReadStream("./how_can_i_help_you.mp3");  
  
// Convert audio to text  
const transcript = await voiceAgent.voice.listen(audioStream);  
console.log(`User said: ${transcript}`);  
  
// Generate a response based on the transcript  
const { text } = await voiceAgent.generate(transcript);  

```

--------------------------------

### Create Child Spans with and without RequestContext in Mastra

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Illustrates the creation of child spans within Mastra's tracing capabilities. It shows how passing `requestContext` to `createChildSpan` enables metadata extraction, while omitting it prevents extraction.

```typescript
execute: async ({ tracingContext, requestContext }) => {
  // Create child span WITH requestContext - gets metadata extraction
  const dbSpan = tracingContext.currentSpan?.createChildSpan({
    type: "generic",
    name: "database-query",
    requestContext, // Pass to enable metadata extraction
  });

  const results = await db.query("SELECT * FROM users");
  dbSpan?.end({ output: results });

  // Or create child span WITHOUT requestContext - no metadata extraction
  const cacheSpan = tracingContext.currentSpan?.createChildSpan({
    type: "generic",
    name: "cache-check",
    // No requestContext - won't extract metadata
  });

  return results;
};
```

--------------------------------

### Forward AbortSignal to Tool Execution in Mastra

Source: https://mastra.ai/docs/v1/tools-mcp/advanced-usage

Demonstrates how to pass an AbortSignal from an agent interaction to a tool's execute function. This allows for cancellation of long-running operations within tools, such as fetch requests or loops, if the parent agent call is aborted. The signal is accessed via `context?.abortSignal` in the tool's execute method.

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const longRunningTool = createTool({
  id: "long-computation",
  description: "Performs a potentially long computation",
  inputSchema: z.object({ /* ... */ }),
  execute: async (inputData, context) => {
    // Example: Forwarding signal to fetch
    const response = await fetch("https://api.example.com/data", {
      signal: context?.abortSignal, // Pass the signal here
    });

    if (context?.abortSignal?.aborted) {
      console.log("Tool execution aborted.");
      throw new Error("Aborted");
    }

    // Example: Checking signal during a loop
    for (let i = 0; i < 1000000; i++) {
      if (context?.abortSignal?.aborted) {
        console.log("Tool execution aborted during loop.");
        throw new Error("Aborted");
      }
      // ... perform computation step ...
    }

    const data = await response.json();
    return { result: data };
  },
});
```

--------------------------------

### Write custom events to workflow stream within a step (JavaScript)

Source: https://mastra.ai/docs/v1/streaming/workflow-streaming

This code snippet demonstrates how to use the `writer` argument within a workflow step's `execute` function to send custom events (e.g., 'pending', 'success') as the workflow progresses. It requires `streamVNext` to be enabled and emphasizes awaiting `writer.write()` to prevent stream locking.

```javascript
import { createStep } from "@mastra/core/workflows";

export const testStep = createStep({
  // ...
  execute: async ({ inputData, writer }) => {
    const { value } = inputData;

    await writer?.write({
      type: "custom-event",
      status: "pending"
    });

    const response = await fetch(...);

    await writer?.write({
      type: "custom-event",
      status: "success"
    });

    return {
      value: ""
    };
  },
});
```

--------------------------------

### Register Agent in Mastra Instance

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/openrouter

Registers the configured agent with the Mastra instance. This makes the agent available for use within the Mastra framework.

```typescript
import { assistant } from "./agents/assistant";

export const mastra = new Mastra({
  agents: { assistant },
});
```

--------------------------------

### Extract Nested Values using Dot Notation in Mastra

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Demonstrates how to configure Mastra to extract nested values from a RequestContext using dot notation. This involves setting up observability configurations with `requestContextKeys` and populating the RequestContext with data.

```typescript
export const mastra = new Mastra({
  observability: new Observability({
    configs: {
      default: {
        requestContextKeys: ["user.id", "session.data.experimentId"],
        exporters: [new DefaultExporter()],
      },
    },
  }),
});

const requestContext = new RequestContext();
requestContext.set("user", { id: "user-456", name: "John Doe" });
requestContext.set("session", { data: { experimentId: "exp-999" } });

// Metadata will include: { user: { id: 'user-456' }, session: { data: { experimentId: 'exp-999' } } }
```

--------------------------------

### Advanced Retrieval with Metadata Filtering

Source: https://mastra.ai/docs/v1/rag/retrieval

Explains how to filter retrieval results based on metadata fields using a MongoDB-style query syntax. This allows for more precise searching by narrowing down results based on attributes like source, price, category, tags, and logical conditions.

```APIDOC
## Advanced Retrieval with Metadata Filtering

### Description
This section details how to apply metadata filters to narrow down search results from a vector store. Mastra supports a unified MongoDB-style query syntax for filtering across different vector stores, enabling precise retrieval based on document attributes.

### Method
POST (Implicit through `pgVector.query` with filter)

### Endpoint
`/vectorStore/query` (Conceptual endpoint for vector store interaction)

### Parameters
#### Query Parameters
- **queryVector** (Array<Float>) - Required - The embedding vector of the user's query.
- **indexName** (String) - Required - The name of the index in the vector store to query.
- **topK** (Integer) - Required - The number of top results to retrieve.
- **filter** (Object) - Required - Metadata filters to apply to the search. Supports operators like `$gt`, `$lt`, `$in`, `$or`, `$and`.

### Request Example
```javascript
// Simple equality filter
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    source: "article1.txt",
  },
});

// Numeric comparison
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    price: { $gt: 100 },
  },
});

// Multiple conditions
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    category: "electronics",
    price: { $lt: 1000 },
    inStock: true,
  },
});

// Array operations
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    tags: { $in: ["sale", "new"] },
  },
});

// Logical operators
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: embedding,
  topK: 10,
  filter: {
    $or: [{ category: "electronics" }, { category: "accessories" }],
    $and: [{ price: { $gt: 50 } }, { price: { $lt: 200 } }],
  },
});
```

### Response
#### Success Response (200)
- **text** (String) - The content of the retrieved document chunk.
- **score** (Float) - The similarity score between the query embedding and the chunk embedding.
- **metadata** (Object) - Associated metadata for the chunk.

#### Response Example
```json
[
  {
    "text": "This is an electronic item under $1000.",
    "score": 0.91,
    "metadata": { "source": "product_list.csv", "category": "electronics", "price": 500, "inStock": true },
  }
]
```
```

--------------------------------

### Generate Speech with Cloudflare Voice using Mastra AI

Source: https://mastra.ai/docs/v1/voice/overview

Converts agent text response to speech using Cloudflare TTS. Requires `@mastra/core`, `@ai-sdk/openai`, `@mastra/voice-cloudflare`, and `@mastra/node-audio`. Takes text as input and outputs an audio stream.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { CloudflareVoice } from "@mastra/voice-cloudflare";
import { playAudio } from "@mastra/node-audio";

const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:
    "You are a voice assistant that can help users with their tasks.",
  model: openai("gpt-4o"),
  voice: new CloudflareVoice(),
});


```

--------------------------------

### Stream Agent Response with MastraClient in TypeScript

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Streams a response from a Mastra agent in real-time using an array of message objects. The stream provides text parts as they become available. Handles potential errors during streaming.

```typescript
import { mastraClient } from "lib/mastra-client";  
  
const testAgent = async () => {  
  try {  
    const agent = mastraClient.getAgent("testAgent");  
  
    const stream = await agent.stream({
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
    });

    stream.processDataStream({
      onTextPart: (text) => {
        console.log(text);
      },
    });
  } catch (error) {
    return "Error occurred while generating response";
  }
};

```

--------------------------------

### Tracing Spans

Source: https://mastra.ai/docs/v1/server-db/storage

Defines the structure and fields for tracing spans within the Mastra system. This includes hierarchical operation names, trace IDs, scope, kind, attributes, status, events, links, and timing information.

```APIDOC
## Tracing Spans

### Description
Defines the structure and fields for tracing spans within the Mastra system. This includes hierarchical operation names, trace IDs, scope, kind, attributes, status, events, links, and timing information.

### Method
N/A (Schema Definition)

### Endpoint
N/A (Schema Definition)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **operationName** (text) - NOT NULL - Hierarchical operation name (e.g. `workflow.myWorkflow.execute`, `http.request`, `database.query`)
- **traceId** (text) - NOT NULL - Root trace identifier that groups related spans
- **scope** (text) - NOT NULL - Library/package/service that created the span (e.g. `@mastra/core`, `express`, `pg`)
- **kind** (integer) - NOT NULL - `INTERNAL` (0, within process), `CLIENT` (1, outgoing calls), `SERVER` (2, incoming calls), `PRODUCER` (3, async job creation), `CONSUMER` (4, async job processing)
- **attributes** (jsonb) - User defined key-value pairs that contain span metadata
- **status** (jsonb) - JSON object with `code` (UNSET=0, ERROR=1, OK=2) and optional `message`. Example:
```json
{
  "code": 1,
  "message": "HTTP request failed with status 500"
}
```
- **events** (jsonb) - Time-stamped events that occurred during the span
- **links** (jsonb) - Links to other related spans
- **other** (text) - Additional OpenTelemetry span fields as stringified JSON. Example:
```json
{
  "droppedAttributesCount": 2,
  "droppedEventsCount": 1,
  "instrumentationLibrary": "@opentelemetry/instrumentation-http"
}
```
- **startTime** (bigint) - NOT NULL - Nanoseconds since Unix epoch when span started
- **endTime** (bigint) - NOT NULL - Nanoseconds since Unix epoch when span ended
- **createdAt** (timestamp) - NOT NULL

### Request Example
None (Schema Definition)

### Response
#### Success Response (200)
None (Schema Definition)

#### Response Example
None (Schema Definition)
```

--------------------------------

### Re-ranking with Cohere Provider

Source: https://mastra.ai/docs/v1/rag/retrieval

An alternative method for re-ranking search results using Cohere's relevance scoring models. This approach can be swapped in as a different provider for the rerank function.

```javascript
const relevanceProvider = new CohereRelevanceScorer("rerank-v3.5");  

```

--------------------------------

### Create React Form Component for Weather Input

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/astro

A React component that provides a form for users to input a city name and submit it to the `/api/test` endpoint. It handles form submission, API calls, and displays the weather result. This component is designed for client-side rendering.

```typescript
import { useState } from "react";

export const Form = () => {
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const city = formData.get("city")?.toString();

    const response = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city })
    });

    const text = await response.json();
    setResult(text);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="city" placeholder="Enter city" required />
        <button type="submit">Get Weather</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
};

```

--------------------------------

### Resume Mastra Workflow with Resume Data

Source: https://mastra.ai/docs/v1/workflows/human-in-the-loop

This JavaScript snippet illustrates how to resume a suspended Mastra workflow using the `resume()` method. It passes specific `resumeData` to continue the workflow from the point it was paused. This is useful for acting on human input.

```javascript
const workflow = mastra.getWorkflow("testWorkflow");
const run = await workflow.createRunAsync();

await run.start({
  inputData: {
    userEmail: "alex@example.com"
  }
});

const handleResume = async () => {
  const result = await run.resume({
    step: "step-1",
    resumeData: { approved: true }
  });
};

```

--------------------------------

### Initialize Scorer with OpenAI Judge (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Initializes a custom scorer named 'Gluten Checker' using `createScorer`. It specifies an OpenAI model ('gpt-4o') for prompt-based steps and defines a Chef persona for gluten identification. The scorer is set up for chaining subsequent steps like preprocess, analyze, generateScore, and generateReason.

```javascript
import { createScorer } from '@mastra/core/evals';
import { openai } from '@ai-sdk/openai';

const glutenCheckerScorer = createScorer({
  name: 'Gluten Checker',
  description: 'Check if recipes contain gluten ingredients',
  judge: {                    // Optional: for prompt object steps
    model: openai('gpt-4o'),
    instructions: 'You are a Chef that identifies if recipes contain gluten.'
  }
})
// Chain step methods here
.preprocess(...)
.analyze(...)
.generateScore(...)
.generateReason(...)

```

--------------------------------

### Define Multi-turn Workflow Step with Suspend/Resume (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/human-in-the-loop

This TypeScript snippet demonstrates defining a workflow step that can be suspended for human input and later resumed. It includes input and output schemas, along with `resumeSchema` and `suspendSchema` to manage user interaction and feedback. The `execute` function handles the logic, potentially suspending the workflow if approval is not met.

```typescript
const step2 = createStep({
  id: "step-2",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  }),
  resumeSchema: z.object({
    approved: z.boolean()
  }),
  suspendSchema: z.object({
    reason: z.string()
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { message } = inputData;
    const { approved } = resumeData ?? {};

    if (!approved) {
      return await suspend({
        reason: "Human approval required."
      });
    }

    return {
      output: `${message} - Deleted`
    };
  }
});

export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: z.object({
    userEmail: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  })
})
.then(step1)
.then(step2)
.commit();
```

--------------------------------

### Configure Mastra Agent with MongoDB Vector Embeddings (TypeScript)

Source: https://mastra.ai/docs/v1/memory/storage/memory-with-mongodb

This TypeScript code configures a Mastra AI agent to use MongoDB for both storage and vector embeddings. It utilizes `MongoDBStore`, `MongoDBVector`, and `fastembed` for generating semantic recall capabilities, including options for message recency and recall depth.

```typescript
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { MongoDBStore, MongoDBVector } from "@mastra/mongodb";
import { fastembed } from "@mastra/fastembed";

export const mongodbAgent = new Agent({
  id: "mongodb-agent",
  name: "mongodb-agent",
  instructions:
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new MongoDBStore({
      url: process.env.MONGODB_URI!,
      dbName: process.env.MONGODB_DB_NAME!,
    }),
    vector: new MongoDBVector({
      uri: process.env.MONGODB_URI!,
      dbName: process.env.MONGODB_DB_NAME!,
    }),
    embedder: fastembed,
    options: {
      lastMessages: 10,
      semanticRecall: {
        topK: 3,
        messageRange: 2,
      },
      threads: {
        generateTitle: true, // generates descriptive thread titles automatically
      },
    },
  }),
});
```

--------------------------------

### Configure Cloudflare Voice

Source: https://mastra.ai/docs/v1/voice/overview

Configures the Cloudflare voice provider, requiring account ID and API token. Settings include model name, language, and audio format. Cloudflare may not provide a separate listening model.

```javascript
const voice = new CloudflareVoice({
  speechModel: {
    name: "cloudflare-voice", // Example model name
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    language: "en-US", // Language code
    format: "mp3", // Audio format
  },
  // Cloudflare may not have a separate listening model
});
```

--------------------------------

### Pass External Trace IDs to Agent (JavaScript)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Integrates Mastra traces into an existing distributed tracing system by passing parent trace context using `tracingOptions`. This requires obtaining the `parentTraceId` and `parentSpanId` from the current tracing system.

```javascript
// Get trace context from your existing tracing system
const parentTraceId = getCurrentTraceId(); // Your tracing system
const parentSpanId = getCurrentSpanId(); // Your tracing system

// Execute Mastra operations as part of the parent trace
const result = await agent.generate("Analyze this data", {
  tracingOptions: {
    traceId: parentTraceId,
    parentSpanId: parentSpanId,
  },
});

// The Mastra trace will now appear as a child in your distributed trace
```

--------------------------------

### Speech to Text with Azure Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This code snippet demonstrates how to transcribe audio to text using the Azure voice provider within the Mastra AI Agent. It takes an audio file stream as input and outputs the transcribed text, which is then used to generate a response.

```typescript
import { createReadStream } from "fs";  
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { AzureVoice } from "@mastra/voice-azure";  
import { createReadStream } from "fs";  
  
const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new AzureVoice(),  
});  
  
// Use an audio file from a URL  
const audioStream = await createReadStream("./how_can_i_help_you.mp3");  
  
// Convert audio to text  
const transcript = await voiceAgent.voice.listen(audioStream);  
console.log(`User said: ${transcript}`);  
  
// Generate a response based on the transcript  
const { text } = await voiceAgent.generate(transcript);  

```

--------------------------------

### Resume Suspended Workflow Step (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/human-in-the-loop

This TypeScript code shows how to resume a suspended workflow step using the `run.resume()` method. It illustrates calling `resume()` with the specific step identifier and the `resumeData` required by that step's `resumeSchema`. This is crucial for continuing a workflow after human input has been provided.

```typescript
const handleResume = async () => {
  const result = await run.resume({
    step: "step-1",
    resumeData: { approved: true }
  });
};

const handleDelete = async () => {
  const result = await run.resume({
    step: "step-2",
    resumeData: { approved: true }
  });
};
```

--------------------------------

### Speech to Text with ElevenLabs Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This code snippet demonstrates how to transcribe audio to text using the ElevenLabs voice provider within the Mastra AI Agent. It takes an audio file stream as input and outputs the transcribed text, which is then used to generate a response.

```typescript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { ElevenLabsVoice } from "@mastra/voice-elevenlabs";  
import { createReadStream } from "fs";  
  
const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new ElevenLabsVoice(),  
});  
  
// Use an audio file from a URL  
const audioStream = await createReadStream("./how_can_i_help_you.mp3");  
  
// Convert audio to text  
const transcript = await voiceAgent.voice.listen(audioStream);  
console.log(`User said: ${transcript}`);  
  
// Generate a response based on the transcript  
const { text } = await voiceAgent.generate(transcript);  

```

--------------------------------

### Invoke Mastra Workflow with Input Data (JSON)

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

This JSON object represents the input payload for invoking a Mastra workflow. It specifies the data structure expected by the workflow, including a nested `inputData` object with a `value` field.

```json
{
  "data": {
    "inputData": {
      "value": 5
    }
  }
}
```

--------------------------------

### Initialize Agent Scorer (JavaScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

Creates a scorer specifically for agent evaluation with `type: 'agent'`. This ensures type safety and compatibility for scoring both live agent interactions and saved traces. The scorer's `generateScore` method automatically types `run.output` and `run.input` for agent-specific data.

```javascript
const myScorer = createScorer({
  // ...
  type: "agent", // Automatically handles agent input/output types
}).generateScore(({ run, results }) => {
  // run.output is automatically typed as ScorerRunOutputForAgent
  // run.input is automatically typed as ScorerRunInputForAgent
});

```

--------------------------------

### Speech to Text with Google Voice Agent

Source: https://mastra.ai/docs/v1/voice/overview

This code snippet demonstrates how to transcribe audio to text using the Google voice provider within the Mastra AI Agent. It takes an audio file stream as input and outputs the transcribed text, which is then used to generate a response.

```typescript
import { Agent } from "@mastra/core/agent";  
import { openai } from "@ai-sdk/openai";  
import { GoogleVoice } from "@mastra/voice-google";  
import { createReadStream } from "fs";  
  
const voiceAgent = new Agent({
  id: "voice-agent",
  name: "Voice Agent",
  instructions:  
    "You are a voice assistant that can help users with their tasks.",  
  model: openai("gpt-4o"),  
  voice: new GoogleVoice(),  
});  
  
// Use an audio file from a URL  
const audioStream = await createReadStream("./how_can_i_help_you.mp3");  
  
// Convert audio to text  
const transcript = await voiceAgent.voice.listen(audioStream);  
console.log(`User said: ${transcript}`);  
  
// Generate a response based on the transcript  
const { text } = await voiceAgent.generate(transcript);  

```

--------------------------------

### Define Writing Agent Description (TypeScript)

Source: https://mastra.ai/docs/v1/agents/networks

Defines a writing agent for an agent network. Its description highlights its function: transforming researched material into well-structured written content, producing full-paragraph reports suitable for articles or blog posts.

```typescript
export const writingAgent = new Agent({
  id: "writing-agent",
  name: "Writing Agent",
  description: `This agent turns researched material into well-structured  
    written content. It produces full-paragraph reports with no bullet points,  
    suitable for use in articles, summaries, or blog posts.`,
  // ...
});
```

--------------------------------

### Configure TypeScript tsconfig.json

Source: https://mastra.ai/docs/v1/frameworks/web-frameworks/vite-react

Modifies the `tsconfig.json` file to exclude specific directories from TypeScript compilation. This is necessary to prevent Mastra's internal files from being processed.

```json
{
  ...
  "exclude": ["dist", ".mastra"]
}
```

--------------------------------

### Write Custom Events to Stream in Mastra Tool

Source: https://mastra.ai/docs/v1/streaming/tool-streaming

This code snippet demonstrates how to write custom events to the stream from within a Mastra tool's execute function using `context.writer.write()`. It shows emitting 'pending' and 'success' status updates before and after an asynchronous operation (e.g., an API call).

```typescript
import { createTool } from "@mastra/core/tools";  
  
export const testTool = createTool({
  // ...  
  execute: async (inputData, context) => {
    const { value } = inputData;

   await context?.writer?.write({
      type: "custom-event",  
      status: "pending"
    });  

    const response = await fetch(...);  

   await context?.writer?.write({
      type: "custom-event",  
      status: "success"
    });  

    return {
      value: ""  
    };
  }
});  

```

--------------------------------

### Access Request Context in Mastra Workflows (TypeScript)

Source: https://mastra.ai/docs/v1/workflows/overview

Demonstrates how to access and utilize request-specific values from the RequestContext within a Mastra AI workflow step. This allows for dynamic behavior adjustment based on user tier or other request attributes. It relies on the `createStep` function and assumes `requestContext` is available.

```typescript
export type UserTier = {
  "user-tier": "enterprise" | "pro";
};

const step1 = createStep({
  // ...
  execute: async ({ requestContext }) => {
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];

    const maxResults = userTier === "enterprise"
      ? 1000
      : 50;

    return { maxResults };
  }
});
```

--------------------------------

### Configure Workflow-Level Retries with retryConfig

Source: https://mastra.ai/docs/v1/workflows/error-handling

Set a default retry configuration for all steps within a workflow. This applies if individual steps do not have their own `retries` property defined. It specifies the number of attempts and the delay between retries in milliseconds.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const step1 = createStep({...});

export const testWorkflow = createWorkflow({
  // ...
  retryConfig: {
    attempts: 5,
    delay: 2000
  }
})
  .then(step1)
  .commit();

```

--------------------------------

### Normalize User Messages with UnicodeNormalizer | Mastra TS

Source: https://mastra.ai/docs/v1/agents/guardrails

This code snippet shows how to use the UnicodeNormalizer input processor to clean and normalize user input. It standardizes whitespace and removes problematic symbols, improving the LLM's understanding of messages.

```typescript
import { UnicodeNormalizer } from "@mastra/core/processors";

export const normalizedAgent = new Agent({
  id: "normalized-agent",
  name: "Normalized Agent",
  // ...
  inputProcessors: [
    new UnicodeNormalizer({
      stripControlChars: true,
      collapseWhitespace: true,
    }),
  ],
});
```

--------------------------------

### Analyze High Gluten-Free Recipe (TypeScript)

Source: https://mastra.ai/docs/v1/evals/custom-scorers

This snippet demonstrates how to use the glutenCheckerScorer to analyze a recipe that is confirmed to be gluten-free. It takes user input describing the recipe and an expected output, then logs the score, gluten sources, and the reasoning behind the gluten-free classification. Dependencies include the glutenCheckerScorer and its associated run method.

```typescript
const result = await glutenCheckerScorer.run({
  input: [{ role: 'user', content: 'Mix rice, beans, and vegetables' }],
  output: { text: 'Mix rice, beans, and vegetables' },
});

console.log('Score:', result.score);
console.log('Gluten sources:', result.analyzeStepResult.glutenSources);
console.log('Reason:', result.reason);
```

--------------------------------

### Chunk Document using Sentence Strategy

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

Splits a document into chunks while preserving sentence structure, suitable for texts where sentence integrity is important. Configuration includes max/min chunk size, overlap, sentence enders, and an option to keep the separator.

```javascript
const chunks = await doc.chunk({  
  strategy: "sentence",  
  maxSize: 450,  
  minSize: 50,  
  overlap: 0,  
  sentenceEnders: ["."],  
  keepSeparator: true,  
});  
```

--------------------------------

### Manually Abort Requests using AbortController in TypeScript

Source: https://mastra.ai/docs/v1/server-db/mastra-client

Provides a function to manually abort any ongoing requests associated with the initialized AbortController. This is used in conjunction with the AbortSignal passed to the MastraClient constructor.

```typescript
import { mastraClient, controller } from "lib/mastra-client";  
  
const handleAbort = () => {
  controller.abort();
};

```

--------------------------------

### Configure Embedding Dimensions with OpenAI

Source: https://mastra.ai/docs/v1/rag/chunking-and-embedding

Reduces the dimensionality of embeddings generated by OpenAI's text-embedding-3 models for storage and computational efficiency. This is achieved by specifying the 'dimensions' parameter during model initialization.

```javascript
const { embeddings } = await embedMany({  
  model: openai.embedding("text-embedding-3-small", {  
    dimensions: 256, // Only supported in text-embedding-3 and later  
  }),  
  values: chunks.map((chunk) => chunk.text),  
});  
```

--------------------------------

### Handle RequestContext Data in Mastra API Route

Source: https://mastra.ai/docs/v1/frameworks/agentic-uis/ai-sdk

This server-side code processes incoming chat messages and additional data, populating the `RequestContext` before passing it to a Mastra agent. It uses `@mastra/core/request-context`.

```typescript
import { mastra } from "../../../mastra";
import { RequestContext } from "@mastra/core/request-context";

export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const myAgent = mastra.getAgent("weatherAgent");

  const requestContext = new RequestContext();

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      requestContext.set(key, value);
    }
  }

  const stream = await myAgent.stream(messages, {
    requestContext,
    format: "aisdk",
  });
  return stream.toUIMessageStreamResponse();
}

```

--------------------------------

### Define an Inngest Workflow Step

Source: https://mastra.ai/docs/v1/workflows/inngest-workflow

Defines an individual step for an Inngest workflow using Mastra's `createStep` function. This step is designed to increment a numerical value, specifying input and output schemas using Zod for validation.

```typescript
import { z } from "zod";  
import { inngest } from "../inngest";  
import { init } from "@mastra/inngest";  
  
// Initialize Inngest with Mastra, pointing to your local Inngest server  
const { createWorkflow, createStep } = init(inngest);  
  
// Step: Increment the counter value  
const incrementStep = createStep({  
  id: "increment",  
  inputSchema: z.object({  
    value: z.number(),  
  }),  
  outputSchema: z.object({  
    value: z.number(),  
  }),  
  execute: async ({ inputData }) => {  
    return { value: inputData.value + 1 };  
  },  
});  

```

--------------------------------

### Disable All Tracing (Never Sampling)

Source: https://mastra.ai/docs/v1/observability/tracing/overview

Disables tracing entirely. Useful for environments where tracing adds no value or for temporary disabling without removing configuration.

```yaml
sampling: {
  type: "never";
}
```

--------------------------------

### Implement Conditional Branching in Workflows

Source: https://mastra.ai/docs/v1/workflows/error-handling

Create alternative execution paths in a workflow based on the output status of a previous step. This allows the workflow to dynamically choose the next step to execute, such as proceeding to `step2` on success or to `fallback` on error.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const step1 = createStep({
  // ...
  execute: async () => {
    try {
      const response = await // ...

      if (!response.ok) {
        throw new Error('error');
      }

      return {
        status: "ok"
      };
    } catch (error) {
      return {
        status: "error"
      };
    }
  }
});

const step2 = createStep({...});
const fallback = createStep({...});

export const testWorkflow = createWorkflow({
  // ...
})
  .then(step1)
  .branch([
    [async ({ inputData: { status } }) => status === "ok", step2],
    [async ({ inputData: { status } }) => status === "error", fallback]
  ])
  .commit();

```

--------------------------------

### CORS Support Middleware

Source: https://mastra.ai/docs/v1/server-db/middleware

Middleware to handle Cross-Origin Resource Sharing (CORS) by setting appropriate headers like 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', and 'Access-Control-Allow-Headers'. It also handles OPTIONS requests.

```javascript
{
  handler: async (c, next) => {
    c.header('Access-Control-Allow-Origin', '*');
    c.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    c.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    await next();
  },
}
```

--------------------------------

### Conditionally Select Memory with RequestContext

Source: https://mastra.ai/docs/v1/agents/agent-memory

Dynamically selects memory configurations based on request context, such as user tier. This allows for tailored memory behavior for different user segments or request types.

```typescript
export type UserTier = {
  "user-tier": "enterprise" | "pro";
};

const premiumMemory = new Memory({
  // ...
});

const standardMemory = new Memory({
  // ...
});

export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'Memory Agent',
  // ...
  memory: ({ requestContext }) => {
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];

    return userTier === "enterprise" ? premiumMemory : standardMemory;
  },
});

```

--------------------------------

### TokenLimiter for LLM Context Limit - JavaScript

Source: https://mastra.ai/docs/v1/memory/memory-processors

The TokenLimiter processor prevents exceeding LLM context window limits by removing oldest messages until the token count is below a specified limit. It uses the 'o200k_base' encoding by default, but custom encodings like 'cl100k_base' can be specified for different models. Ensure TokenLimiter is placed last in the processor chain.

```javascript
import { Memory } from "@mastra/memory";
import { TokenLimiter } from "@mastra/memory/processors";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  model: openai("gpt-4o"),
  memory: new Memory({
    processors: [
      // Ensure the total tokens from memory don't exceed ~127k
      new TokenLimiter(127000),
    ],
  }),
});

```

```javascript
// Import the encoding you need (e.g., for older OpenAI models)
import cl100k_base from "js-tiktoken/ranks/cl100k_base";

const memoryForOlderModel = new Memory({
  processors: [
    new TokenLimiter({
      limit: 16000, // Example limit for a 16k context model
      encoding: cl100k_base,
    }),
  ],
});

```