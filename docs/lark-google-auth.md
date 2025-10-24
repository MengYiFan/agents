# Lark + Google SSO Authorization Helper

This project includes a reusable helper that completes the Lark OAuth flow while forcing an enterprise Google SSO login. The helper lives in `src/integrations/larkGoogleAuth.ts` and exposes a `LarkGoogleAuthManager` class alongside simple token store utilities.

## Usage Overview

```ts
import {
  LarkGoogleAuthManager,
  InMemoryTokenStore,
} from "../src/integrations/index.js";

const authManager = new LarkGoogleAuthManager({
  larkAppId: process.env.LARK_APP_ID!,
  larkAppSecret: process.env.LARK_APP_SECRET!,
  redirectUri: "https://example.com/oauth/callback",
  tokenStore: new InMemoryTokenStore(),
});

const { url, state } = authManager.generateAuthorizationUrl({ forceGoogleLogin: true });
// Redirect the user to `url` and persist `state` for CSRF protection.

// In your callback handler:
await authManager.handleAuthorizationCode("user-123", "code-from-callback");

const accessToken = await authManager.getValidAccessToken("user-123");
```

The manager also ships with helpers for refreshing tokens, revoking access, and performing authorized fetch requests that automatically retry when tokens expire.

> **Note:** Replace `InMemoryTokenStore` with a persistent implementation in production environments.
