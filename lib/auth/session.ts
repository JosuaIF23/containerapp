import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions, type User } from "@/lib/db/schema";

const COOKIE_NAME = "ptgis_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export type SessionUser = {
  sessionId: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
};

function getExpiry(remember: boolean): Date {
  const now = new Date();
  const days = remember ? 7 : 1;
  const target = new Date(now);
  target.setDate(target.getDate() + days);
  target.setHours(0, 0, 0, 0);
  return target;
}

async function signToken(payload: SessionUser, expiresAt: Date): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secret);
}

async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function createSession(user: User, remember: boolean): Promise<void> {
  const sessionId = randomUUID();
  const expiresAt = getExpiry(remember);

  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt,
    createdAt: new Date(),
  });

  const payload: SessionUser = {
    sessionId,
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };

  const token = await signToken(payload, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, payload.sessionId));
  const dbSession = rows[0];

  if (!dbSession || dbSession.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return payload;
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      await db.delete(sessions).where(eq(sessions.id, payload.sessionId));
    }
  }

  cookieStore.delete(COOKIE_NAME);
}
