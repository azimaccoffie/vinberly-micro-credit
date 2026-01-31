export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  try {
    const oauthPortalUrl = (import.meta.env.VITE_OAUTH_PORTAL_URL || "https://oauth.manus.im").replace(/\/$/, "");
    const appId = import.meta.env.VITE_APP_ID || "demo-app";
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    
    // btoa only supports Latin1 characters. We use a more robust encoding for safety.
    const state = btoa(unescape(encodeURIComponent(redirectUri)));

    const url = `${oauthPortalUrl}/app-auth?appId=${encodeURIComponent(appId)}&redirectUri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&type=signIn`;
    
    console.log("[Auth] Generated Login URL:", url);
    console.log("[Auth] Redirect URI:", redirectUri);
    console.log("[Auth] Current Origin:", window.location.origin);
    return url;
  } catch (err) {
    console.error("[Auth] Error generating login URL:", err);
    // Absolute fallback
    return "https://oauth.manus.im/app-auth?appId=demo-app";
  }
};

export const getMockLoginUrl = () => {
  return "/api/mock-login";
};
