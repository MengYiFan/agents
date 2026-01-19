import { InMemoryTokenStore, type TokenStore } from "./tokenStore.js";
import { createSentryMcpClient, type McpClientWrapper } from "./mcpClient.js";

// ============ 类型定义 ============

export interface SentryMcpConfig {
  baseUrl?: string;
  token?: string;
  organizationSlug?: string;
  projectSlug?: string;
  defaultLimit?: number;
  sessionKey?: string;
  fetch?: typeof fetch;
  tokenStore?: TokenStore;
  useMcp?: boolean;
}

export interface SentryIssue {
  id: string;
  title: string;
  culprit?: string;
  project?: string;
  firstSeen?: string;
  lastSeen?: string;
  frequency?: number;
  level?: string;
  userCount?: number;
  tags?: Record<string, string>;
  permalink?: string;
  shortId?: string;
}

export interface SentryIssueAnnotation {
  riskId?: string;
  issueTypeId?: string;
  frequencyBandId?: string;
  confidence?: "low" | "medium" | "high";
  owner?: string;
  notes?: string;
  nextAction?: string;
}

export interface SentryAnnotatedIssue extends SentryIssue, SentryIssueAnnotation {
  riskLabel?: string;
  issueTypeLabel?: string;
  frequencyBandLabel?: string;
}

export interface TaxonomyEntry {
  id: string;
  label: string;
  description?: string;
  severity?: "low" | "medium" | "high" | "critical";
}

export interface SentryIssueTaxonomy {
  riskLevels: TaxonomyEntry[];
  issueTypes: TaxonomyEntry[];
  frequencyBands: TaxonomyEntry[];
}

// ============ 默认分类词典 ============

const defaultTaxonomy: SentryIssueTaxonomy = {
  riskLevels: [
    { id: "none", label: "无显著影响", description: "无需立即处理，记录即可。", severity: "low" },
    { id: "minor", label: "轻微风险", description: "不影响核心路径，常规跟进。", severity: "medium" },
    { id: "major", label: "中高风险", description: "影响局部用户或关键指标，需要尽快修复。", severity: "high" },
    { id: "critical", label: "严重/广泛影响", description: "影响大量用户或阻断核心业务，需即时告警。", severity: "critical" },
  ],
  issueTypes: [
    { id: "stability", label: "代码健壮性", description: "空指针、边界条件或异常处理缺失。" },
    { id: "dependency", label: "第三方依赖", description: "外部 SDK 或服务不可用导致。" },
    { id: "internal-service", label: "内部依赖", description: "内部 RPC/DB/缓存等故障。" },
    { id: "network", label: "网络问题", description: "链路抖动、DNS、证书等网络相关问题。" },
    { id: "deployment", label: "发布变更", description: "版本升级、配置或特性开关引入的问题。" },
  ],
  frequencyBands: [
    { id: "sporadic", label: "偶发", description: "3 天内少于 5 次。" },
    { id: "repeating", label: "重复", description: "3 天 5-20 次，需关注趋势。" },
    { id: "frequent", label: "频繁", description: "3 天 20-40 次，影响面扩大。" },
    { id: "storm", label: "高频/爆发", description: "3 天超过 40 次，需立即处理。" },
  ],
};

const resolveTaxonomy = (overrides?: Partial<SentryIssueTaxonomy>): SentryIssueTaxonomy => ({
  riskLevels: overrides?.riskLevels ?? defaultTaxonomy.riskLevels,
  issueTypes: overrides?.issueTypes ?? defaultTaxonomy.issueTypes,
  frequencyBands: overrides?.frequencyBands ?? defaultTaxonomy.frequencyBands,
});

// ============ 自动分类算法 ============

const ISSUE_TYPE_PATTERNS: Array<{ id: string; patterns: RegExp[] }> = [
  {
    id: "network",
    patterns: [
      /timeout/i, /ECONNREFUSED/i, /ENOTFOUND/i, /dns/i, /ssl/i, /certificate/i,
      /network/i, /socket/i, /connection reset/i, /ETIMEDOUT/i,
    ],
  },
  {
    id: "dependency",
    patterns: [
      /third[- ]?party/i, /external/i, /sdk/i, /api/i, /service unavailable/i,
      /503/i, /502/i, /gateway/i,
    ],
  },
  {
    id: "internal-service",
    patterns: [
      /database/i, /mysql/i, /postgres/i, /redis/i, /mongo/i, /rpc/i,
      /grpc/i, /kafka/i, /rabbitmq/i, /internal/i, /cache/i,
    ],
  },
  {
    id: "deployment",
    patterns: [
      /deploy/i, /release/i, /version/i, /config/i, /feature[- ]?flag/i,
      /migration/i, /rollback/i,
    ],
  },
  {
    id: "stability",
    patterns: [
      /null/i, /undefined/i, /typeerror/i, /referenceerror/i, /cannot read/i,
      /is not a function/i, /index out of/i, /assertion/i,
    ],
  },
];

