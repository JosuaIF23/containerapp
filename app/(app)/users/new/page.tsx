import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/auth/authz";
import { UserForm } from "@/app/(app)/users/user-form";

export default async function NewUserPage() {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Akun Baru</h1>
        <p className="text-sm text-foreground/60">Buat akun pengguna baru dengan role apa saja.</p>
      </div>
      <UserForm mode="create" />
    </div>
  );
}
