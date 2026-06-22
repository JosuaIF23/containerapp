export type Role = "super_admin" | "admin" | "surveyor" | "finance";

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  surveyor: "Surveyor",
  finance: "Finance",
};

export function canManageContainers(role: string): boolean {
  return role === "super_admin" || role === "admin" || role === "surveyor";
}

export function canManageUsers(role: string): boolean {
  return role === "super_admin";
}

export function canAccessAdminArea(role: string): boolean {
  return role === "super_admin" || role === "admin";
}

export function canAccessFinanceArea(role: string): boolean {
  return role === "super_admin" || role === "finance";
}

export function canReviewDocuments(role: string): boolean {
  return role === "super_admin" || role === "admin";
}

export function canEditContainer(
  role: string,
  surveyorId: string | null,
  userId: string
): boolean {
  if (role === "super_admin" || role === "admin") return true;
  if (role === "surveyor") return surveyorId === userId;
  return false;
}
