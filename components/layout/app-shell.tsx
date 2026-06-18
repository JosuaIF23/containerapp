import { requireSession } from "@/lib/auth/session";
import { AppShellClient } from "@/components/layout/app-shell-client";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <AppShellClient
      appName="PT Global Inspeksi Sertifikasi"
      user={{
        fullName: session.fullName,
        email: session.email,
        role: session.role,
      }}
    >
      {children}
    </AppShellClient>
  );
}
