"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { canManageContainers, canEditContainer } from "@/lib/auth/authz";
import {
  createContainer,
  updateContainer,
  softDeleteContainer,
  getContainerById,
} from "@/lib/db/queries/containers";

export type ActionResult = { success: true; id?: string } | { error: string };

const containerSchema = z.object({
  customer: z.string().min(1).max(191),
  typeSurvey: z.enum(["In-serv", "ONH", "OFH", "Sale"]),
  status: z.enum(["Mty", "Full"]),
  condition: z.enum(["DMG", "AVL", "AR"]),
  cleanliness: z.enum(["dty", "ctm"]),
  surveyLocation: z.string().min(1).max(255),
  dateSurvey: z.coerce.date(),
  containerNumber: z.string().min(1).max(32),
  size: z.coerce.number().int().positive(),
  dateManufactured: z.coerce.date(),
  type: z.string().min(1).max(64),
  csc: z.string().min(1).max(64),
  mgm: z.string().min(1).max(64),
  acep: z.string().min(1).max(64),
  payload: z.coerce.number().int().positive(),
  tct: z.string().min(1).max(64),
  tare: z.coerce.number().int().positive(),
  cuCap: z.coerce.number().int().positive(),
  surveyorId: z.string().uuid().optional(),
  note: z.string().max(2000).optional(),
  thirdSctySys: z.string().max(191).optional(),
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

export async function createContainerAction(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageContainers(session.role)) {
    return { error: "Anda tidak memiliki akses untuk membuat data kontainer." };
  }

  const parsed = containerSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const surveyorId =
    session.role === "surveyor" ? session.userId : parsed.data.surveyorId ?? null;

  const created = await createContainer({ ...parsed.data, surveyorId });
  revalidatePath("/containers");
  return { success: true, id: created.id };
}

export async function updateContainerAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  const existing = await getContainerById(id);
  if (!existing) {
    return { error: "Data kontainer tidak ditemukan." };
  }

  if (!canEditContainer(session.role, existing.surveyorId, session.userId)) {
    return { error: "Anda tidak memiliki akses untuk mengubah data kontainer ini." };
  }

  const parsed = containerSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const surveyorId =
    session.role === "surveyor" ? existing.surveyorId : parsed.data.surveyorId ?? null;

  await updateContainer(id, { ...parsed.data, surveyorId });
  revalidatePath("/containers");
  revalidatePath(`/containers/${id}`);
  return { success: true };
}

export async function deleteContainerAction(id: string): Promise<ActionResult> {
  const session = await requireSession();
  const existing = await getContainerById(id);
  if (!existing) {
    return { error: "Data kontainer tidak ditemukan." };
  }

  if (!canEditContainer(session.role, existing.surveyorId, session.userId)) {
    return { error: "Anda tidak memiliki akses untuk menghapus data kontainer ini." };
  }

  await softDeleteContainer(id);
  revalidatePath("/containers");
  return { success: true };
}
