import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const sessionCookieName = "korean_vocab_session";
const stateCookieName = "korean_vocab_oauth_state";
const vercelAccessTokenCookieName = "vercel_access_token";

export type SessionUser = {
  userId: string;
  vercelUserId: string;
  email?: string;
  name?: string;
};

type SessionPayload = SessionUser & {
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-session-secret";
  throw new Error("SESSION_SECRET is required in production.");
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifySessionToken(token?: string): SessionUser | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = signPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;
  if (payload.expiresAt < Date.now()) return null;

  return {
    userId: payload.userId,
    vercelUserId: payload.vercelUserId,
    email: payload.email,
    name: payload.name,
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(sessionCookieName)?.value);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
  cookieStore.delete(vercelAccessTokenCookieName);
}

export async function setVercelAccessTokenCookie(accessToken: string, maxAge: number) {
  const cookieStore = await cookies();
  cookieStore.set(vercelAccessTokenCookieName, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function getVercelAccessTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(vercelAccessTokenCookieName)?.value ?? null;
}

export async function setOAuthStateCookie(state: string) {
  const cookieStore = await cookies();
  cookieStore.set(stateCookieName, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function consumeOAuthStateCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(stateCookieName)?.value ?? null;
  cookieStore.delete(stateCookieName);
  return value;
}
