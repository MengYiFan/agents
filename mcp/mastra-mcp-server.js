import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import http from "node:http";

const MASTRA_API_BASE =
  process.env.MASTRA_API_BASE?.replace(/\/$/, "") || "http://localhost:4111/api";
const MCP_PORT = Number(process.env.MCP_PORT) || 4120;

const server = new McpServer({
  name: "mastra-mcp-bridge",
  version: "0.1.0",
});

const registeredAgentTools = new Set();

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    const message = text || res.statusText;
    throw new Error(
      `Request failed: ${res.status} ${res.statusText} - ${message}`,
    );
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error?.message || String(error)}`);
  }
}

async function listAgents() {
  try {
    return await fetchJson(`${MASTRA_API_BASE}/agents`);
  } catch (error) {
    console.error(
      "[mastra-mcp] Unable to fetch agents. Is `npm run dev` running?",
      error,
    );
    return {};
  }
}

function normalizeMessages(input) {
  if (Array.isArray(input) && input.length > 0) {
    return input;
  }
  return [];
}

async function runAgent(agentId, args) {
  const { prompt, messages, threadId, resourceId, runId, output } = args;
  const finalMessages =
    normalizeMessages(messages).length > 0
      ? normalizeMessages(messages)
      : prompt
        ? [{ role: "user", content: prompt }]
        : null;

  if (!finalMessages) {
    throw new Error(
      "Either `prompt` (string) or `messages` (array) is required.",
    );
  }

  return fetchJson(`${MASTRA_API_BASE}/agents/${agentId}/generate`, {
    method: "POST",
    body: JSON.stringify({
      messages: finalMessages,
      threadId,
      resourceId,
      runId,
      output,
    }),
  });
}

function registerAgentTool(agentId, info) {
  if (registeredAgentTools.has(agentId)) {
    return;
  }

  const toolName = `mastra-${agentId}`;

  server.registerTool(
    toolName,
    {
      title: `Mastra Agent: ${info?.name || agentId}`,
      description: info?.instructions || `Invoke Mastra agent "${agentId}" via the Mastra REST API.`,
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description:
              "User prompt. If provided, it will be wrapped into a messages array.",
          },
          messages: {
            type: "array",
            description:
              "Optional OpenAI-style messages array; if missing, `prompt` is used.",
            items: { type: "object" },
          },
          threadId: { type: "string", description: "Optional thread identifier" },
          resourceId: {
            type: "string",
            description: "Resource/conversation identifier",
          },
          runId: { type: "string", description: "Optional run identifier" },
          output: {
            type: "object",
            description: "Optional structured output schema for the agent",
          },
        },
      },
    },
    async (params) => {
      const result = await runAgent(agentId, params || {});
      const text =
        typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2);

      return {
        content: [{ type: "text", text }],
        structuredContent: result,
      };
    },
  );

  registeredAgentTools.add(agentId);
}

server.registerTool(
  "mastra-list-agents",
  {
    title: "List Mastra Agents",
    description:
      "Fetch available agents from the Mastra dev server and return their metadata.",
    inputSchema: { type: "object", properties: {} },
  },
  async () => {
    const agents = await listAgents();
    Object.entries(agents || {}).forEach(([agentId, info]) =>
      registerAgentTool(agentId, info),
    );
    return {
      content: [{ type: "text", text: JSON.stringify(agents, null, 2) }],
      structuredContent: agents,
    };
  },
);

let lastAgentRefresh = 0;
const AGENT_REFRESH_INTERVAL_MS = 5_000;

async function bootstrapAgents(force = false) {
  const now = Date.now();
  if (!force && now - lastAgentRefresh < AGENT_REFRESH_INTERVAL_MS) {
    return;
  }
  const agents = await listAgents();
  Object.entries(agents || {}).forEach(([agentId, info]) =>
    registerAgentTool(agentId, info),
  );
  lastAgentRefresh = now;
}

bootstrapAgents(true).catch((error) => {
  console.error("[mastra-mcp] Failed to pre-load agents", error);
});

const httpServer = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "POST /mcp only" }));
    return;
  }

  if (req.url !== "/mcp") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  try {
    // Try to refresh agent list on every request (throttled) so late-started
    // Mastra dev servers still register tools before Copilot lists them.
    await bootstrapAgents();

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyText = Buffer.concat(chunks).toString("utf8");
    const body = bodyText ? JSON.parse(bodyText) : undefined;

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => transport.close());

    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (error) {
    console.error("[mastra-mcp] Request failed:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error?.message || "Server error" }));
  }
});

httpServer.listen(MCP_PORT, () => {
  console.log(
    `[mastra-mcp] MCP HTTP server listening on http://localhost:${MCP_PORT}/mcp`,
  );
  console.log(`[mastra-mcp] Using Mastra API at ${MASTRA_API_BASE}`);
  console.log(
    "[mastra-mcp] Ensure `npm run dev` is running so agents are reachable.",
  );
});
