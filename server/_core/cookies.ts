import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  // const hostname = req.hostname;
  // const shouldSetDomain =
  //   hostname &&
  //   !LOCAL_HOSTS.has(hostname) &&
  //   !isIpAddress(hostname) &&
  //   hostname !== "127.0.0.1" &&
  //   hostname !== "::1";

  // const domain =
  //   shouldSetDomain && !hostname.startsWith(".")
  //     ? `.${hostname}`
  //     : shouldSetDomain
  //       ? hostname
  //       : undefined;

  // For Railway deployment, we need to handle proxy headers properly
  // Check if the request is coming through a proxy as HTTPS
  const forwardedProto = req.headers['x-forwarded-proto'] as string;
  const isSecure = forwardedProto === 'https';
  
  // In production environments like Railway, we need to ensure sameSite: none works properly
  // When sameSite is 'none', secure must be true for the cookie to be sent
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none", // Required for OAuth flows to work across origins
    secure: process.env.NODE_ENV === 'production' ? true : isSecure, // Always true in production for sameSite: none
  };
}
