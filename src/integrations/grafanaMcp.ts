import { Buffer } from "node:buffer";
import { JWT } from "google-auth-library";

export interface GrafanaGoogleAuthConfig {
  /**
   * Service account email used to mint Google ID tokens for the IAP-protected
   * Grafana instance.
   */
  clientEmail: string;
  /**
   * Private key paired with the service account email. The key should include
   * the PEM header/footer and line breaks. When sourcing the key from
   * environment variables replace escaped newlines ("\\n") with actual
   * newlines before passing it to the client.
   */
  privateKey: string;
  /**
   * Optional target audience configured for the Cloud IAP resource. When not
   * provided the Grafana base URL is used as the audience value.
   */
  targetAudience?: string;
}

export interface GrafanaMcpConfig {
  baseUrl: string;
  googleAuth: GrafanaGoogleAuthConfig;
  refreshMarginMs?: number;
  retryOnAuthFailure?: number;
  fetchImpl?: typeof fetch;
}

export interface GrafanaSearchResult {
  id: number;
  uid: string;
  title: string;
  uri: string;
  url: string;
  type: string;
  folderTitle?: string;
  folderUid?: string;
  tags?: string[];
}

export interface GrafanaDashboardResponse {
  dashboard: {
    uid: string;
    title: string;
    [key: string]: unknown;
  };
  meta: Record<string, unknown>;
}

export interface GrafanaDatasource {
  id: number;
  uid: string;
  name: string;
  type: string;
  access: string;
  url?: string;
  jsonData?: Record<string, unknown>;
  secureJsonFields?: Record<string, unknown>;
}

interface StoredCookie {
  name: string;
  value: string;
  expiresAt?: number;
}

interface CachedToken {
  token: string;
  expiresAt?: number;
}

const DEFAULT_REFRESH_MARGIN = 60 * 1000; // 60 seconds
const DEFAULT_MAX_REDIRECTS = 5;

const ensureLeadingSlash = (path: string): string => {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path;
};

const splitSetCookieHeader = (header: string): string[] => {
  const parts: string[] = [];
  let buffer = "";
  let inExpires = false;

  for (let i = 0; i < header.length; i += 1) {
    const char = header[i];

    if (char === "," && !inExpires) {
      parts.push(buffer.trim());
      buffer = "";
      continue;
    }

    if (!inExpires && header.slice(i, i + 8).toLowerCase() === "expires=") {
      inExpires = true;
    } else if (inExpires && char === ";") {
      inExpires = false;
    }

    buffer += char;
  }

  if (buffer) {
    parts.push(buffer.trim());
  }

  return parts.filter(Boolean);
};

