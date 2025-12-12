import puppeteer, { Browser, Page } from "puppeteer";

export interface PuppeteerAuthResult {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
  }[];
  userAgent: string;
}

export class PuppeteerAuthManager {
  private browser: Browser | null = null;

  async authenticate(targetUrl: string, userDataDir?: string): Promise<PuppeteerAuthResult> {
    try {
      this.browser = await puppeteer.launch({
        headless: false, // Visible browser for user interaction
        defaultViewport: null,
        userDataDir,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await this.browser.newPage();
      const userAgent = await this.browser.userAgent();

      // Navigate to the target URL
      await page.goto(targetUrl, { waitUntil: "networkidle0" });

      console.log("Waiting for user to login...");

      // Wait for a specific cookie that indicates successful login
      // For Grafana, 'grafana_session' is the key cookie.
      // We'll check periodically.
      await this.waitForLogin(page, targetUrl);

      console.log("Login detected!");

      // Extract cookies
      const client = await page.target().createCDPSession();
      const { cookies } = await client.send("Network.getAllCookies");

      return {
        cookies: cookies.map((c: any) => ({
          name: c.name,
          value: c.value,
          domain: c.domain,
          path: c.path,
          expires: c.expires,
          httpOnly: c.httpOnly,
          secure: c.secure,
        })),
        userAgent,
      };
    } finally {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    }
  }

  private async waitForLogin(page: Page, targetUrl: string, timeoutMs = 300000): Promise<void> {
    const startTime = Date.now();
    const normalizedTarget = targetUrl.endsWith("/") ? targetUrl : `${targetUrl}/`;

    while (Date.now() - startTime < timeoutMs) {
      if (this.browser === null) {
        throw new Error("Browser closed by user");
      }

      // Use CDP to get all cookies, which is often more reliable than page.cookies()
      let cookies: any[] = [];
      try {
        const client = await page.target().createCDPSession();
        const result = await client.send("Network.getAllCookies");
        cookies = result.cookies;
      } catch (e) {
        // Fallback to standard puppeteer cookies if CDP fails
        cookies = await page.cookies();
      }

      const sessionCookie = cookies.find((c) => c.name === "grafana_session");

      if (sessionCookie) {
        return;
      }

      // Check URL state
      const url = page.url();
      const normalizedUrl = url.endsWith("/") ? url : `${url}/`;
      
      // Check if we are on the home page/dashboard list
      // We check if the URL starts with the target URL (ignoring query params for the check if possible, 
      // but here we just check prefix to be safe against redirects like /?orgId=1)
      const isTargetUrl = normalizedUrl.startsWith(normalizedTarget);
      const isLoginPage = url.includes("/login");

      if (isTargetUrl && !isLoginPage) {
         // We are on the target URL and not on the login page. 
         // It's possible the cookie is HttpOnly or we missed it, or it has a different name in some versions.
         // Let's wait a small buffer to ensure redirects are done and cookies are set.
         await new Promise((resolve) => setTimeout(resolve, 2000));
         
         // Check one last time for cookies
         try {
            const client = await page.target().createCDPSession();
            const result = await client.send("Network.getAllCookies");
            const finalCookies = result.cookies;
            if (finalCookies.find((c: any) => c.name === "grafana_session")) {
                return;
            }
         } catch (e) {
             // ignore
         }
         
         // If still no cookie, but we are definitely on the dashboard, we might assume success 
         // or at least return to let the caller try to extract what's there.
         // However, without the session cookie, subsequent requests might fail. 
         // But sticking here forever is worse.
         console.log("On target URL and not login page, assuming login successful despite missing explicit cookie check.");
         return;
      }

      // Check if browser is still open
      if (page.isClosed()) {
        throw new Error("Page closed by user");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error("Login timed out");
  }
}