/**
 * 根据 Issue 标题和 culprit 匹配问题类型
 */
function matchIssueType(title?: string, culprit?: string): string {
  const text = `${title ?? ""} ${culprit ?? ""}`;

  for (const { id, patterns } of ISSUE_TYPE_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(text))) {
      return id;
    }
  }

  return "stability";
}

/**
 * 根据 level 和 userCount 推断风险等级
 */
function deriveRiskLevel(level?: string, userCount?: number): string {
  const normalizedLevel = level?.toLowerCase() ?? "";
  const users = userCount ?? 0;

  if (normalizedLevel === "fatal" || normalizedLevel === "critical" || users >= 100) {
    return "critical";
  }

  if (normalizedLevel === "error" && users >= 10) {
    return "major";
  }

  if (normalizedLevel === "error" || users >= 5) {
    return "minor";
  }

  return "none";
}

/**
 * 根据 frequency 推断频率分档
 */
function deriveFrequencyBand(frequency?: number): string {
  const freq = frequency ?? 0;

  if (freq >= 40) {
    return "storm";
  }

  if (freq >= 20) {
    return "frequent";
  }

  if (freq >= 5) {
    return "repeating";
  }

  return "sporadic";
}

/**
 * 推断分类置信度
 */
function deriveConfidence(issue: SentryIssue): "low" | "medium" | "high" {
  let score = 0;

  if (issue.level) score += 1;
  if (issue.userCount && issue.userCount > 0) score += 1;
  if (issue.frequency && issue.frequency > 0) score += 1;
  if (issue.title && issue.title.length > 20) score += 1;

  if (score >= 3) {
    return "high";
  }

  if (score >= 2) {
    return "medium";
  }

  return "low";
}

/**
 * 自动分类单个 Issue
 */
export function autoClassify(issue: SentryIssue): SentryIssueAnnotation {
  return {
    riskId: deriveRiskLevel(issue.level, issue.userCount),
    issueTypeId: matchIssueType(issue.title, issue.culprit),
    frequencyBandId: deriveFrequencyBand(issue.frequency),
    confidence: deriveConfidence(issue),
  };
}

/**
 * 批量自动分类 Issues
 */
export function autoClassifyAll(issues: SentryIssue[]): Record<string, SentryIssueAnnotation> {
  const result: Record<string, SentryIssueAnnotation> = {};

  for (const issue of issues) {
    result[issue.id] = autoClassify(issue);
  }

  return result;
}

// ============ Session 管理（REST API 模式） ============

class SentrySessionManager {
  private readonly store: TokenStore;
  private readonly sessionKey: string;

  constructor(sessionKey: string, store?: TokenStore) {
    this.sessionKey = sessionKey;
    this.store = store ?? new InMemoryTokenStore();
  }

  async getSessionCookie(): Promise<string | undefined> {
    const token = await this.store.getToken(this.sessionKey);

    return token?.accessToken;
  }

  async saveSessionCookie(cookie: string): Promise<void> {
    await this.store.setToken(this.sessionKey, { accessToken: cookie });
  }
}

// ============ REST API Client（保留作为 Fallback） ============

