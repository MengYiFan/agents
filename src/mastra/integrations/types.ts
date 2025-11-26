export interface OAuthTokenSet {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number;
  scope?: string;
}

export interface TokenStore {
  getToken(key: string): Promise<OAuthTokenSet | null>;
  setToken(key: string, token: OAuthTokenSet): Promise<void>;
  clearToken(key: string): Promise<void>;
}

export interface AuthorizationUrlResult {
  url: string;
  state: string;
}

export interface AuthorizedRequestOptions extends RequestInit {
  userId: string;
}
