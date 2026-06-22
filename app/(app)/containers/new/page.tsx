import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { canManageContainers } from "@/lib/auth/authz";
import { listSurveyors } from "@/lib/db/queries/users";
import { ContainerForm } from "@/app/(app)/containers/container-form";

export default async function NewContainerPage() {
  const session = await requireSession();
  if (!canManageContainers(session.role)) {
    redirect("/dashboard");
  }

  const showSurveyorPicker = session.role === "super_admin" || session.role === "admin";
  const surveyors = showSurveyorPicker ? await listSurveyors() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Kontainer Baru</h1>
        <p className="text-sm text-foreground/60">Buat data survey kontainer baru.</p>
      </div>
      <ContainerForm
        mode="create"
        surveyors={surveyors.map((s) => ({ id: s.id, fullName: s.fullName }))}
        showSurveyorPicker={showSurveyorPicker}
      />
    </div>
  );
}
