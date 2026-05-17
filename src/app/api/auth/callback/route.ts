import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getRequiredEnv } from "@/lib/env";
import { upsertUser } from "@/lib/db";
import { createSessionToken, setSessionCookie, setVercelAccessTokenCookie } from "@/lib/session";

type TokenData = {
  access_token: string;
  token_type: string;
  id_token: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
};

type UserInfoResponse = {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
};

function validate(value: string | null, storedValue?: string) {
  return Boolean(value && storedValue && value === storedValue);
}

function decodeNonce(idToken: string) {
  const payload = idToken.split(".")[1];
  if (!payload) return "";
  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    nonce?: string;
  };
  return decoded.nonce ?? "";
}

async function exchangeCodeForToken(input: {
  code: string;
  codeVerifier: string;
  origin: string;
}): Promise<TokenData> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getRequiredEnv("NEXT_PUBLIC_VERCEL_APP_CLIENT_ID"),
    client_secret: getRequiredEnv("VERCEL_APP_CLIENT_SECRET"),
    code: input.code,
    code_verifier: input.codeVerifier,
    redirect_uri: `${input.origin}/api/auth/callback`,
  });

  const response = await fetch("https://api.vercel.com/login/oauth/token", {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${await response.text()}`);
  }

  return response.json();
}

async function fetchUserInfo(accessToken: string): Promise<UserInfoResponse> {
  const response = await fetch("https://api.vercel.com/login/oauth/userinfo", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`User info request failed: ${await response.text()}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const error = request.nextUrl.searchParams.get("error");

    if (error) {
      throw new Error(error);
    }
    if (!code) {
      throw new Error("Authorization code is required.");
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get("oauth_state")?.value;
    const storedNonce = cookieStore.get("oauth_nonce")?.value;
    const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;

    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_nonce");
    cookieStore.delete("oauth_code_verifier");

    if (!validate(state, storedState)) {
      throw new Error("OAuth state mismatch.");
    }
    if (!codeVerifier) {
      throw new Error("OAuth code verifier is missing.");
    }

    const tokenData = await exchangeCodeForToken({
      code,
      codeVerifier,
      origin: request.nextUrl.origin,
    });

    if (!validate(decodeNonce(tokenData.id_token), storedNonce)) {
      throw new Error("OAuth nonce mismatch.");
    }

    const userInfo = await fetchUserInfo(tokenData.access_token);
    const userId = await upsertUser({
      vercelUserId: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name ?? userInfo.preferred_username,
    });

    await setSessionCookie(
      createSessionToken({
        userId,
        vercelUserId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name ?? userInfo.preferred_username,
      }),
    );
    await setVercelAccessTokenCookie(tokenData.access_token, tokenData.expires_in);

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
