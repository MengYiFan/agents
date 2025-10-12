export interface OAuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType?: string;
  scope?: string;
  expiresIn?: number;
  raw: Record<string, unknown>;
}

export interface OAuthClientConfig {
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  redirectUri: string;
  scope: string[];
  extraAuthParams?: Record<string, string>;
  extraTokenParams?: Record<string, string>;
}

export class OAuthClient {
  private readonly config: OAuthClientConfig;

  constructor(config: OAuthClientConfig) {
    this.config = config;
  }

  public getAuthorizationUrl(state?: string, codeChallenge?: string): string {
    const url = new URL(this.config.authorizationEndpoint);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("redirect_uri", this.config.redirectUri);
    url.searchParams.set("scope", this.config.scope.join(" "));

    if (state) {
      url.searchParams.set("state", state);
    }

    if (codeChallenge) {
      url.searchParams.set("code_challenge", codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");
    }

    if (this.config.extraAuthParams) {
      for (const [key, value] of Object.entries(this.config.extraAuthParams)) {
        url.searchParams.set(key, value);
      }
    }

    return url.toString();
  }

  public async exchangeCodeForToken(
    code: string,
    options?: { codeVerifier?: string }
  ): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    if (options?.codeVerifier) {
      body.set("code_verifier", options.codeVerifier);
    }

    if (this.config.extraTokenParams) {
      for (const [key, value] of Object.entries(this.config.extraTokenParams)) {
        body.set(key, value);
      }
    }

    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to exchange authorization code. Status: ${response.status}. Body: ${errorBody}`
      );
    }

    const data = (await response.json()) as Record<string, unknown>;

    return {
      accessToken: String(data.access_token ?? ""),
      refreshToken: data.refresh_token ? String(data.refresh_token) : undefined,
      idToken: data.id_token ? String(data.id_token) : undefined,
      tokenType: data.token_type ? String(data.token_type) : undefined,
      scope: data.scope ? String(data.scope) : undefined,
      expiresIn: data.expires_in ? Number(data.expires_in) : undefined,
      raw: data,
    };
  }

  public async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    if (this.config.extraTokenParams) {
      for (const [key, value] of Object.entries(this.config.extraTokenParams)) {
        body.set(key, value);
      }
    }

    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to refresh access token. Status: ${response.status}. Body: ${errorBody}`
      );
    }

    const data = (await response.json()) as Record<string, unknown>;

    return {
      accessToken: String(data.access_token ?? ""),
      refreshToken: data.refresh_token ? String(data.refresh_token) : undefined,
      idToken: data.id_token ? String(data.id_token) : undefined,
      tokenType: data.token_type ? String(data.token_type) : undefined,
      scope: data.scope ? String(data.scope) : undefined,
      expiresIn: data.expires_in ? Number(data.expires_in) : undefined,
      raw: data,
    };
  }
}
