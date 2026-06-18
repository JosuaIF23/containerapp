import "server-only";
import { createHash, randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { loginAttempts } from "@/lib/db/schema";

const WINDOW_MS = 10 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function attemptKey(email: string, ip: string): string {
  return createHash("sha256").update(`${email.toLowerCase()}:${ip}`).digest("hex");
}

export async function checkLoginRateLimit(
  email: string,
  ip: string
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const key = attemptKey(email, ip);
  const rows = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.attemptKey, key));
  const row = rows[0];

  if (!row || !row.lockedUntil) return { allowed: true };

  const remaining = row.lockedUntil.getTime() - Date.now();
  if (remaining <= 0) return { allowed: true };

  return { allowed: false, retryAfterMs: remaining };
}

export async function recordFailedLogin(email: string, ip: string): Promise<void> {
  const key = attemptKey(email, ip);
  const now = new Date();

  const rows = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.attemptKey, key));
  const row = rows[0];

  if (!row) {
    await db.insert(loginAttempts).values({
      id: randomUUID(),
      attemptKey: key,
      email,
      ipAddress: ip,
      failedCount: 1,
      firstFailedAt: now,
      lastFailedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    return;
  }

  const windowExpired = now.getTime() - row.firstFailedAt.getTime() > WINDOW_MS;
  const nextCount = windowExpired ? 1 : row.failedCount + 1;
  const lockedUntil = nextCount >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCKOUT_MS) : null;

  await db
    .update(loginAttempts)
    .set({
      failedCount: nextCount,
      firstFailedAt: windowExpired ? now : row.firstFailedAt,
      lastFailedAt: now,
      lockedUntil,
      updatedAt: now,
    })
    .where(eq(loginAttempts.attemptKey, key));
}

export async function resetLoginAttempts(email: string, ip: string): Promise<void> {
  const key = attemptKey(email, ip);
  await db.delete(loginAttempts).where(eq(loginAttempts.attemptKey, key));
}
