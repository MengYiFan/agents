import { OAuthTokenSet, TokenStore } from "./types.js";

export type { TokenStore } from "./types.js";

export class InMemoryTokenStore implements TokenStore {
  private readonly tokens = new Map<string, OAuthTokenSet>();

  async getToken(key: string): Promise<OAuthTokenSet | null> {
    return this.tokens.get(key) ?? null;
  }

  async setToken(key: string, token: OAuthTokenSet): Promise<void> {
    this.tokens.set(key, token);
  }

  async clearToken(key: string): Promise<void> {
    this.tokens.delete(key);
  }
}

export type TokenStoreFactory = () => TokenStore;
