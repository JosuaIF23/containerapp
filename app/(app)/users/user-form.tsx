"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  createUserAction,
  updateUserAction,
  resetPasswordAction,
  setUserActiveAction,
} from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ROLE_LABELS, type Role } from "@/lib/auth/authz";
import type { User } from "@/lib/db/schema";

const ROLE_OPTIONS: Role[] = ["super_admin", "admin", "surveyor", "finance"];

type UserFormProps = {
  mode: "create" | "edit";
  user?: User;
  currentUserId?: string;
};

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function UserForm({ mode, user, currentUserId }: UserFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetPending, startResetTransition] = useTransition();

  const [statusError, setStatusError] = useState<string | null>(null);
  const [isStatusPending, startStatusTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createUserAction(formData)
          : await updateUserAction(user!.id, formData);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.push("/users");
      router.refresh();
    });
  }

  function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetError(null);
    setResetSuccess(false);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startResetTransition(async () => {
      const result = await resetPasswordAction(user!.id, formData);
      if ("error" in result) {
        setResetError(result.error);
        return;
      }
      setResetSuccess(true);
      form.reset();
    });
  }

  function handleToggleActive() {
    setStatusError(null);
    startStatusTransition(async () => {
      const result = await setUserActiveAction(user!.id, !user!.isActive);
      if ("error" in result) {
        setStatusError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detail Akun</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap" htmlFor="fullName">
              <Input id="fullName" name="fullName" defaultValue={user?.fullName} required />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" defaultValue={user?.email} required />
            </Field>
            <Field label="Role" htmlFor="role">
              <Select id="role" name="role" defaultValue={user?.role ?? "admin"} required>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </Select>
            </Field>
            {mode === "create" && (
              <Field label="Password" htmlFor="password">
                <Input id="password" name="password" type="password" minLength={8} required />
              </Field>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>

      {mode === "edit" && user && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="flex flex-wrap items-end gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    name="password"
                    type="password"
                    minLength={8}
                    required
                    className="max-w-xs"
                  />
                </div>
                <Button type="submit" variant="glass" disabled={isResetPending}>
                  {isResetPending ? "Memproses..." : "Reset Password"}
                </Button>
              </form>
              {resetError && (
                <p className="mt-3 text-sm text-red-300">{resetError}</p>
              )}
              {resetSuccess && (
                <p className="mt-3 text-sm text-emerald-300">Password berhasil diganti.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/60">
                Status saat ini:{" "}
                <span className="font-medium text-foreground">
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={isStatusPending || user.id === currentUserId}
                onClick={handleToggleActive}
              >
                {isStatusPending
                  ? "Memproses..."
                  : user.isActive
                  ? "Nonaktifkan Akun"
                  : "Aktifkan Akun"}
              </Button>
              {user.id === currentUserId && (
                <p className="text-xs text-foreground/40">
                  Anda tidak dapat menonaktifkan akun Anda sendiri.
                </p>
              )}
              {statusError && <p className="text-sm text-red-300">{statusError}</p>}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