const getSetCookieHeaders = (headers: Headers): string[] => {
  const rawHeaders = (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();

  if (Array.isArray(rawHeaders) && rawHeaders.length > 0) {
    return rawHeaders;
  }

  const header = headers.get("set-cookie");

  if (!header) {
    return [];
  }

  return splitSetCookieHeader(header);
};

const parseCookie = (cookie: string): StoredCookie | undefined => {
  const trimmed = cookie.trim();

  if (!trimmed) {
    return undefined;
  }

  const [nameValue, ...attributeSegments] = trimmed.split(";");

  if (!nameValue) {
    return undefined;
  }

  const nameValueParts = nameValue.split("=");
  const name = nameValueParts.shift()?.trim();

  if (!name || name.length === 0) {
    return undefined;
  }

  const value = nameValueParts.join("=").trim();
  const stored: StoredCookie = { name, value };

  for (const attribute of attributeSegments) {
    const [attributeName, attributeValue] = attribute.split("=");
    if (!attributeName) {
      continue;
    }

    const lowerName = attributeName.trim().toLowerCase();

    if (lowerName === "max-age" && attributeValue) {
      const seconds = Number.parseInt(attributeValue.trim(), 10);
      if (!Number.isNaN(seconds)) {
        stored.expiresAt = Date.now() + seconds * 1000;
      }
    }

    if (lowerName === "expires" && attributeValue && stored.expiresAt === undefined) {
      const timestamp = Date.parse(attributeValue.trim());
      if (!Number.isNaN(timestamp)) {
        stored.expiresAt = timestamp;
      }
    }
  }

  return stored;
};

const decodeJwtExpiration = (token: string): number | undefined => {
  const segments = token.split(".");
  if (segments.length < 2) {
    return undefined;
  }

  const payload = segments[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  const padded = `${normalized}${"=".repeat(paddingLength)}`;

  try {
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    const data = JSON.parse(decoded) as { exp?: number };

    if (typeof data.exp === "number") {
      return data.exp * 1000;
    }
  } catch (error) {
    // Ignore decode errors and fall back to the default refresh behaviour.
  }

  return undefined;
};

class GoogleIapTokenManager {
  private readonly client: JWT;

  private cachedToken?: CachedToken;

  constructor(
    private readonly config: Required<GrafanaGoogleAuthConfig> & { refreshMarginMs: number },
  ) {
    this.client = new JWT({
      email: config.clientEmail,
      key: config.privateKey,
    });
  }

  async getIdToken(): Promise<string> {
    const cached = this.cachedToken;

    if (cached && (!cached.expiresAt || Date.now() + this.config.refreshMarginMs < cached.expiresAt)) {
      return cached.token;
    }

    const token = await this.client.fetchIdToken(this.config.targetAudience);
    const expiresAt = decodeJwtExpiration(token);

    this.cachedToken = { token, expiresAt };

    return token;
  }
}

export class GrafanaMcpClient {
  private readonly baseUrl: string;

  private readonly refreshMarginMs: number;

  private readonly retryOnAuthFailure: number;

  private readonly maxRedirects: number;

  private readonly fetchImpl: typeof fetch;

  private readonly tokenManager: GoogleIapTokenManager;

  private readonly cookieJar = new Map<string, StoredCookie>();

  constructor(private readonly config: GrafanaMcpConfig) {
    const normalizedBaseUrl = config.baseUrl.replace(/\/+$/, "");

    if (!normalizedBaseUrl) {
      throw new Error("Grafana base URL must not be empty.");
    }

    this.baseUrl = normalizedBaseUrl;
    this.refreshMarginMs = config.refreshMarginMs ?? DEFAULT_REFRESH_MARGIN;
    this.retryOnAuthFailure = config.retryOnAuthFailure ?? 1;
    this.maxRedirects = DEFAULT_MAX_REDIRECTS;
    this.fetchImpl = config.fetchImpl ?? globalThis.fetch;

    if (!this.fetchImpl) {
      throw new Error(
        "fetch is not available in the current runtime. Provide a fetch implementation via the Grafana configuration.",
      );
    }

    const targetAudience = config.googleAuth.targetAudience ?? this.baseUrl;

    this.tokenManager = new GoogleIapTokenManager({
      clientEmail: config.googleAuth.clientEmail,
      privateKey: config.googleAuth.privateKey,
      targetAudience,
      refreshMarginMs: this.refreshMarginMs,
    });
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return `${this.baseUrl}${ensureLeadingSlash(path)}`;
  }

  private getCookieHeader(): string | undefined {
    const validCookies: string[] = [];

    for (const cookie of this.cookieJar.values()) {
      if (cookie.expiresAt && Date.now() + this.refreshMarginMs >= cookie.expiresAt) {
        continue;
      }

      validCookies.push(`${cookie.name}=${cookie.value}`);
    }

    if (validCookies.length === 0) {
      return undefined;
    }

    return validCookies.join("; ");
  }

  private storeResponseCookies(headers: Headers): void {
    const cookies = getSetCookieHeaders(headers);

    for (const cookie of cookies) {
      const parsed = parseCookie(cookie);

      if (!parsed) {
        continue;
      }

      this.cookieJar.set(parsed.name, parsed);
    }
  }

  private hasValidSession(): boolean {
    const session = this.cookieJar.get("grafana_session");

    if (!session) {
      return false;
    }

    if (!session.expiresAt) {
      return true;
    }

    return Date.now() + this.refreshMarginMs < session.expiresAt;
  }

  private isRedirect(status: number): boolean {
    return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
  }

  private async requestWithRedirect(
    path: string,
    init: RequestInit = {},
    redirectCount = 0,
  ): Promise<Response> {
    if (redirectCount > this.maxRedirects) {
      throw new Error(`Too many redirects while communicating with Grafana (>${this.maxRedirects}).`);
    }

    const url = this.buildUrl(path);
    const headers = new Headers(init.headers ?? {});
    const token = await this.tokenManager.getIdToken();

    headers.set("Authorization", `Bearer ${token}`);

    const cookieHeader = this.getCookieHeader();
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    const response = await this.fetchImpl(url, {
      ...init,
      headers,
      redirect: "manual",
    });

    this.storeResponseCookies(response.headers);

    if (this.isRedirect(response.status)) {
      const locationHeader = response.headers.get("location");

      if (!locationHeader) {
        return response;
      }

      const nextUrl = new URL(locationHeader, url);

      if (nextUrl.hostname.includes("accounts.google.com")) {
        throw new Error(
          "Received a redirect to Google Accounts while attempting automated Grafana login. Verify that the configured service account has access to the Grafana IAP resource and that the target audience is correct.",
        );
      }

      let nextMethod = init.method ?? "GET";
      let nextBody = init.body ?? undefined;

      if (
        response.status === 303 ||
        ((response.status === 301 || response.status === 302) && nextMethod !== "GET" && nextMethod !== "HEAD")
      ) {
        nextMethod = "GET";
        nextBody = undefined;
      }

      const nextInit: RequestInit = {
        ...init,
        method: nextMethod,
        body: nextBody ?? undefined,
      };

      nextInit.headers = undefined;

      try {
        await response.arrayBuffer();
      } catch (error) {
        // Ignore body read errors on redirect responses.
      }

      return this.requestWithRedirect(nextUrl.toString(), nextInit, redirectCount + 1);
    }

    return response;
  }

  private async ensureSession(): Promise<void> {
    if (this.hasValidSession()) {
      return;
    }

    this.cookieJar.delete("grafana_session");

    const response = await this.requestWithRedirect("/", { method: "GET" });

    if (response.status >= 400) {
      throw new Error(`Failed to establish Grafana session. Received status ${response.status}.`);
    }

    try {
      await response.arrayBuffer();
    } catch (error) {
      // Swallow errors while draining the bootstrap response body.
    }

    if (!this.hasValidSession()) {
      throw new Error(
        "Grafana session cookie was not obtained after the automated login flow. Confirm that the service account can access the Grafana instance.",
      );
    }
  }

  private async authorizedFetch(path: string, init: RequestInit = {}, attempt = 0): Promise<Response> {
    await this.ensureSession();

    const response = await this.requestWithRedirect(path, init);

    if ((response.status === 401 || response.status === 403) && attempt < this.retryOnAuthFailure) {
      this.cookieJar.delete("grafana_session");

      try {
        await response.arrayBuffer();
      } catch (error) {
        // Ignore body read failures while retrying authentication.
      }

      return this.authorizedFetch(path, init, attempt + 1);
    }

    return response;
  }

  async searchDashboards(query: string): Promise<GrafanaSearchResult[]> {
    const response = await this.authorizedFetch(`/api/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      const message = await this.safeReadError(response);
      throw new Error(`Grafana search failed with status ${response.status}: ${message}`);
    }

    return (await response.json()) as GrafanaSearchResult[];
  }

  async getDashboard(uid: string): Promise<GrafanaDashboardResponse> {
    const response = await this.authorizedFetch(`/api/dashboards/uid/${encodeURIComponent(uid)}`);

    if (!response.ok) {
      const message = await this.safeReadError(response);
      throw new Error(`Grafana dashboard fetch failed with status ${response.status}: ${message}`);
    }

    return (await response.json()) as GrafanaDashboardResponse;
  }

  async listDatasources(): Promise<GrafanaDatasource[]> {
    const response = await this.authorizedFetch("/api/datasources");

    if (!response.ok) {
      const message = await this.safeReadError(response);
      throw new Error(`Grafana datasource listing failed with status ${response.status}: ${message}`);
    }

    return (await response.json()) as GrafanaDatasource[];
  }

  async getPanelDefinition(uid: string, panelId: number): Promise<{ panel: Record<string, unknown>; dashboardTitle: string }> {
    const dashboard = await this.getDashboard(uid);
    const panel = this.findPanel(dashboard.dashboard, panelId);

    if (!panel) {
      throw new Error(`Panel ${panelId} was not found in dashboard ${uid}.`);
    }

    return { panel, dashboardTitle: dashboard.dashboard.title };
  }

  private async safeReadError(response: Response): Promise<string> {
    try {
      const data = await response.clone().json();

      if (data && typeof (data as { message?: unknown }).message === "string") {
        return (data as { message: string }).message;
      }

      return JSON.stringify(data);
    } catch (error) {
      try {
        return await response.clone().text();
      } catch (innerError) {
        return `Unable to read error response: ${(innerError as Error).message}`;
      }
    }
  }

  private findPanel(obj: unknown, panelId: number): Record<string, unknown> | undefined {
    if (!obj) {
      return undefined;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = this.findPanel(item, panelId);

        if (result) {
          return result;
        }
      }

      return undefined;
    }

    if (typeof obj === "object") {
      const record = obj as Record<string, unknown>;

      if (typeof record.id === "number" && record.id === panelId) {
        return record;
      }

      for (const value of Object.values(record)) {
        const result = this.findPanel(value, panelId);

        if (result) {
          return result;
        }
      }
    }

    return undefined;
  }
}
