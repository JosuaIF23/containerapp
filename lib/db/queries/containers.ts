import { randomUUID } from "crypto";
import { and, desc, eq, isNull, like, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { containers, type Container, type NewContainer } from "@/lib/db/schema";

export type ContainerWithDocStatus = Container & { docStatus: string | null };

export type ListContainersFilters = {
  search?: string;
  status?: "Mty" | "Full";
  page?: number;
  pageSize?: number;
};

const latestDocStatus = sql<string | null>`(
  select dc.status from document_containers dc
  where dc.container_id = containers.id
  order by dc.created_at desc
  limit 1
)`.as("doc_status");

export async function listContainers(
  filters: ListContainersFilters = {}
): Promise<ContainerWithDocStatus[]> {
  const { search, status, page = 1, pageSize = 20 } = filters;

  const conditions = [isNull(containers.deletedAt)];
  if (search) {
    conditions.push(
      or(
        like(containers.customer, `%${search}%`),
        like(containers.containerNumber, `%${search}%`)
      )!
    );
  }
  if (status) {
    conditions.push(eq(containers.status, status));
  }

  const rows = await db
    .select({
      id: containers.id,
      customer: containers.customer,
      typeSurvey: containers.typeSurvey,
      status: containers.status,
      condition: containers.condition,
      cleanliness: containers.cleanliness,
      surveyLocation: containers.surveyLocation,
      dateSurvey: containers.dateSurvey,
      containerNumber: containers.containerNumber,
      size: containers.size,
      dateManufactured: containers.dateManufactured,
      type: containers.type,
      csc: containers.csc,
      mgm: containers.mgm,
      acep: containers.acep,
      payload: containers.payload,
      tct: containers.tct,
      tare: containers.tare,
      cuCap: containers.cuCap,
      surveyorId: containers.surveyorId,
      note: containers.note,
      thirdSctySys: containers.thirdSctySys,
      createdAt: containers.createdAt,
      updatedAt: containers.updatedAt,
      deletedAt: containers.deletedAt,
      docStatus: latestDocStatus,
    })
    .from(containers)
    .where(and(...conditions))
    .orderBy(desc(containers.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return rows;
}

export async function getContainerById(id: string): Promise<Container | undefined> {
  const rows = await db
    .select()
    .from(containers)
    .where(and(eq(containers.id, id), isNull(containers.deletedAt)));
  return rows[0];
}

export async function createContainer(
  data: Omit<NewContainer, "id" | "createdAt" | "updatedAt" | "deletedAt">
): Promise<Container> {
  const id = randomUUID();
  const now = new Date();

  await db.insert(containers).values({
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  });

  const created = await getContainerById(id);
  if (!created) throw new Error("Failed to create container");
  return created;
}

export async function updateContainer(
  id: string,
  data: Partial<Omit<NewContainer, "id" | "createdAt" | "updatedAt" | "deletedAt">>
): Promise<void> {
  await db
    .update(containers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(containers.id, id));
}

export async function softDeleteContainer(id: string): Promise<void> {
  await db
    .update(containers)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(containers.id, id));
}
