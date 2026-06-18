"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByEmail, verifyPassword, touchLastLogin } from "@/lib/db/queries/users";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/auth/login-rate-limit";

export type LoginResult = { success: true } | { error: string };

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const ip = await getClientIp();

  const rate = await checkLoginRateLimit(email, ip);
  if (!rate.allowed) {
    const minutes = Math.max(1, Math.ceil((rate.retryAfterMs ?? 0) / 60000));
    return { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${minutes} menit.` };
  }

  const user = await getUserByEmail(email);
  if (!user || !user.isActive) {
    await recordFailedLogin(email, ip);
    return { error: "Email atau password salah." };
  }

  const valid = await verifyPassword(user, password);
  if (!valid) {
    await recordFailedLogin(email, ip);
    return { error: "Email atau password salah." };
  }

  await resetLoginAttempts(email, ip);
  await touchLastLogin(user.id);
  await createSession(user, remember);

  // TODO: insert into audit_logs once that table is introduced (RBAC iteration)

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
