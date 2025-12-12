import { Buffer } from "node:buffer";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import {
  GrafanaMcpClient,
  type GrafanaMcpConfig,
  type GrafanaSearchResult,
  type GrafanaDashboardResponse,
  type GrafanaDatasource,
} from "./client.js";

type GrafanaAction = "searchDashboards" | "getDashboard" | "listDatasources" | "getPanel" | "authenticate";

interface GrafanaCredentialsInput {
  baseUrl?: string;
  googleClientEmail?: string;
  googlePrivateKey?: string;
  googleTargetAudience?: string;
  serviceAccountJson?: string;
  clientId?: string;
  clientSecret?: string;
}

interface GrafanaOperationInput {
  action: GrafanaAction;
  query?: string;
  starred?: boolean;
  uid?: string;
  panelId?: number;
  method?: "oauth" | "browser";
  credentials?: GrafanaCredentialsInput;
}

interface GrafanaOperationResultBase {
  action: GrafanaAction;
}

interface GrafanaSearchResultPayload extends GrafanaOperationResultBase {
  action: "searchDashboards";
  results: GrafanaSearchResult[];
}

interface GrafanaDashboardResultPayload extends GrafanaOperationResultBase {
  action: "getDashboard";
  dashboard: GrafanaDashboardResponse;
}

interface GrafanaDatasourceResultPayload extends GrafanaOperationResultBase {
  action: "listDatasources";
  datasources: GrafanaDatasource[];
}

interface GrafanaPanelResultPayload extends GrafanaOperationResultBase {
  action: "getPanel";
  dashboardUid: string;
  panelId: number;
  dashboardTitle: string;
  panel: Record<string, unknown>;
}

type GrafanaOperationResult =
  | GrafanaSearchResultPayload
  | GrafanaDashboardResultPayload
  | GrafanaDatasourceResultPayload
  | GrafanaPanelResultPayload;

// 同一个 baseUrl + service account 组合共用一个客户端，避免重复登录。
const grafanaClientCache = new Map<string, GrafanaMcpClient>();

// 既支持直接传入 JSON 文本，也支持 base64 编码的服务账号内容。
const decodeServiceAccountJson = (input: string): { client_email?: string; private_key?: string } => {
  try {
    return JSON.parse(input) as { client_email?: string; private_key?: string };
  } catch (error) {
    try {
      const decoded = Buffer.from(input, "base64").toString("utf-8");
      return JSON.parse(decoded) as { client_email?: string; private_key?: string };
    } catch (innerError) {
      throw new Error("Failed to parse Grafana service account JSON. Ensure the content is valid JSON or base64-encoded JSON.");
    }
  }
};

const normalizePrivateKey = (key: string): string => key.replace(/\\n/g, "\n");

const resolveGrafanaConfig = (credentials?: GrafanaCredentialsInput): GrafanaMcpConfig => {
  // 逐层回退到环境变量，保证在工具参数缺省时也能构造完整配置。
  const baseUrl = credentials?.baseUrl ?? process.env.GRAFANA_BASE_URL ?? process.env.GRAFANA_URL;

  if (!baseUrl) {
    throw new Error(
      "Grafana baseUrl is not configured. Provide it via the tool input or the GRAFANA_BASE_URL/GRAFANA_URL environment variables.",
    );
  }

  const rawServiceAccountJson =
    credentials?.serviceAccountJson ??
    process.env.GRAFANA_SERVICE_ACCOUNT_JSON ??
    process.env.GRAFANA_GOOGLE_CREDENTIALS;

  let clientEmail =
    credentials?.googleClientEmail ??
    process.env.GRAFANA_GOOGLE_CLIENT_EMAIL ??
    process.env.GRAFANA_CLIENT_EMAIL;

  let privateKey =
    credentials?.googlePrivateKey ??
    process.env.GRAFANA_GOOGLE_PRIVATE_KEY ??
    process.env.GRAFANA_PRIVATE_KEY;

  if ((!clientEmail || !privateKey) && rawServiceAccountJson) {
    const parsed = decodeServiceAccountJson(rawServiceAccountJson);
    clientEmail = clientEmail ?? parsed.client_email;
    privateKey = privateKey ?? parsed.private_key;
  }

  // ADC 模式下允许 clientEmail 与 privateKey 为空。
  // if (!clientEmail || !privateKey) {
  //   throw new Error(
  //     "Grafana Google service account credentials are incomplete. Provide client email and private key via the tool input, environment variables, or a service account JSON blob.",
  //   );
  // }

  const targetAudience =
    credentials?.googleTargetAudience ??
    process.env.GRAFANA_GOOGLE_TARGET_AUDIENCE ??
    process.env.GRAFANA_IAP_TARGET_AUDIENCE ??
    undefined;

  const clientId = credentials?.clientId ?? process.env.GRAFANA_GOOGLE_CLIENT_ID;
  const clientSecret = credentials?.clientSecret ?? process.env.GRAFANA_GOOGLE_CLIENT_SECRET;

  return {
    baseUrl,
    googleAuth: {
      clientEmail,
      privateKey: privateKey ? normalizePrivateKey(privateKey) : undefined,
      targetAudience: targetAudience ?? baseUrl,
      clientId,
      clientSecret,
    },
  };
};

