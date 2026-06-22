import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { canManageUsers, ROLE_LABELS } from "@/lib/auth/authz";
import { listUsers } from "@/lib/db/queries/users";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UsersPage() {
  const session = await requireSession();
  if (!canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  const items = await listUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Manajemen User</h1>
          <p className="text-sm text-foreground/60">Kelola akun pengguna dan role akses.</p>
        </div>
        <Link href="/users/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          Akun Baru
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-foreground/50">
                    Belum ada akun.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.fullName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge>{ROLE_LABELS[item.role] ?? item.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "accent"}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.lastLoginAt
                      ? new Date(item.lastLoginAt).toLocaleDateString("id-ID")
                      : "Belum pernah"}
                  </TableCell>
                  <TableCell>
                    <Link href={`/users/${item.id}`} className="text-primary-700 hover:underline">
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
