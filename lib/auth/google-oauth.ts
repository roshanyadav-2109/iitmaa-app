import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";

// No default: the client must be the one registered for this app's own
// domain. A baked-in fallback would silently authenticate against someone
// else's OAuth client and fail in a way that looks like a code bug.
const DEFAULT_GOOGLE_CLIENT_ID = "";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";
export const GOOGLE_OAUTH_NONCE_COOKIE = "google_oauth_nonce";
export const GOOGLE_OAUTH_NEXT_COOKIE = "google_oauth_next";
export const GOOGLE_OAUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60;

export const googleOAuthCookieOptions = {
  httpOnly: true,
  maxAge: GOOGLE_OAUTH_COOKIE_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function createGoogleOAuthRequest() {
  const state = randomBytes(32).toString("base64url");
  const nonce = randomBytes(32).toString("base64url");

  return {
    state,
    nonce,
    hashedNonce: createHash("sha256").update(nonce).digest("hex"),
  };
}

export function googleClientId(): string {
  return (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    DEFAULT_GOOGLE_CLIENT_ID
  );
}

export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/home";
}

export function googleRedirectUri(req: Request): string {
  if (process.env.GOOGLE_OAUTH_REDIRECT_URI) {
    return process.env.GOOGLE_OAUTH_REDIRECT_URI;
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    new URL(req.url).origin;
  return `${origin.replace(/\/$/, "")}/auth/google/callback`;
}

export function redirectWithGoogleAuthError(
  req: Request,
  error: string,
  clearCookies = false
) {
  const origin = new URL(req.url).origin;
  const response = NextResponse.redirect(
    new URL(`/?error=${encodeURIComponent(error)}`, origin)
  );

  if (clearCookies) clearGoogleOAuthCookies(response);
  return response;
}

export function clearGoogleOAuthCookies(response: NextResponse) {
  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
  response.cookies.delete(GOOGLE_OAUTH_NONCE_COOKIE);
  response.cookies.delete(GOOGLE_OAUTH_NEXT_COOKIE);
}