const getGrafanaClient = (credentials?: GrafanaCredentialsInput): GrafanaMcpClient => {
  // 统一调用 resolveGrafanaConfig，借助缓存复用底层 HTTP 会话。
  const config = resolveGrafanaConfig(credentials);
  const cacheKey = `${config.baseUrl}|${config.googleAuth.clientEmail}`;
  const cached = grafanaClientCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const client = new GrafanaMcpClient(config);
  grafanaClientCache.set(cacheKey, client);
  return client;
};

const grafanaTool = {
  id: "grafanaMcp",
  description:
    "与 Grafana MCP 服务交互，支持仪表盘搜索、仪表盘详情、数据源列表与面板定义解析，自动处理内部环境登录。",
  inputSchema: z.object({
    action: z
      .enum(["searchDashboards", "getDashboard", "listDatasources", "getPanel", "authenticate"])
      .describe("要执行的 Grafana 操作。"),
    query: z
      .string()
      .optional()
      .describe("搜索仪表盘时使用的关键字。仅在 action=searchDashboards 时有效。"),
    starred: z
      .boolean()
      .optional()
      .describe("是否仅搜索已收藏的仪表盘。仅在 action=searchDashboards 时有效。"),
    method: z
      .enum(["oauth", "browser"])
      .optional()
      .describe("认证方式。'browser' 为浏览器弹窗登录（推荐），'oauth' 为标准 OAuth2 流程（需配置 Client ID）。"),
    uid: z.string().optional().describe("仪表盘的唯一 UID。"),
    panelId: z.number().optional().describe("需要解析的面板 ID，仅在 action=getPanel 时必填。"),
    credentials: z
      .object({
        baseUrl: z.string().optional(),
        googleClientEmail: z.string().optional(),
        googlePrivateKey: z.string().optional(),
        googleTargetAudience: z.string().optional(),
        serviceAccountJson: z.string().optional(),
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
      })
      .describe(
        "**通常不需要提供**。仅在需要覆盖环境变量配置时使用。可传入 Grafana 基础地址与谷歌服务账号密钥信息。",
      ),
  }),
  execute: async ({ action, query, starred, uid, panelId, method, credentials }: GrafanaOperationInput): Promise<GrafanaOperationResult> => {
    const client = getGrafanaClient(credentials);

    switch (action) {
      case "searchDashboards": {
        // query is optional if starred is true
        const searchQuery = query ?? "";
        
        const results = await client.searchDashboards(searchQuery, starred);
        return { action, results };
      }
      case "getDashboard": {
        if (!uid) {
          throw new Error("获取仪表盘详情需要提供 uid 参数。");
        }

        const dashboard = await client.getDashboard(uid);
        return { action, dashboard };
      }
      case "listDatasources": {
        const datasources = await client.listDatasources();
        return { action, datasources };
      }
      case "getPanel": {
        if (!uid || typeof panelId !== "number") {
          throw new Error("解析面板定义需要同时提供 uid 与 panelId 参数。");
        }

        const { panel, dashboardTitle } = await client.getPanelDefinition(uid, panelId);
        return { action, dashboardUid: uid, panelId, dashboardTitle, panel };
      }
      case "authenticate": {
        await client.authenticate(method ?? "browser");
        return { action, message: "Authentication successful." } as any;
      }
      default: {
        throw new Error(`未支持的 Grafana 操作: ${action}`);
      }
    }
  },
};

import { geminiModel } from "../../models.js";

export const grafanaMcpAgent = new Agent({
  id: "grafana-mcp-agent",
  name: "grafana-mcp-agent",
  instructions:
    "封装 Grafana MCP 能力，能够通过谷歌 IAP 自动完成登录并检索关键监控信息。\n\n" +
    "你是一名熟悉 Grafana 的内部平台助手，能够基于结构化指令调用 grafanaMcp 工具执行搜索、读取仪表盘与面板配置等任务。\n\n" +
    "认证说明：\n" +
    "本 Agent 默认使用环境变量中的配置。如果未配置认证信息，**请优先建议用户运行 `login` 指令**，这将触发浏览器弹窗登录（零配置模式）。\n" +
    "如果用户未提供任何参数直接询问，尝试列出已收藏的仪表盘（action=searchDashboards, starred=true）。\n\n" +
    "快捷指令支持：\n" +
    "1. `check [仪表盘名称或UID]`: 搜索并查看仪表盘详情。\n" +
    "2. `info [仪表盘UID]`: 获取仪表盘的完整 JSON 定义。\n" +
    "3. `list`: 列出所有数据源。\n" +
    "4. `login`: 触发浏览器弹窗登录（推荐）。\n\n" +
    "如果用户提供的查询看起来像 UID（例如包含短横线或长度固定），优先尝试按 UID 获取；否则作为关键字搜索。",
  model: geminiModel,
  tools: { grafanaMcp: grafanaTool },
});
