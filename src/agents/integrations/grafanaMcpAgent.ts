import { Buffer } from "node:buffer";
import { Agent } from "mastra";
import {
  GrafanaMcpClient,
  type GrafanaMcpConfig,
  type GrafanaSearchResult,
  type GrafanaDashboardResponse,
  type GrafanaDatasource,
} from "../../integrations/grafanaMcp.js";

type GrafanaAction = "searchDashboards" | "getDashboard" | "listDatasources" | "getPanel";

interface GrafanaCredentialsInput {
  baseUrl?: string;
  googleClientEmail?: string;
  googlePrivateKey?: string;
  googleTargetAudience?: string;
  serviceAccountJson?: string;
}

interface GrafanaOperationInput {
  action: GrafanaAction;
  query?: string;
  uid?: string;
  panelId?: number;
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

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Grafana Google service account credentials are incomplete. Provide client email and private key via the tool input, environment variables, or a service account JSON blob.",
    );
  }

  const targetAudience =
    credentials?.googleTargetAudience ??
    process.env.GRAFANA_GOOGLE_TARGET_AUDIENCE ??
    process.env.GRAFANA_IAP_TARGET_AUDIENCE ??
    undefined;

  return {
    baseUrl,
    googleAuth: {
      clientEmail,
      privateKey: normalizePrivateKey(privateKey),
      targetAudience: targetAudience ?? baseUrl,
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
  name: "grafanaMcp",
  description:
    "与 Grafana MCP 服务交互，支持仪表盘搜索、仪表盘详情、数据源列表与面板定义解析，自动处理内部环境登录。",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["searchDashboards", "getDashboard", "listDatasources", "getPanel"],
        description: "要执行的 Grafana 操作。",
      },
      query: {
        type: "string",
        description: "搜索仪表盘时使用的关键字。仅在 action=searchDashboards 时有效。",
      },
      uid: {
        type: "string",
        description: "仪表盘的唯一 UID。",
      },
      panelId: {
        type: "number",
        description: "需要解析的面板 ID，仅在 action=getPanel 时必填。",
      },
      credentials: {
        type: "object",
        description:
          "可选的临时凭据覆盖项，可传入 Grafana 基础地址与谷歌服务账号密钥信息（clientEmail、privateKey、targetAudience 或完整 serviceAccountJson）。",
        properties: {
          baseUrl: { type: "string" },
          googleClientEmail: { type: "string" },
          googlePrivateKey: { type: "string" },
          googleTargetAudience: { type: "string" },
          serviceAccountJson: { type: "string" },
        },
      },
    },
    required: ["action"],
  },
  execute: async ({ action, query, uid, panelId, credentials }: GrafanaOperationInput): Promise<GrafanaOperationResult> => {
    const client = getGrafanaClient(credentials);

    switch (action) {
      case "searchDashboards": {
        if (!query) {
          throw new Error("搜索仪表盘需要提供 query 参数。");
        }

        const results = await client.searchDashboards(query);
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
      default: {
        throw new Error(`未支持的 Grafana 操作: ${action}`);
      }
    }
  },
};

export const grafanaMcpAgent = new Agent({
  name: "grafana-mcp-agent",
  instructions: "封装 Grafana MCP 能力，能够通过谷歌 IAP 自动完成登录并检索关键监控信息。",
  system:
    "你是一名熟悉 Grafana 的内部平台助手，能够基于结构化指令调用 grafanaMcp 工具执行搜索、读取仪表盘与面板配置等任务。",
  tools: [grafanaTool],
});
