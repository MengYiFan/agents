import { TokenStore } from "./types.js";

export interface GoogleAuthSession {
  /**
   * Cookie header value that authenticates requests against internal Google-protected
   * applications.
   */
  cookies?: string;
  /**
   * Epoch milliseconds indicating when the cookies expire. When omitted the
   * session is treated as non-expiring.
   */
  expiresAt?: number;
}

export interface GoogleAuthFetchOptions {
  /**
   * Provides or refreshes the session used for Google-authenticated requests.
   * The function should return a session that contains the cookie header that
   * will successfully pass the SSO gate.
   */
  sessionProvider: (forceRefresh?: boolean) => Promise<GoogleAuthSession | null>;
  /**
   * Optional callback invoked whenever the helper detects updated cookies from
   * the target resource. Implementations can use this to persist the refreshed
   * session through the provided token store or any other mechanism.
   */
  onSessionUpdate?: (session: GoogleAuthSession) => Promise<void> | void;
  /**
   * Custom fetch implementation. Defaults to the global fetch available in the
   * current Node.js runtime.
   */
  fetch?: typeof fetch;
  /**
   * Number of intermediate redirects the helper will follow before failing the
   * request. Defaults to 5.
   */
  maxRedirects?: number;
  /**
   * Milliseconds before cookie expiry where the helper proactively refreshes the
   * session by invoking the provider with forceRefresh=true. Defaults to one
   * minute.
   */
  refreshThresholdMs?: number;
  /**
   * Optional token store used to persist Google authentication sessions. When
   * provided, the helper stores cookies under the supplied key whenever they are
   * refreshed from downstream services.
   */
  tokenStore?: TokenStore;
  /**
   * Key used to store the Google authentication session. Required when a token
   * store is provided.
   */
  tokenStoreKey?: string;
  /**
   * Pattern that identifies redirects to the Google sign-in endpoint. Requests
   * that match the pattern trigger a forced refresh of the session.
   */
  loginUrlPattern?: RegExp;
}

export async function fetchWithGoogleAuth(
  url: string | URL,
  init: RequestInit = {},
  options: GoogleAuthFetchOptions,
): Promise<Response> {
  const fetchImpl = options.fetch ?? globalThis.fetch;
  if (!fetchImpl) {
    throw new Error(
      "fetch is not available in the current runtime. Provide a fetch implementation in Google auth options.",
    );
  }

  const maxRedirects = options.maxRedirects ?? 5;
  const refreshThresholdMs = options.refreshThresholdMs ?? 60_000;
  const loginUrlPattern =
    options.loginUrlPattern ?? /https:\/\/accounts\.google\.com\/v3\/signin\/identifier/;

  let currentUrl = typeof url === "string" ? url : url.toString();
  const originalMethod = (init.method ?? "GET").toUpperCase();
  const originalBody = init.body;

  if (originalBody && isUnsupportedBody(originalBody)) {
    throw new Error(
      "Request body type is not supported by fetchWithGoogleAuth. Provide a cloneable body such as string, URLSearchParams, Blob, or ArrayBuffer.",
    );
  }

  let method = originalMethod;
  let body = cloneBody(originalBody);
  let session = await loadSession(options, false);

  if (session?.expiresAt && session.expiresAt - Date.now() <= refreshThresholdMs) {
    session = await loadSession(options, true);
  }

  let redirects = 0;
  let authAttempts = 0;

  while (true) {
    const headers = new Headers(init.headers);
    if (session?.cookies) {
      headers.set("Cookie", session.cookies);
    }

    const response = await fetchImpl(currentUrl, {
      ...init,
      method,
      body,
      headers,
      redirect: "manual",
    });

    if (isGoogleRedirect(response, loginUrlPattern)) {
      if (authAttempts >= 3) {
        throw new Error(
          `Automatic Google authentication failed after ${authAttempts} attempts for ${currentUrl}.`,
        );
      }

      authAttempts += 1;
      session = await loadSession(options, true);
      body = cloneBody(originalBody);
      continue;
    }

    if (isRedirect(response)) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error(`Redirect response from ${currentUrl} is missing a Location header.`);
      }

      redirects += 1;
      if (redirects > maxRedirects) {
        throw new Error(`Maximum redirect count of ${maxRedirects} exceeded while requesting ${currentUrl}.`);
      }

      currentUrl = new URL(location, currentUrl).toString();
      ({ method, body } = nextRequestForRedirect(method, originalMethod, response.status, originalBody));
      continue;
    }

    const setCookieHeaders = getSetCookieHeaders(response.headers);
    if (setCookieHeaders.length > 0) {
      const mergedCookies = mergeCookies(session?.cookies, setCookieHeaders);
      const expiresAt = computeExpiry(setCookieHeaders, session?.expiresAt);
      session = {
        ...session,
        cookies: mergedCookies,
        expiresAt,
      };

      await persistSession(options, session);
    }

    return response;
  }
}

