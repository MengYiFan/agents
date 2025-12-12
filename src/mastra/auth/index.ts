import { OAuth2Client } from "google-auth-library";
import http from "node:http";
import { exec } from "node:child_process";
import { URL } from "node:url";

export interface OAuthTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string;
  token_type?: string | null;
  expiry_date?: number | null;
  id_token?: string | null;
}

export class GoogleOAuthManager {
  private client: OAuth2Client;
  private server: http.Server | null = null;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string = "http://localhost:3000/auth/google/callback",
  ) {
    this.client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  async authenticate(scopes: string[] = ["https://www.googleapis.com/auth/cloud-platform"]): Promise<OAuthTokens> {
    return new Promise((resolve, reject) => {
      const authorizeUrl = this.client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
      });

      this.startLocalServer(async (code) => {
        try {
          const { tokens } = await this.client.getToken(code);
          this.client.setCredentials(tokens);
          resolve(tokens);
        } catch (error) {
          reject(error);
        }
      }, reject);

      this.openBrowser(authorizeUrl);
    });
  }

  private startLocalServer(onSuccess: (code: string) => void, onError: (error: Error) => void) {
    const port = Number(new URL(this.redirectUri).port) || 3000;

    this.server = http.createServer(async (req, res) => {
      try {
        if (!req.url) return;
        
        const url = new URL(req.url, `http://localhost:${port}`);
        
        if (url.pathname !== new URL(this.redirectUri).pathname) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const code = url.searchParams.get("code");
        
        if (code) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end("<h1>Authentication successful! You can close this window.</h1>");
          
          // Close server and callback
          this.cleanup();
          onSuccess(code);
        } else {
          const error = url.searchParams.get("error");
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>Authentication failed: ${error}</h1>`);
          this.cleanup();
          onError(new Error(`Authentication failed: ${error}`));
        }
      } catch (error) {
        res.writeHead(500);
        res.end("Server error");
        this.cleanup();
        onError(error as Error);
      }
    });

    this.server.listen(port, () => {
      console.log(`Listening on port ${port} for Google OAuth callback...`);
    });
  }

  private cleanup() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  private openBrowser(url: string) {
    const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    exec(`${command} "${url}"`);
  }

  getCredentials(): OAuthTokens {
    return this.client.credentials;
  }
}

export * from "./puppeteer.js";
