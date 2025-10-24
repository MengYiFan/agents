import crypto from "node:crypto";
import { InMemoryTokenStore } from "./tokenStore.js";
import {
  AuthorizationUrlResult,
  OAuthTokenSet,
  TokenStore,
} from "./types.js";

interface LarkTokenResponse {
  code: number;
  msg: string;
  data?: {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
  };
}

export interface LarkGoogleAuthConfig {
  /**
   * Lark app ID that represents the integration requesting access.
   */
  larkAppId: string;
  /**
   * Lark app secret paired with the app ID. Required for token exchanges.
   */
  larkAppSecret: string;
  /**
   * OAuth redirect URI registered with Lark. The authorization server will
   * redirect the user back to this URI after the Google SSO step.
   */
  redirectUri: string;
  /**
   * Scopes requested for Lark document operations. When omitted the default
   * Lark scopes are used.
   */
  scope?: string[];
  /**
   * Custom token store implementation. Defaults to an in-memory store which is
   * primarily useful for local development.
   */
  tokenStore?: TokenStore;
  /**
   * Optional override for the base URL of the Lark Open Platform. Useful for
   * testing against mock servers.
   */
  larkBaseUrl?: string;
  /**
   * Optional fetch implementation. Falls back to the global fetch available in
   * modern versions of Node.js.
   */
  fetch?: typeof fetch;
  /**
   * Number of milliseconds before token expiry where the module will attempt to
   * refresh the access token proactively.
   */
  refreshBufferMs?: number;
}

export interface AuthorizationUrlOptions {
  /**
   * Optional state parameter. When omitted a cryptographically secure value is
   * generated automatically.
   */
  state?: string;
  /**
   * When true the generated Lark authorization URL hints the front-end to show
   * the Google login option by default. The flag adds query parameters that
   * align with Lark's documented SSO options.
   */
  forceGoogleLogin?: boolean;
  /**
   * Additional query string parameters that should be appended to the
   * authorization URL.
   */
  extraParams?: Record<string, string | undefined>;
}

export class LarkGoogleAuthManager {
  private readonly config: Required<Omit<LarkGoogleAuthConfig, "tokenStore" | "fetch" | "scope" | "refreshBufferMs">> & {
    scope: string[];
    refreshBufferMs: number;
  };

  private readonly tokenStore: TokenStore;
  private readonly fetchImpl: typeof fetch;

  constructor(config: LarkGoogleAuthConfig) {
    const fetchImpl = config.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error(
        "fetch is not available in the current runtime. Provide a fetch implementation in the configuration.",
      );
    }

    this.config = {
      larkAppId: config.larkAppId,
      larkAppSecret: config.larkAppSecret,
      redirectUri: config.redirectUri,
      larkBaseUrl: config.larkBaseUrl ?? "https://open.feishu.cn",
      scope: config.scope ?? ["docs:read", "docs:write"],
      refreshBufferMs: config.refreshBufferMs ?? 60_000,
    };

