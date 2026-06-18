import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email));
  return rows[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.id, id));
  return rows[0];
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return argon2.verify(user.passwordHash, password);
}

export async function touchLastLogin(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId));
}
