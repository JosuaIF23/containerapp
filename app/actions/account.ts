"use server";

import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { getUserById, verifyPassword, setUserPassword } from "@/lib/db/queries/users";
import type { ActionResult } from "@/app/actions/containers";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(255),
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

export async function changeOwnPasswordAction(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = changePasswordSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return { error: "User tidak ditemukan." };
  }

  const valid = await verifyPassword(user, parsed.data.currentPassword);
  if (!valid) {
    return { error: "Password lama salah." };
  }

  await setUserPassword(session.userId, parsed.data.newPassword);
  return { success: true };
}