    this.tokenStore = config.tokenStore ?? new InMemoryTokenStore();
    this.fetchImpl = fetchImpl;
  }

  /**
   * Builds the authorization URL that should be opened by the user. The URL
   * sends the user to the Lark login page where they can authenticate with
   * their enterprise Google account.
   */
  generateAuthorizationUrl(options: AuthorizationUrlOptions = {}): AuthorizationUrlResult {
    const state = options.state ?? this.generateState();
    const params = new URLSearchParams({
      app_id: this.config.larkAppId,
      redirect_uri: this.config.redirectUri,
      state,
      scope: this.config.scope.join(" "),
    });

    if (options.forceGoogleLogin) {
      // Documented query parameters that pre-select Google SSO in the Lark
      // authorization widget.
      params.set("enable_google_sso", "1");
      params.set("preferred_idp", "google");
    }

    if (options.extraParams) {
      for (const [key, value] of Object.entries(options.extraParams)) {
        if (value !== undefined) {
          params.set(key, value);
        }
      }
    }

    const url = `${this.config.larkBaseUrl}/open-apis/authen/v1/index?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchanges an authorization code received from the Lark OAuth callback for
   * a set of user access tokens. The resulting tokens are persisted using the
   * configured token store under the provided user identifier.
   */
  async handleAuthorizationCode(userId: string, code: string): Promise<OAuthTokenSet> {
    const tokenSet = await this.exchangeCodeForAccessToken(code);
    await this.tokenStore.setToken(userId, tokenSet);
    return tokenSet;
  }

  /**
   * Returns a valid user access token for the given user. If the stored token
   * is close to expiring the module attempts to refresh it using the stored
   * refresh token.
   */
  async getValidAccessToken(userId: string): Promise<string> {
    const storedToken = await this.tokenStore.getToken(userId);
    if (!storedToken) {
      throw new Error(`No OAuth token found for user ${userId}.`);
    }

    if (this.shouldRefresh(storedToken)) {
      const refreshed = await this.refreshUserToken(userId, storedToken);
      return refreshed.accessToken;
    }

    return storedToken.accessToken;
  }

  /**
   * Performs an authenticated HTTP request to the Lark Open Platform on behalf
   * of a given user. The method transparently injects the bearer token and
   * retries once when a refresh is required.
   */
  async authorizedFetch(
    url: string | URL,
    options: Omit<RequestInit, "headers"> & { userId: string; headers?: HeadersInit },
  ): Promise<Response> {
    const { userId, headers, ...init } = options;
    const accessToken = await this.getValidAccessToken(userId);

    const requestHeaders = new Headers(headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    requestHeaders.set("Content-Type", requestHeaders.get("Content-Type") ?? "application/json");

    let response = await this.fetchImpl(url, { ...init, headers: requestHeaders });

    if (response.status === 401) {
      const refreshedToken = await this.refreshUserToken(userId);
      requestHeaders.set("Authorization", `Bearer ${refreshedToken.accessToken}`);
      response = await this.fetchImpl(url, { ...init, headers: requestHeaders });
    }

    return response;
  }

  /**
   * Revokes the stored refresh token and removes it from the token store.
   */
  async revokeAuthorization(userId: string): Promise<void> {
    const storedToken = await this.tokenStore.getToken(userId);
    if (!storedToken?.refreshToken) {
      await this.tokenStore.clearToken(userId);
      return;
    }

    const response = await this.fetchImpl(
      `${this.config.larkBaseUrl}/open-apis/authen/v1/revoke_access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: this.config.larkAppId,
          app_secret: this.config.larkAppSecret,
          refresh_token: storedToken.refreshToken,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to revoke Lark access token: HTTP ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as LarkTokenResponse;
    if (payload.code !== 0) {
      throw new Error(
        `Failed to revoke Lark access token: [${payload.code}] ${payload.msg}`,
      );
    }

    await this.tokenStore.clearToken(userId);
  }

  private async exchangeCodeForAccessToken(code: string): Promise<OAuthTokenSet> {
    const response = await this.fetchImpl(
      `${this.config.larkBaseUrl}/open-apis/authen/v1/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          app_id: this.config.larkAppId,
          app_secret: this.config.larkAppSecret,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to exchange authorization code: HTTP ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as LarkTokenResponse;
    if (payload.code !== 0 || !payload.data) {
      throw new Error(
        `Failed to exchange authorization code: [${payload.code}] ${payload.msg}`,
      );
    }

    return this.transformTokenResponse(payload.data);
  }

  private async refreshUserToken(
    userId: string,
    existingToken?: OAuthTokenSet,
  ): Promise<OAuthTokenSet> {
    const storedToken = existingToken ?? (await this.tokenStore.getToken(userId));
    if (!storedToken) {
      throw new Error(`No stored token found for user ${userId}.`);
    }

    if (!storedToken.refreshToken) {
      throw new Error(
        `Cannot refresh token for user ${userId} because a refresh token is not available.`,
      );
    }

    const refreshed = await this.refreshAccessToken(storedToken.refreshToken);
    await this.tokenStore.setToken(userId, refreshed);
    return refreshed;
  }

  private async refreshAccessToken(refreshToken: string): Promise<OAuthTokenSet> {
    const response = await this.fetchImpl(
      `${this.config.larkBaseUrl}/open-apis/authen/v1/refresh_access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          app_id: this.config.larkAppId,
          app_secret: this.config.larkAppSecret,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to refresh Lark access token: HTTP ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as LarkTokenResponse;
    if (payload.code !== 0 || !payload.data) {
      throw new Error(
        `Failed to refresh Lark access token: [${payload.code}] ${payload.msg}`,
      );
    }

    return this.transformTokenResponse(payload.data, refreshToken);
  }

  private transformTokenResponse(
    data: NonNullable<LarkTokenResponse["data"]>,
    fallbackRefreshToken?: string,
  ): OAuthTokenSet {
    const expiresInMs = (data.expires_in ?? 0) * 1000;
    return {
      accessToken: data.access_token,
      tokenType: data.token_type ?? "Bearer",
      refreshToken: data.refresh_token ?? fallbackRefreshToken,
      expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined,
      scope: this.config.scope.join(" "),
    };
  }

  private shouldRefresh(token: OAuthTokenSet): boolean {
    if (!token.expiresAt) {
      return false;
    }

    return token.expiresAt - this.config.refreshBufferMs <= Date.now();
  }

  private generateState(): string {
    return crypto.randomBytes(16).toString("hex");
  }
}
