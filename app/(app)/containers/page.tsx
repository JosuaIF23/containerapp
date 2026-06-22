import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { canManageContainers } from "@/lib/auth/authz";
import { listContainers } from "@/lib/db/queries/containers";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ContainersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const session = await requireSession();
  if (!canManageContainers(session.role)) {
    redirect("/dashboard");
  }

  const { search, status } = await searchParams;
  const items = await listContainers({
    search,
    status: status === "Mty" || status === "Full" ? status : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inspeksi Kontainer</h1>
          <p className="text-sm text-foreground/60">
            Daftar kontainer yang sedang atau sudah disurvei.
          </p>
        </div>
        <Link href="/containers/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          Kontainer Baru
        </Link>
      </div>

      <Card>
        <CardContent className="pt-5">
          <form method="get" className="flex flex-wrap gap-3">
            <Input
              name="search"
              placeholder="Cari customer / no. kontainer"
              defaultValue={search}
              className="max-w-xs"
            />
            <Select name="status" defaultValue={status ?? ""} className="max-w-[160px]">
              <option value="">Semua status</option>
              <option value="Mty">Mty</option>
              <option value="Full">Full</option>
            </Select>
            <Button type="submit" variant="glass">
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Kontainer</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tipe Survey</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tgl Survey</TableHead>
                <TableHead>Status Foto</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-foreground/50">
                    Belum ada data kontainer.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.containerNumber}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.typeSurvey}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{new Date(item.dateSurvey).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge>{item.docStatus ?? "Belum ada foto"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/containers/${item.id}`} className="text-primary-700 hover:underline">
                      Detail
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
