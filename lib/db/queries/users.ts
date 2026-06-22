import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";
import type { Role } from "@/lib/auth/authz";

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

export async function listSurveyors(): Promise<User[]> {
  return db.select().from(users).where(eq(users.role, "surveyor"));
}

export async function listUsers(): Promise<User[]> {
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function createUser(data: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}): Promise<User> {
  const id = randomUUID();
  const now = new Date();
  const passwordHash = await argon2.hash(data.password);

  await db.insert(users).values({
    id,
    fullName: data.fullName,
    email: data.email,
    passwordHash,
    role: data.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  const created = await getUserById(id);
  if (!created) throw new Error("Failed to create user");
  return created;
}

export async function updateUser(
  id: string,
  data: { fullName: string; email: string; role: Role }
): Promise<void> {
  await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id));
}

export async function setUserPassword(id: string, newPassword: string): Promise<void> {
  const passwordHash = await argon2.hash(newPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id));
}

export async function setUserActive(id: string, isActive: boolean): Promise<void> {
  await db
    .update(users)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(users.id, id));
}
