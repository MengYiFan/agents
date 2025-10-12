# Mastra Agents Project

This repository contains a Mastra project scaffolded in an offline environment. It includes example agents and configuration files to get started quickly once dependencies are available.

## Getting Started

1. Install dependencies (requires access to npm registry):
   ```bash
   npm install
   ```
2. Start the Mastra development server:
   ```bash
   npm run dev
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run the compiled output:
   ```bash
   npm start
   ```

## Project Structure

- `mastra.config.ts` – Mastra runtime configuration.
- `src/agents` – Example agent definitions.
- `src/auth` – High-level authentication helpers, including the Lark + Google SSO workflow.
- `src/index.ts` – Entry point that registers the agents with Mastra.

## Lark Google SSO helper

The `src/auth` directory ships with a reusable `LarkGoogleAuthenticator` that wraps the Google OAuth 2.0 + Lark OIDC exchange. It
offers the following capabilities:

- Generate the Google authorization URL with optional PKCE and custom state.
- Exchange the Google authorization code (or refresh token) for Google tokens and, subsequently, a Lark access token.
- Optionally retrieve the Lark user profile in the same call.
- Cache sessions by refresh token (in-memory by default, pluggable interface for Redis, database, etc.).

### Configuration

```ts
import { LarkGoogleAuthenticator } from "./auth/index.js";

const authenticator = new LarkGoogleAuthenticator({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    redirectUri: "https://your-app.example.com/oauth2/callback",
    scope: ["openid", "email", "profile"],
    extraAuthParams: {
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
    },
  },
  lark: {
    tenantKey: process.env.LARK_TENANT_KEY,
    appId: process.env.LARK_APP_ID!,
    appSecret: process.env.LARK_APP_SECRET!,
  },
});
```

### Usage flow

1. Redirect the user to `authenticator.getGoogleAuthorizationUrl(state, codeChallenge)`.
2. On your redirect handler, call `authenticator.exchangeAuthorizationCode(code, { codeVerifier })` to obtain the Lark session.
3. Persist the returned session and reuse `authenticator.refreshSession(refreshToken)` when the Google token expires.
4. Optionally hydrate user profile details using the `larkUserInfo` payload.

The helper raises descriptive errors for failed exchanges and exposes the raw responses to aid troubleshooting and audit logging.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.
