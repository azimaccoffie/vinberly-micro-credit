import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  console.log("[OAuth] Registering OAuth routes...");
  
  // Add route logging
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    console.log("[OAuth] === CALLBACK ROUTE HIT ===");
    console.log("[OAuth] Full URL:", req.protocol + "://" + req.get("host") + req.originalUrl);
    console.log("[OAuth] Query params:", req.query);
    console.log("[OAuth] Headers:", req.headers);
    console.log("[OAuth] Callback received");
    console.log("[OAuth] Query params:", req.query);
    
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    console.log("[OAuth] Code:", code);
    console.log("[OAuth] State:", state);

    if (!code || !state) {
      console.log("[OAuth] Missing code or state");
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/dashboard");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Mock login for development and bypassing auth.manus.im
  app.get("/api/mock-login", async (req: Request, res: Response) => {
    console.log("[Auth] Mock login endpoint hit");
    try {
      const demoUser = {
        openId: "demo-123456",
        name: "Demo User",
        email: "demo@vinberly.com",
        loginMethod: "mock",
        lastSignedIn: new Date(),
        role: "user" as const // Set to 'admin' if you want to test admin dashboard
      };

      console.log("[Auth] Upserting demo user...");
      try {
        await db.upsertUser(demoUser);
        console.log("[Auth] Demo user upserted successfully");
      } catch (dbError) {
        console.warn("[Auth] Database upsert failed, using in-memory fallback:", dbError);
        // Continue anyway since in-memory store is used as fallback
      }

      console.log("[Auth] Creating session token...");
      const sessionToken = await sdk.createSessionToken(demoUser.openId, {
        name: demoUser.name,
        expiresInMs: ONE_YEAR_MS,
      });
      console.log("[Auth] Session token created:", sessionToken.substring(0, 20) + "...");

      const cookieOptions = getSessionCookieOptions(req);
      console.log("[Auth] Cookie options:", cookieOptions);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      console.log("[Auth] Mock login successful for Demo User, redirecting to /dashboard");
      res.redirect(302, "/dashboard");
    } catch (error) {
      console.error("[Auth] Mock login failed", error);
      res.status(500).json({ error: "Mock login failed", details: String(error) });
    }
  });
}
