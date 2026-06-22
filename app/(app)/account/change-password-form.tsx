"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { changeOwnPasswordAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFormData = useRef<FormData | null>(null);

  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);
    setServerError(null);

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmNewPassword = String(formData.get("confirmNewPassword") ?? "");

    if (newPassword.length < 8) {
      setClientError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setClientError("Konfirmasi password baru tidak cocok.");
      return;
    }

    pendingFormData.current = formData;
    setConfirmOpen(true);
  }

  function handleConfirmChange() {
    const formData = pendingFormData.current;
    if (!formData) return;

    startTransition(async () => {
      const result = await changeOwnPasswordAction(formData);
      setConfirmOpen(false);

      if ("error" in result) {
        setServerError(result.error);
        return;
      }

      formRef.current?.reset();
      setSuccessOpen(true);
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ganti Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="currentPassword">Password Lama</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input id="newPassword" name="newPassword" type="password" minLength={8} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword">Konfirmasi Password Baru</Label>
              <Input id="confirmNewPassword" name="confirmNewPassword" type="password" minLength={8} required />
            </div>

            {(clientError || serverError) && (
              <div className="sm:col-span-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {clientError ?? serverError}
              </div>
            )}

            <div className="sm:col-span-2">
              <Button type="submit" disabled={isPending}>
                Ganti Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yakin ingin mengganti password?</DialogTitle>
            <DialogDescription>
              Setelah diganti, gunakan password baru saat login berikutnya.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" disabled={isPending} onClick={handleConfirmChange}>
              {isPending ? "Memproses..." : "Ya, Ganti"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password berhasil diganti</DialogTitle>
            <DialogDescription>
              Gunakan password baru Anda saat login berikutnya.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
