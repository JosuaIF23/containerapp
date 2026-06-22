import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { canAccessAdminArea } from "@/lib/auth/authz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await requireSession();
  if (!canAccessAdminArea(session.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Panel Admin</h1>
        <p className="text-sm text-foreground/60">Area kerja khusus untuk role Admin.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catatan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/60">
          Modul ini belum tersedia. Fitur untuk role Admin akan ditambahkan pada
          iterasi berikutnya.
        </CardContent>
      </Card>
    </div>
  );
}
