import { ClipboardCheck, CalendarDays, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpis = [
  { label: "Total Inspeksi", value: "128", icon: ClipboardCheck, color: "text-primary-200" },
  { label: "Jadwal Bulan Ini", value: "14", icon: CalendarDays, color: "text-accent-400" },
  { label: "User Aktif", value: "6", icon: Users, color: "text-primary-300" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground/60">
          Ringkasan aktivitas inspeksi & sertifikasi kontainer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>{kpi.label}</CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catatan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/60">
          Modul manajemen inspeksi, jadwal, user, dan role akan ditambahkan pada
          iterasi berikutnya.
        </CardContent>
      </Card>
    </div>
  );
}
