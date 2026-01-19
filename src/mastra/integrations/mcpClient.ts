import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface McpClientConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface McpToolCallOptions {
  toolName: string;
  arguments: Record<string, unknown>;
}

/**
 * MCP Client 包装器，简化 STDIO 模式的 MCP Server 调用
 */
export class McpClientWrapper {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private readonly config: McpClientConfig;
  private isConnected = false;

  constructor(config: McpClientConfig) {
    this.config = config;
  }

  /**
   * 初始化并连接到 MCP Server
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const mergedEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        mergedEnv[key] = value;
      }
    }
    if (this.config.env) {
      for (const [key, value] of Object.entries(this.config.env)) {
        mergedEnv[key] = value;
      }
    }

    this.transport = new StdioClientTransport({
      command: this.config.command,
      args: this.config.args,
      env: mergedEnv,
    });

    this.client = new Client(
      { name: "mastra-mcp-client", version: "0.1.0" },
      { capabilities: {} },
    );

    await this.client.connect(this.transport);
    this.isConnected = true;
  }

  /**
   * 调用 MCP Tool
   */
  async callTool<T = unknown>(options: McpToolCallOptions): Promise<T> {
    if (!this.client || !this.isConnected) {
      await this.connect();
    }

    const result = await this.client!.callTool({
      name: options.toolName,
      arguments: options.arguments,
    });

    return this.extractToolResult<T>(result);
  }

  /**
   * 从 MCP 结果中提取实际数据
   */
  private extractToolResult<T>(result: unknown): T {
    const res = result as Record<string, unknown>;

    if ("toolResult" in res && res.toolResult !== undefined) {
      if (typeof res.toolResult === "string") {
        try {
          return JSON.parse(res.toolResult) as T;
        } catch {
          return res.toolResult as T;
        }
      }

      return res.toolResult as T;
    }

    const content = res.content as Array<{ type: string; text?: string }> | undefined;
    if (!content || content.length === 0) {
      throw new Error("MCP tool returned empty content");
    }

    const firstContent = content[0];

    if (firstContent.type === "text" && firstContent.text) {
      try {
        return JSON.parse(firstContent.text) as T;
      } catch {
        return firstContent.text as T;
      }
    }

    throw new Error(`Unsupported MCP content type: ${firstContent.type}`);
  }

  /**
   * 列出可用的 Tools
   */
  async listTools(): Promise<string[]> {
    if (!this.client || !this.isConnected) {
      await this.connect();
    }

    const result = await this.client!.listTools();

    return result.tools.map((tool) => tool.name);
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }
    this.client = null;
    this.isConnected = false;
  }
}

/**
 * 创建 Sentry MCP Client（STDIO 模式）
 */
export function createSentryMcpClient(authToken?: string): McpClientWrapper {
  const token = authToken ?? process.env.SENTRY_AUTH_TOKEN ?? process.env.SENTRY_AUTH;
  if (!token) {
    throw new Error("Sentry auth token is required. Set SENTRY_AUTH_TOKEN or pass authToken parameter.");
  }

  return new McpClientWrapper({
    command: "npx",
    args: ["-y", "@anthropic-ai/sentry-mcp-stdio"],
    env: {
      SENTRY_AUTH: token,
    },
  });
}
