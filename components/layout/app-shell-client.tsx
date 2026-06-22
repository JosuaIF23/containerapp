"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck, LogOut } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";
import { ROLE_LABELS } from "@/lib/auth/authz";

type AppShellClientProps = {
  appName: string;
  user: {
    fullName: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
};

export function AppShellClient({ appName, user, children }: AppShellClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [, startLogoutTransition] = useTransition();
  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen gap-4 p-4">
      <aside
        className={`glass relative flex flex-col rounded-3xl py-6 transition-all duration-300 ${
          collapsed ? "w-[104px]" : "w-[280px]"
        }`}
      >
        <div className="mb-6 flex items-center gap-3 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary-100" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">{appName}</p>
              <p className="truncate text-xs text-foreground/50">Dashboard Internal</p>
            </div>
          )}
        </div>

        <SidebarNav collapsed={collapsed} role={user.role} />

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="glass absolute -right-3 top-8 flex h-7 w-7 items-center justify-center rounded-full"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="mt-auto flex flex-col gap-2 px-3">
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-3 px-3"
            onClick={() => startLogoutTransition(() => logoutAction())}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Keluar"}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col gap-4">
        <header className="glass flex items-center justify-between rounded-3xl px-6 py-4">
          <p className="hidden text-sm text-foreground/60 sm:block">
            Selamat datang kembali, kelola inspeksi & sertifikasi kontainer Anda.
          </p>
          <div className="flex items-center gap-3">
            <Badge>{ROLE_LABELS[user.role] ?? user.role}</Badge>
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-white/10"
            >
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                <p className="text-xs text-foreground/50">{user.email}</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="glass flex-1 rounded-3xl p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
