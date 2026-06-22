"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/auth/authz";
import {
  getUserByEmail,
  createUser,
  updateUser,
  setUserPassword,
  setUserActive,
} from "@/lib/db/queries/users";
import type { ActionResult } from "@/app/actions/containers";

const roleEnum = z.enum(["super_admin", "admin", "surveyor", "finance"]);

const createUserSchema = z.object({
  fullName: z.string().min(1).max(191),
  email: z.string().email().max(191),
  password: z.string().min(8).max(255),
  role: roleEnum,
});

const updateUserSchema = z.object({
  fullName: z.string().min(1).max(191),
  email: z.string().email().max(191),
  role: roleEnum,
});

const resetPasswordSchema = z.object({
  password: z.string().min(8).max(255),
});

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && value !== "") {
      obj[key] = value;
    }
  }
  return obj;
}

export async function createUserAction(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    return { error: "Anda tidak memiliki akses untuk membuat akun." };
  }

  const parsed = createUserSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existing = await getUserByEmail(parsed.data.email);
  if (existing) {
    return { error: "Email sudah digunakan." };
  }

  const created = await createUser(parsed.data);
  revalidatePath("/users");
  return { success: true, id: created.id };
}

export async function updateUserAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    return { error: "Anda tidak memiliki akses untuk mengubah akun." };
  }

  const parsed = updateUserSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existingWithEmail = await getUserByEmail(parsed.data.email);
  if (existingWithEmail && existingWithEmail.id !== id) {
    return { error: "Email sudah digunakan." };
  }

  await updateUser(id, parsed.data);
  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return { success: true };
}

export async function resetPasswordAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    return { error: "Anda tidak memiliki akses untuk mereset password." };
  }

  const parsed = resetPasswordSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await setUserPassword(id, parsed.data.password);
  revalidatePath(`/users/${id}`);
  return { success: true };
}

export async function setUserActiveAction(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    return { error: "Anda tidak memiliki akses untuk mengubah status akun." };
  }

  if (session.userId === id && !isActive) {
    return { error: "Anda tidak dapat menonaktifkan akun Anda sendiri." };
  }

  await setUserActive(id, isActive);
  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return { success: true };
}