export class SentryRestClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly defaultLimit: number;
  private readonly organizationSlug?: string;
  private readonly projectSlug?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly sessionManager: SentrySessionManager;

  constructor(config: SentryMcpConfig = {}) {
    const fetchImpl = config.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error("fetch is not available. Provide a fetch implementation in the config.");
    }

    this.baseUrl = (config.baseUrl ?? process.env.SENTRY_API_BASE_URL ?? process.env.SENTRY_MCP_BASE_URL ?? "").replace(/\/$/, "");
    if (!this.baseUrl) {
      throw new Error("Sentry baseUrl is not configured. Set SENTRY_API_BASE_URL or pass via config.baseUrl.");
    }

    this.token = config.token ?? process.env.SENTRY_AUTH_TOKEN ?? process.env.SENTRY_MCP_TOKEN ?? "";
    if (!this.token) {
      throw new Error("Sentry token is not configured. Set SENTRY_AUTH_TOKEN or pass via config.token.");
    }

    this.defaultLimit = config.defaultLimit ?? 20;
    this.organizationSlug = config.organizationSlug ?? process.env.SENTRY_ORG;
    this.projectSlug = config.projectSlug ?? process.env.SENTRY_PROJECT;
    this.fetchImpl = fetchImpl;
    this.sessionManager = new SentrySessionManager(config.sessionKey ?? "sentry-rest", config.tokenStore);
  }

  private async authorizedFetch(url: string): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    };

    const cookie = await this.sessionManager.getSessionCookie();
    if (cookie) {
      headers.Cookie = cookie;
    }

    const response = await this.fetchImpl(url, { headers });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      await this.sessionManager.saveSessionCookie(setCookie);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sentry request failed (${response.status}): ${text}`);
    }

    return response;
  }

  private buildIssuesUrl(limit: number): string {
    if (!this.organizationSlug || !this.projectSlug) {
      throw new Error("organizationSlug and projectSlug are required for REST API mode.");
    }

    const params = new URLSearchParams({ limit: String(limit) });
    params.set("sort", "freq");

    return `${this.baseUrl}/api/0/projects/${this.organizationSlug}/${this.projectSlug}/issues/?${params.toString()}`;
  }

  async fetchIssues(limit = this.defaultLimit): Promise<SentryIssue[]> {
    const url = this.buildIssuesUrl(limit);
    const response = await this.authorizedFetch(url);
    const data = (await response.json()) as Array<Record<string, unknown>>;

    return data.map((item, index) => ({
      id: String(item.id ?? index),
      title: String(item.title ?? "Unknown issue"),
      culprit: item.culprit ? String(item.culprit) : undefined,
      project: item.project ? String((item.project as Record<string, unknown>)?.slug) : undefined,
      firstSeen: item.firstSeen ? String(item.firstSeen) : undefined,
      lastSeen: item.lastSeen ? String(item.lastSeen) : undefined,
      frequency: typeof item.count === "number" ? item.count : 0,
      level: item.level ? String(item.level) : undefined,
      userCount: typeof item.userCount === "number" ? item.userCount : 0,
      permalink: item.permalink ? String(item.permalink) : undefined,
      shortId: item.shortId ? String(item.shortId) : undefined,
    }));
  }
}

// ============ MCP Client（基于官方 sentry-mcp-stdio） ============

export class SentryMcpClientV2 {
  private mcpClient: McpClientWrapper | null = null;
  private readonly organizationSlug: string;
  private readonly projectSlug?: string;
  private readonly authToken?: string;

  constructor(config: SentryMcpConfig = {}) {
    this.organizationSlug = config.organizationSlug ?? process.env.SENTRY_ORG ?? "";
    this.projectSlug = config.projectSlug ?? process.env.SENTRY_PROJECT;
    this.authToken = config.token ?? process.env.SENTRY_AUTH_TOKEN;

    if (!this.organizationSlug) {
      throw new Error("organizationSlug is required. Set SENTRY_ORG or pass via config.");
    }
  }

  private getMcpClient(): McpClientWrapper {
    if (!this.mcpClient) {
      this.mcpClient = createSentryMcpClient(this.authToken);
    }

    return this.mcpClient;
  }

  /**
   * 通过 MCP 获取项目 Issues
   */
  async fetchIssues(limit = 20): Promise<SentryIssue[]> {
    if (!this.projectSlug) {
      throw new Error("projectSlug is required. Set SENTRY_PROJECT or pass via config.");
    }

    const client = this.getMcpClient();
    const result = await client.callTool<string>({
      toolName: "list_project_issues",
      arguments: {
        organization_slug: this.organizationSlug,
        project_slug: this.projectSlug,
        view: "detailed",
        format: "plain",
      },
    });

    return this.parseIssuesFromMcp(result, limit);
  }

  /**
   * 获取单个 Issue 详情
   */
  async getIssue(issueId: string): Promise<SentryIssue | null> {
    const client = this.getMcpClient();
    const result = await client.callTool<string>({
      toolName: "get_sentry_issue",
      arguments: {
        issue_id_or_url: issueId,
        view: "detailed",
        format: "plain",
      },
    });

    return this.parseIssueFromMcp(result);
  }

  /**
   * 列出可用项目
   */
  async listProjects(): Promise<Array<{ slug: string; name: string }>> {
    const client = this.getMcpClient();
    const result = await client.callTool<string>({
      toolName: "list_projects",
      arguments: {
        organization_slug: this.organizationSlug,
        view: "summary",
        format: "plain",
      },
    });

    return this.parseProjectsFromMcp(result);
  }

  /**
   * 断开 MCP 连接
   */
  async disconnect(): Promise<void> {
    if (this.mcpClient) {
      await this.mcpClient.disconnect();
      this.mcpClient = null;
    }
  }

  private parseIssuesFromMcp(content: string, limit: number): SentryIssue[] {
    const lines = content.split("\n").filter((line) => line.trim());
    const issues: SentryIssue[] = [];

    for (const line of lines) {
      if (issues.length >= limit) break;

      const match = line.match(/^(?:\d+\.\s*)?(?:\[([^\]]+)\])?\s*(.+?)(?:\s*-\s*(\d+)\s*events?)?$/i);
      if (match) {
        issues.push({
          id: String(issues.length + 1),
          shortId: match[1] || undefined,
          title: match[2]?.trim() || "Unknown",
          frequency: match[3] ? parseInt(match[3], 10) : undefined,
        });
      }
    }

    return issues;
  }

  private parseIssueFromMcp(content: string): SentryIssue | null {
    if (!content || content.includes("not found")) {
      return null;
    }

    const titleMatch = content.match(/title[:\s]+(.+)/i);
    const idMatch = content.match(/(?:id|short_?id)[:\s]+(\S+)/i);
    const levelMatch = content.match(/level[:\s]+(\w+)/i);
    const countMatch = content.match(/(?:count|events?)[:\s]+(\d+)/i);

    return {
      id: idMatch?.[1] || "unknown",
      title: titleMatch?.[1]?.trim() || content.slice(0, 100),
      level: levelMatch?.[1],
      frequency: countMatch ? parseInt(countMatch[1], 10) : undefined,
    };
  }

  private parseProjectsFromMcp(content: string): Array<{ slug: string; name: string }> {
    const lines = content.split("\n").filter((line) => line.trim());
    const projects: Array<{ slug: string; name: string }> = [];

    for (const line of lines) {
      const match = line.match(/^[-*\d.)\s]*(.+?)(?:\s*\(([^)]+)\))?$/);
      if (match) {
        const name = match[1]?.trim() || "";
        const slug = match[2]?.trim() || name.toLowerCase().replace(/\s+/g, "-");
        if (name) {
          projects.push({ slug, name });
        }
      }
    }

    return projects;
  }
}

// ============ 统一入口（支持双模式） ============

export class SentryMcpClient {
  private readonly mcpClient?: SentryMcpClientV2;
  private readonly restClient?: SentryRestClient;
  private readonly useMcp: boolean;
  private readonly defaultLimit: number;

  constructor(config: SentryMcpConfig = {}) {
    this.useMcp = config.useMcp ?? true;
    this.defaultLimit = config.defaultLimit ?? 20;

    if (this.useMcp) {
      this.mcpClient = new SentryMcpClientV2(config);
    } else {
      this.restClient = new SentryRestClient(config);
    }
  }

  /**
   * 获取 Issues
   */
  async fetchIssues(limit = this.defaultLimit): Promise<SentryIssue[]> {
    if (this.useMcp && this.mcpClient) {
      return this.mcpClient.fetchIssues(limit);
    }

    if (this.restClient) {
      return this.restClient.fetchIssues(limit);
    }

    throw new Error("No client available");
  }

  /**
   * 获取 Issues 并自动分类
   */
  async fetchAndClassify(limit = this.defaultLimit): Promise<{
    issues: SentryIssue[];
    annotations: Record<string, SentryIssueAnnotation>;
    annotated: SentryAnnotatedIssue[];
  }> {
    const issues = await this.fetchIssues(limit);
    const annotations = autoClassifyAll(issues);
    const annotated = this.annotateIssues(issues, annotations);

    return { issues, annotations, annotated };
  }

  /**
   * 构建分类词典
   */
  buildTaxonomy(overrides?: Partial<SentryIssueTaxonomy>): SentryIssueTaxonomy {
    return resolveTaxonomy(overrides);
  }

  /**
   * 将打标结果附加到 Issues
   */
  annotateIssues(
    issues: SentryIssue[],
    annotations: Record<string, SentryIssueAnnotation>,
    overrides?: Partial<SentryIssueTaxonomy>,
  ): SentryAnnotatedIssue[] {
    const taxonomy = resolveTaxonomy(overrides);
    const riskMap = new Map(taxonomy.riskLevels.map((entry) => [entry.id, entry]));
    const typeMap = new Map(taxonomy.issueTypes.map((entry) => [entry.id, entry]));
    const freqMap = new Map(taxonomy.frequencyBands.map((entry) => [entry.id, entry]));

    return issues.map((issue) => {
      const annotation = annotations[issue.id] ?? {};
      const risk = annotation.riskId ? riskMap.get(annotation.riskId) : undefined;
      const type = annotation.issueTypeId ? typeMap.get(annotation.issueTypeId) : undefined;
      const freq = annotation.frequencyBandId ? freqMap.get(annotation.frequencyBandId) : undefined;

      return {
        ...issue,
        ...annotation,
        riskLabel: risk?.label,
        issueTypeLabel: type?.label,
        frequencyBandLabel: freq?.label,
      };
    });
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    if (this.mcpClient) {
      await this.mcpClient.disconnect();
    }
  }
}

export const sentryTaxonomyDefaults = defaultTaxonomy;
