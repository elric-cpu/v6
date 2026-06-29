import { createHmac, timingSafeEqual } from "node:crypto";

import { ApiError } from "./errors.js";

const SESSION_COOKIE = "bhs_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new ApiError(500, "AUTH_NOT_CONFIGURED", "Admin authentication is not configured.");
  }

  return secret;
}

function sign(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function parseCookies(request) {
  return Object.fromEntries(
    String(request.headers.cookie ?? "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separatorIndex = cookie.indexOf("=");
        return [
          decodeURIComponent(cookie.slice(0, separatorIndex)),
          decodeURIComponent(cookie.slice(separatorIndex + 1)),
        ];
      }),
  );
}

function normalizeList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getAdminAuthConfig() {
  const allowedEmails = normalizeList(process.env.ADMIN_ALLOWED_EMAILS);
  const allowedDomain = String(process.env.ADMIN_ALLOWED_DOMAIN ?? "").trim().toLowerCase();

  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.ADMIN_SESSION_SECRET) {
    throw new ApiError(500, "AUTH_NOT_CONFIGURED", "Admin authentication is not configured.");
  }

  if (allowedEmails.length === 0 && !allowedDomain) {
    throw new ApiError(500, "AUTH_NOT_CONFIGURED", "Admin authentication is not configured.");
  }

  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    allowedEmails,
    allowedDomain,
  };
}

function isAllowedAdminEmail(email, config) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();

  if (config.allowedEmails.length > 0 && config.allowedEmails.includes(normalizedEmail)) {
    return true;
  }

  return Boolean(config.allowedDomain && normalizedEmail.endsWith(`@${config.allowedDomain}`));
}

function toPublicAdminUser(profile) {
  return {
    email: profile.email,
    name: profile.name ?? profile.email,
    picture: profile.picture ?? null,
  };
}

export function createAdminSessionCookie(profile, now = Date.now()) {
  const payload = base64UrlEncode(JSON.stringify({
    user: toPublicAdminUser(profile),
    exp: now + SESSION_TTL_SECONDS * 1000,
  }));
  const signature = sign(payload);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `${SESSION_COOKIE}=${encodeURIComponent(`${payload}.${signature}`)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL_SECONDS}`,
    secure.slice(2),
  ].filter(Boolean).join("; ");
}

export function clearAdminSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`;
}

export function getAdminSession(request, now = Date.now()) {
  const cookie = parseCookies(request)[SESSION_COOKIE];
  if (!cookie) {
    return null;
  }

  const [payload, signature] = cookie.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session?.user?.email || Number(session.exp) <= now) {
      return null;
    }

    return {
      user: toPublicAdminUser(session.user),
      expiresAt: new Date(session.exp).toISOString(),
    };
  } catch {
    return null;
  }
}

export function requireAdminSession(request) {
  const session = getAdminSession(request);
  if (!session) {
    throw new ApiError(401, "UNAUTHORIZED", "Admin login is required.");
  }

  return session;
}

export async function verifyGoogleAdminToken(idToken, fetchImpl = global.fetch) {
  const config = getAdminAuthConfig();

  const response = await fetchImpl(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(String(idToken ?? ""))}`,
  );

  if (!response.ok) {
    throw new ApiError(401, "INVALID_OAUTH_TOKEN", "Google login token could not be verified.");
  }

  const profile = await response.json();
  const emailVerified = profile.email_verified === true || profile.email_verified === "true";

  if (profile.aud !== config.clientId || !emailVerified || !isAllowedAdminEmail(profile.email, config)) {
    throw new ApiError(403, "FORBIDDEN", "This Google account is not allowed to access the admin dashboard.");
  }

  return toPublicAdminUser(profile);
}
