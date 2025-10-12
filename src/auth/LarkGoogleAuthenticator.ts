import { OAuthClient, OAuthClientConfig, OAuthTokenResponse } from "./OAuthClient.js";

type Milliseconds = number;

export interface TokenCacheKey {
  googleRefreshToken: string;
  tenantKey?: string;
}

export interface TokenCache {
  get(key: TokenCacheKey): Promise<LarkSession | undefined>;
  set(key: TokenCacheKey, value: LarkSession): Promise<void>;
  clear(key: TokenCacheKey): Promise<void>;
}

export class InMemoryTokenCache implements TokenCache {
  private readonly cache = new Map<string, LarkSession>();

  private getKey(key: TokenCacheKey): string {
    return `${key.tenantKey ?? "default"}:${key.googleRefreshToken}`;
  }

  public async get(key: TokenCacheKey): Promise<LarkSession | undefined> {
    return this.cache.get(this.getKey(key));
  }

  public async set(key: TokenCacheKey, value: LarkSession): Promise<void> {
    this.cache.set(this.getKey(key), value);
  }

  public async clear(key: TokenCacheKey): Promise<void> {
    this.cache.delete(this.getKey(key));
  }
}

export interface LarkGoogleAuthConfig {
  google: OAuthClientConfig;
  lark: {
    tenantKey?: string;
    appId: string;
    appSecret: string;
    oidcTokenEndpoint?: string;
    userInfoEndpoint?: string;
  };
  cache?: TokenCache;
}

export interface LarkSession {
  googleTokens: OAuthTokenResponse;
  larkAccessToken: string;
  larkRefreshToken?: string;
  larkExpiresAt?: Milliseconds;
  larkUserInfo?: Record<string, unknown>;
  rawLarkResponse: Record<string, unknown>;
}

interface LarkTokenResponse {
  data?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  code?: number;
  msg?: string;
  tenant_key?: string;
  [key: string]: unknown;
}

export class LarkGoogleAuthenticator {
  private readonly googleClient: OAuthClient;
  private readonly config: LarkGoogleAuthConfig;
  private readonly cache: TokenCache;

  constructor(config: LarkGoogleAuthConfig) {
    this.config = config;
    this.googleClient = new OAuthClient(config.google);
    this.cache = config.cache ?? new InMemoryTokenCache();
  }

  public getGoogleAuthorizationUrl(state?: string, codeChallenge?: string): string {
    return this.googleClient.getAuthorizationUrl(state, codeChallenge);
  }

  public async exchangeAuthorizationCode(
    code: string,
    options?: { codeVerifier?: string; includeUserInfo?: boolean }
  ): Promise<LarkSession> {
    const googleTokens = await this.googleClient.exchangeCodeForToken(code, {
      codeVerifier: options?.codeVerifier,
    });

    const session = await this.exchangeGoogleTokenForLark(googleTokens, options?.includeUserInfo);

    if (googleTokens.refreshToken) {
      await this.cache.set(
        {
          googleRefreshToken: googleTokens.refreshToken,
          tenantKey: this.config.lark.tenantKey,
        },
        session
      );
    }

    return session;
  }

  public async refreshSession(
    refreshToken: string,
    options?: { includeUserInfo?: boolean }
  ): Promise<LarkSession> {
    const googleTokens = await this.googleClient.refreshAccessToken(refreshToken);
    const session = await this.exchangeGoogleTokenForLark(googleTokens, options?.includeUserInfo);

    await this.cache.set(
      {
        googleRefreshToken: refreshToken,
        tenantKey: this.config.lark.tenantKey,
      },
      session
    );

    return session;
  }

  public async getCachedSession(refreshToken: string): Promise<LarkSession | undefined> {
    if (!refreshToken) {
      return undefined;
    }

    const cached = await this.cache.get({
      googleRefreshToken: refreshToken,
      tenantKey: this.config.lark.tenantKey,
    });

    return cached;
  }

  private async exchangeGoogleTokenForLark(
    googleTokens: OAuthTokenResponse,
    includeUserInfo = false
  ): Promise<LarkSession> {
    if (!googleTokens.idToken) {
      throw new Error("Google ID token is required to perform Lark OIDC exchange.");
    }

    const body = {
      grant_type: "id_token",
      id_token: googleTokens.idToken,
      app_access_token: await this.getLarkAppAccessToken(),
    };

    const response = await fetch(this.config.lark.oidcTokenEndpoint ?? defaultLarkOidcEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to exchange Google token for Lark access token. Status: ${response.status}. Body: ${text}`
      );
    }

    const larkData = (await response.json()) as LarkTokenResponse;

    if (larkData.code && larkData.code !== 0) {
      throw new Error(
        `Lark responded with error code ${larkData.code}: ${larkData.msg ?? "Unknown error"}`
      );
    }

    const expiresAt = larkData.data?.expires_in
      ? Date.now() + Number(larkData.data.expires_in) * 1000
      : undefined;

    const session: LarkSession = {
      googleTokens,
      larkAccessToken: String(larkData.data?.access_token ?? ""),
      larkRefreshToken: larkData.data?.refresh_token
        ? String(larkData.data.refresh_token)
        : undefined,
      larkExpiresAt: expiresAt,
      rawLarkResponse: larkData as Record<string, unknown>,
    };

    if (includeUserInfo) {
      session.larkUserInfo = await this.fetchLarkUserInfo(session.larkAccessToken);
    }

    return session;
  }

  private async getLarkAppAccessToken(): Promise<string> {
    const response = await fetch(defaultLarkAppAccessTokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: this.config.lark.appId,
        app_secret: this.config.lark.appSecret,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to obtain Lark app access token. Status: ${response.status}. Body: ${text}`
      );
    }

    const data = (await response.json()) as {
      code?: number;
      msg?: string;
      app_access_token?: string;
    };

    if (data.code && data.code !== 0) {
      throw new Error(
        `Lark responded with error code ${data.code} when retrieving app access token: ${data.msg ?? "Unknown error"}`
      );
    }

    if (!data.app_access_token) {
      throw new Error("Lark response did not include an app access token.");
    }

    return data.app_access_token;
  }

  private async fetchLarkUserInfo(accessToken: string): Promise<Record<string, unknown>> {
    const response = await fetch(this.config.lark.userInfoEndpoint ?? defaultLarkUserInfoEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to fetch Lark user info. Status: ${response.status}. Body: ${text}`
      );
    }

    return (await response.json()) as Record<string, unknown>;
  }
}

const defaultLarkOidcEndpoint = "https://open.larksuite.com/open-apis/authen/v1/oidc/access_token";
const defaultLarkAppAccessTokenEndpoint =
  "https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal";
const defaultLarkUserInfoEndpoint = "https://open.larksuite.com/open-apis/authen/v1/user_info";
