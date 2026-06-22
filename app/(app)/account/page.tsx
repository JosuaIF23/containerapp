import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/db/queries/users";
import { ROLE_LABELS } from "@/lib/auth/authz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordForm } from "@/app/(app)/account/change-password-form";

export default async function AccountPage() {
  const session = await requireSession();
  const user = await getUserById(session.userId);
  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profil Saya</h1>
        <p className="text-sm text-foreground/60">Informasi akun dan keamanan login Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-foreground/50">Nama Lengkap</p>
            <p className="text-sm font-medium text-foreground">{user.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Email</p>
            <p className="text-sm font-medium text-foreground">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Role</p>
            <Badge>{ROLE_LABELS[user.role] ?? user.role}</Badge>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Status</p>
            <p className="text-sm font-medium text-foreground">
              {user.isActive ? "Aktif" : "Nonaktif"}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Bergabung Sejak</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(user.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Login Terakhir</p>
            <p className="text-sm font-medium text-foreground">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleDateString("id-ID")
                : "Belum pernah"}
            </p>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordForm />
    </div>
  );
}
