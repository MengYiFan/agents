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
- `src/index.ts` – Entry point that registers the agents with Mastra.
- `src/auth` – Reusable authentication utilities (for example the Lark + Google SSO module).

## Lark + Google SSO helper

The `src/auth` directory contains a `LarkGoogleAuthManager` class that wraps the full
authorization code flow required to obtain document access tokens in Lark while
supporting enterprise Google SSO. Instantiate the manager with your app
credentials and redirect URI, generate an authorization URL for the user, and
exchange the returned authorization code for tokens:

```ts
import { LarkGoogleAuthManager } from "./src/auth/index.js";

const authManager = new LarkGoogleAuthManager({
  larkAppId: process.env.LARK_APP_ID!,
  larkAppSecret: process.env.LARK_APP_SECRET!,
  redirectUri: "https://example.com/oauth/callback",
});

const { url, state } = authManager.generateAuthorizationUrl({ forceGoogleLogin: true });
// Redirect the user to `url` and persist `state` for CSRF protection.

// In your callback handler:
await authManager.handleAuthorizationCode("user-123", "code-from-callback");

const accessToken = await authManager.getValidAccessToken("user-123");
```

For convenience an in-memory token store is provided. Implement the `TokenStore`
interface if you need persistence across server restarts.

> **Note:** Initializing the project via `npx mastra@latest init` requires internet access to download the CLI. The command could not be executed in this environment, so the scaffold mirrors the default structure manually.