async function loadSession(
  options: GoogleAuthFetchOptions,
  forceRefresh: boolean,
): Promise<GoogleAuthSession | null> {
  if (!forceRefresh && options.tokenStore && options.tokenStoreKey) {
    const stored = await options.tokenStore.getToken(options.tokenStoreKey);
    if (stored?.accessToken) {
      return {
        cookies: stored.accessToken,
        expiresAt: stored.expiresAt,
      };
    }
  }

  const session = await options.sessionProvider(forceRefresh);

  if (session && options.tokenStore && options.tokenStoreKey) {
    await options.tokenStore.setToken(options.tokenStoreKey, {
      accessToken: session.cookies ?? "",
      expiresAt: session.expiresAt,
    });
  }

  return session;
}

async function persistSession(
  options: GoogleAuthFetchOptions,
  session: GoogleAuthSession | null,
): Promise<void> {
  if (!session) {
    return;
  }

  if (options.onSessionUpdate) {
    await options.onSessionUpdate(session);
  }

  if (options.tokenStore && options.tokenStoreKey) {
    await options.tokenStore.setToken(options.tokenStoreKey, {
      accessToken: session.cookies ?? "",
      expiresAt: session.expiresAt,
    });
  }
}

function getSetCookieHeaders(headers: Headers): string[] {
  const raw = (headers as unknown as { raw?: () => Record<string, string[]> }).raw?.();
  if (raw && raw["set-cookie"] && raw["set-cookie"].length > 0) {
    return raw["set-cookie"]; // eslint-disable-line @typescript-eslint/no-unsafe-return
  }

  const header = headers.get("set-cookie");
  return header ? [header] : [];
}

function mergeCookies(existing: string | undefined, setCookieHeaders: string[]): string | undefined {
  const jar = new Map<string, string>();

  if (existing) {
    for (const pair of existing.split(";")) {
      const [name, ...rest] = pair.trim().split("=");
      if (!name) {
        continue;
      }
      jar.set(name, rest.join("="));
    }
  }

  for (const header of setCookieHeaders) {
    const [nameValue] = header.split(";", 1);
    const [name, ...rest] = nameValue.trim().split("=");
    if (!name) {
      continue;
    }
    jar.set(name, rest.join("="));
  }

  return jar.size > 0
    ? Array.from(jar.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join("; ")
    : undefined;
}

function computeExpiry(headers: string[], previous?: number): number | undefined {
  let nextExpiry = previous;

  for (const header of headers) {
    const attributes = header.split(";").slice(1);
    for (const attribute of attributes) {
      const [key, value] = attribute.trim().split("=");
      if (!key) {
        continue;
      }

      if (key.toLowerCase() === "max-age") {
        const maxAge = Number(value);
        if (!Number.isNaN(maxAge)) {
          const candidate = Date.now() + maxAge * 1000;
          nextExpiry = nextExpiry ? Math.min(nextExpiry, candidate) : candidate;
        }
      }

      if (key.toLowerCase() === "expires" && value) {
        const timestamp = Date.parse(value);
        if (!Number.isNaN(timestamp)) {
          nextExpiry = nextExpiry ? Math.min(nextExpiry, timestamp) : timestamp;
        }
      }
    }
  }

  return nextExpiry ?? previous;
}

function isRedirect(response: Response): boolean {
  return response.status >= 300 && response.status < 400;
}

function isGoogleRedirect(response: Response, pattern: RegExp): boolean {
  if (isRedirect(response)) {
    const location = response.headers.get("location");
    if (location && pattern.test(location)) {
      return true;
    }
  }

  try {
    const responseUrl = response.url;
    if (responseUrl && pattern.test(responseUrl)) {
      return true;
    }
  } catch (error) {
    // Ignore malformed URLs from the response object.
  }

  return false;
}

function nextRequestForRedirect(
  currentMethod: string,
  originalMethod: string,
  status: number,
  originalBody: BodyInit | null | undefined,
): { method: string; body: BodyInit | undefined } {
  if (status === 303 || ((status === 301 || status === 302) && currentMethod === "POST")) {
    return { method: "GET", body: undefined };
  }

  return { method: originalMethod, body: cloneBody(originalBody) };
}

function cloneBody(body: BodyInit | null | undefined): BodyInit | undefined {
  if (!body) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  if (body instanceof URLSearchParams) {
    return new URLSearchParams(body.toString());
  }

  if (body instanceof Blob) {
    return body.slice(0, body.size, body.type);
  }

  if (body instanceof ArrayBuffer) {
    return body.slice(0);
  }

  if (ArrayBuffer.isView(body)) {
    const buffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength);
    return new Uint8Array(buffer);
  }

  if (body instanceof FormData) {
    const cloned = new FormData();
    for (const [name, value] of body.entries()) {
      if (value instanceof File) {
        const clonedFile = new File([value], value.name, { type: value.type, lastModified: value.lastModified });
        cloned.append(name, clonedFile);
      } else {
        cloned.append(name, value);
      }
    }
    return cloned;
  }

  throw new Error("Unable to clone request body for Google authentication flow.");
}

function isUnsupportedBody(body: BodyInit): boolean {
  return typeof (body as ReadableStream).getReader === "function";
}
