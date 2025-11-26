import { InMemoryTokenStore, type TokenStore } from "./tokenStore.js";

export interface SentryMcpConfig {
  baseUrl?: string;
  token?: string;
  organizationSlug?: string;
  projectSlug?: string;
  defaultLimit?: number;
  sessionKey?: string;
  fetch?: typeof fetch;
  tokenStore?: TokenStore;
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

export class SentryMcpClient {
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
      throw new Error("fetch is not available in this runtime. Provide a fetch implementation in the config.");
    }

    this.baseUrl = (config.baseUrl ?? process.env.SENTRY_MCP_BASE_URL ?? process.env.SENTRY_API_BASE_URL ?? "").replace(/\/$/, "");
    if (!this.baseUrl) {
      throw new Error("Sentry MCP baseUrl is not configured. Set SENTRY_MCP_BASE_URL or pass via config.baseUrl.");
    }

    this.token = config.token ?? process.env.SENTRY_MCP_TOKEN ?? process.env.SENTRY_AUTH_TOKEN ?? "";
    if (!this.token) {
      throw new Error("Sentry MCP token is not configured. Set SENTRY_MCP_TOKEN or pass via config.token.");
    }

    this.defaultLimit = config.defaultLimit ?? 20;
    this.organizationSlug = config.organizationSlug ?? process.env.SENTRY_ORG;
    this.projectSlug = config.projectSlug ?? process.env.SENTRY_PROJECT;
    this.fetchImpl = fetchImpl;
    this.sessionManager = new SentrySessionManager(config.sessionKey ?? "sentry-mcp", config.tokenStore);
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
      throw new Error(`Sentry MCP request failed (${response.status}): ${text}`);
    }

    return response;
  }

  private buildIssuesUrl(limit: number): string {
    const params = new URLSearchParams({ limit: String(limit) });
    if (this.organizationSlug) params.set("organization", this.organizationSlug);
    if (this.projectSlug) params.set("project", this.projectSlug);
    params.set("sort", "-events");
    return `${this.baseUrl}/issues?${params.toString()}`;
  }

  async fetchIssues(limit = this.defaultLimit): Promise<SentryIssue[]> {
    const url = this.buildIssuesUrl(limit);
    const response = await this.authorizedFetch(url);
    const data = (await response.json()) as Array<Partial<SentryIssue>>;

    return data.map((item, index) => ({
      id: String(item.id ?? index),
      title: item.title ?? "Unknown issue",
      culprit: item.culprit,
      project: item.project,
      firstSeen: item.firstSeen,
      lastSeen: item.lastSeen,
      frequency: item.frequency ?? Number(item.tags?.event_count ?? 0),
      level: item.level,
      userCount: item.userCount ?? Number(item.tags?.user_count ?? 0),
      tags: item.tags,
      permalink: item.permalink,
    }));
  }

  buildTaxonomy(overrides?: Partial<SentryIssueTaxonomy>): SentryIssueTaxonomy {
    return resolveTaxonomy(overrides);
  }

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
}

export const sentryTaxonomyDefaults = defaultTaxonomy;
