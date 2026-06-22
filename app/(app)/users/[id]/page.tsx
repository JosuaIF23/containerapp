import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/auth/authz";
import { getUserById } from "@/lib/db/queries/users";
import { UserForm } from "@/app/(app)/users/user-form";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{user.fullName}</h1>
        <p className="text-sm text-foreground/60">{user.email}</p>
      </div>
      <UserForm mode="edit" user={user} currentUserId={session.userId} />
    </div>
  );
}
