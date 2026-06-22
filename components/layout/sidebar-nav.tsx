"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Container,
  Users,
  UserCog,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "super_admin" | "admin" | "surveyor" | "finance";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const topLevelItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "surveyor", "finance"],
  },
];

const navGroups: NavGroup[] = [
  {
    label: "Super Admin",
    items: [
      {
        href: "/users",
        label: "Manajemen User",
        icon: Users,
        roles: ["super_admin"],
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        href: "/admin",
        label: "Panel Admin",
        icon: UserCog,
        roles: ["admin", "super_admin"],
      },
    ],
  },
  {
    label: "Surveyor",
    items: [
      {
        href: "/containers",
        label: "Inspeksi Kontainer",
        icon: Container,
        roles: ["super_admin", "admin", "surveyor"],
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        href: "/finance",
        label: "Laporan Keuangan",
        icon: Wallet,
        roles: ["finance", "super_admin"],
      },
    ],
  },
];

function NavLink({ item, collapsed, pathname }: { item: NavItem; collapsed: boolean; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-glow"
          : "text-foreground/70 hover:bg-white/10 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function SidebarNav({ collapsed, role }: { collapsed: boolean; role: string }) {
  const pathname = usePathname();
  const topItems = topLevelItems.filter((item) => item.roles.includes(role as Role));
  const visibleGroups = navGroups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((item) => item.roles.includes(role as Role)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav className="flex flex-col gap-1 px-3">
      {topItems.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
      ))}

      {visibleGroups.map((group, index) => (
        <div key={group.label} className={cn(index > 0 && "mt-2 border-t border-white/10 pt-2")}>
          {!collapsed && (
            <div className="px-3 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-foreground/40">
              {group.label}
            </div>
          )}
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
          ))}
        </div>
      ))}
    </nav>
  );
}
