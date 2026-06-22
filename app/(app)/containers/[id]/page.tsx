import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { canEditContainer, canManageContainers } from "@/lib/auth/authz";
import { getContainerById } from "@/lib/db/queries/containers";
import { listSurveyors } from "@/lib/db/queries/users";
import { ContainerForm } from "@/app/(app)/containers/container-form";

export default async function ContainerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  if (!canManageContainers(session.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const container = await getContainerById(id);
  if (!container) {
    notFound();
  }

  const editable = canEditContainer(session.role, container.surveyorId, session.userId);
  const showSurveyorPicker = session.role === "super_admin" || session.role === "admin";
  const surveyors = showSurveyorPicker ? await listSurveyors() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{container.containerNumber}</h1>
        <p className="text-sm text-foreground/60">{container.customer}</p>
      </div>
      <ContainerForm
        mode="edit"
        container={container}
        surveyors={surveyors.map((s) => ({ id: s.id, fullName: s.fullName }))}
        showSurveyorPicker={showSurveyorPicker}
        readOnly={!editable}
      />
    </div>
  );
}
