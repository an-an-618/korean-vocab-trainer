import crypto from "node:crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getRequiredEnv } from "@/lib/env";

function randomString(length: number) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => charset[byte % charset.length]).join("");
}

function oauthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  };
}

export async function GET(request: NextRequest) {
  const state = randomString(43);
  const nonce = randomString(43);
  const codeVerifier = randomString(64);
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, oauthCookieOptions());
  cookieStore.set("oauth_nonce", nonce, oauthCookieOptions());
  cookieStore.set("oauth_code_verifier", codeVerifier, oauthCookieOptions());

  const queryParams = new URLSearchParams({
    client_id: getRequiredEnv("NEXT_PUBLIC_VERCEL_APP_CLIENT_ID"),
    redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    response_type: "code",
    scope: "openid email profile offline_access",
  });

  return NextResponse.redirect(`https://vercel.com/oauth/authorize?${queryParams}`);
}
