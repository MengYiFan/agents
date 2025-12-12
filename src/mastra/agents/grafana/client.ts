import { Buffer } from "node:buffer";
import { GoogleAuth } from "google-auth-library";
import { GoogleOAuthManager, PuppeteerAuthManager } from "../../auth/index.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

export interface GrafanaGoogleAuthConfig {
  /**
   * Optional service account email. If omitted, ADC will attempt to find credentials.
   */
  clientEmail?: string;
  /**
   * Optional private key. If omitted, ADC will attempt to find credentials.
   */
  privateKey?: string;
  /**
   * Optional target audience configured for the Cloud IAP resource. When not
   * provided the Grafana base URL is used as the audience value.
   */
  targetAudience?: string;
  clientId?: string;
  clientSecret?: string;
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
  private readonly auth?: GoogleAuth;
  private readonly oauthManager?: GoogleOAuthManager;
  private client?: any;

  private cachedToken?: CachedToken;

  constructor(
    private readonly config: Required<GrafanaGoogleAuthConfig> & { refreshMarginMs: number },
  ) {
    if (config.clientId && config.clientSecret) {
      this.oauthManager = new GoogleOAuthManager(config.clientId, config.clientSecret);
    } else {
      const authOptions: any = {
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      };

      if (config.clientEmail && config.privateKey) {
        authOptions.credentials = {
          client_email: config.clientEmail,
          private_key: config.privateKey,
        };
      }

      this.auth = new GoogleAuth(authOptions);
    }
  }

  async authenticate(): Promise<void> {
    if (this.oauthManager) {
      const tokens = await this.oauthManager.authenticate();
      if (tokens.id_token) {
        this.cachedToken = {
          token: tokens.id_token,
          expiresAt: tokens.expiry_date ? tokens.expiry_date : undefined,
        };
      }
    }
  }

  async getIdToken(): Promise<string> {
    const cached = this.cachedToken;

    if (cached && (!cached.expiresAt || Date.now() + this.config.refreshMarginMs < cached.expiresAt)) {
      return cached.token;
    }

    if (this.oauthManager) {
      // For OAuth, we rely on the authenticate() method being called explicitly first,
      // or we could try to refresh if we had a refresh token (not implemented in this MVP).
      // If we have credentials but no token, we might need to re-authenticate or throw.
      const creds = this.oauthManager.getCredentials();
      if (creds.id_token) {
         // Check if expired
         if (creds.expiry_date && Date.now() + this.config.refreshMarginMs > creds.expiry_date) {
            // TODO: Implement refresh flow if needed, or just re-authenticate
            // For now, assume re-auth is needed if expired
            throw new Error("OAuth token expired. Please re-authenticate.");
         }
         return creds.id_token;
      }
      throw new Error("OAuth not authenticated. Please call authenticate action first.");
    }

    if (!this.auth) {
        throw new Error("No authentication mechanism configured.");
    }

    if (!this.client) {
      this.client = await this.auth.getIdTokenClient(this.config.targetAudience);
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
  private readonly puppeteerManager = new PuppeteerAuthManager();
  private readonly cookieFilePath: string;

  private readonly cookieJar = new Map<string, StoredCookie>();
  private userAgent?: string;

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
      clientEmail: config.googleAuth.clientEmail ?? "",
      privateKey: config.googleAuth.privateKey ?? "",
      clientId: config.googleAuth.clientId ?? "",
      clientSecret: config.googleAuth.clientSecret ?? "",
      targetAudience,
      refreshMarginMs: this.refreshMarginMs,
    });

    // Initialize cookie file path
    const homeDir = os.homedir();
    const mastraDir = path.join(homeDir, ".mastra");
    if (!fs.existsSync(mastraDir)) {
      fs.mkdirSync(mastraDir, { recursive: true });
    }
    // Create a unique filename based on baseUrl and clientEmail to support multiple instances/users
    const safeBaseUrl = this.baseUrl.replace(/[^a-z0-9]/gi, "_");
    const email = config.googleAuth.clientEmail || "default";
    const safeEmail = email.replace(/[^a-z0-9]/gi, "_");
    
    this.cookieFilePath = path.join(mastraDir, `grafana_cookies_${safeBaseUrl}_${safeEmail}.json`);

    this.loadCookies();
  }

  async authenticate(method: "oauth" | "browser" = "browser"): Promise<void> {
    if (method === "browser") {
      // Create a persistent user data directory for Puppeteer
      // We use the same safeEmail approach as the cookie file to isolate profiles per user account
      const safeBaseUrl = this.baseUrl.replace(/[^a-z0-9]/gi, "_");
      const email = this.config.googleAuth.clientEmail || "default";
      const safeEmail = email.replace(/[^a-z0-9]/gi, "_");
      
      const homeDir = os.homedir();
      const mastraDir = path.join(homeDir, ".mastra");
      const userDataDir = path.join(mastraDir, `puppeteer_profile_${safeBaseUrl}_${safeEmail}`);

      const result = await this.puppeteerManager.authenticate(this.baseUrl, userDataDir);
      
      this.userAgent = result.userAgent;

      // Store cookies
      for (const cookie of result.cookies) {
        this.cookieJar.set(cookie.name, {
          name: cookie.name,
          value: cookie.value,
          expiresAt: cookie.expires * 1000,
        });
      }
      this.saveCookies();
      
      console.log("Puppeteer authentication successful. Cookies stored.");
    } else {
      await this.tokenManager.authenticate();
    }
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
    this.saveCookies();
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

  private loadCookies(): void {
    try {
      if (fs.existsSync(this.cookieFilePath)) {
        const data = fs.readFileSync(this.cookieFilePath, "utf-8");
        const parsed = JSON.parse(data);

        // Handle legacy array format
        const cookies = Array.isArray(parsed) ? parsed : (parsed.cookies as StoredCookie[]);
        this.userAgent = Array.isArray(parsed) ? undefined : (parsed.userAgent as string);

        if (Array.isArray(cookies)) {
          for (const cookie of cookies) {
            this.cookieJar.set(cookie.name, cookie);
          }
        }
        // console.log(`Loaded ${cookies?.length ?? 0} cookies from ${this.cookieFilePath}`);
      }
    } catch (error) {
      console.warn(`Failed to load cookies from ${this.cookieFilePath}:`, error);
    }
  }

  private saveCookies(): void {
    try {
      const cookies = Array.from(this.cookieJar.values());
      const data = {
        cookies,
        userAgent: this.userAgent,
      };
      fs.writeFileSync(this.cookieFilePath, JSON.stringify(data, null, 2), "utf-8");
      // console.log(`Saved ${cookies.length} cookies to ${this.cookieFilePath}`);
    } catch (error) {
      console.warn(`Failed to save cookies to ${this.cookieFilePath}:`, error);
    }
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
    
    if (this.userAgent) {
      headers.set("User-Agent", this.userAgent);
    }

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

  async searchDashboards(query: string, starred = false): Promise<GrafanaSearchResult[]> {
    const params = new URLSearchParams({ query });

    if (starred) {
      params.set("starred", "true");
    }

    const response = await this.authorizedFetch(`/api/search?${params.toString()}`);

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
