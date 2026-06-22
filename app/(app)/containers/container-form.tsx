"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createContainerAction, updateContainerAction } from "@/app/actions/containers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Container } from "@/lib/db/schema";

type SurveyorOption = { id: string; fullName: string };

type ContainerFormProps = {
  mode: "create" | "edit";
  container?: Container;
  surveyors: SurveyorOption[];
  showSurveyorPicker: boolean;
  readOnly?: boolean;
};

function toDateInputValue(date?: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function ContainerForm({
  mode,
  container,
  surveyors,
  showSurveyorPicker,
  readOnly = false,
}: ContainerFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createContainerAction(formData)
          : await updateContainerAction(container!.id, formData);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      const targetId = mode === "create" ? result.id : container!.id;
      router.push(`/containers/${targetId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
      <Card>
        <CardHeader>
          <CardTitle>Detail Survey</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Customer" htmlFor="customer">
            <Input id="customer" name="customer" defaultValue={container?.customer} required />
          </Field>
          <Field label="Tipe Survey" htmlFor="typeSurvey">
            <Select id="typeSurvey" name="typeSurvey" defaultValue={container?.typeSurvey ?? "In-serv"} required>
              <option value="In-serv">In-serv</option>
              <option value="ONH">ONH</option>
              <option value="OFH">OFH</option>
              <option value="Sale">Sale</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={container?.status ?? "Mty"} required>
              <option value="Mty">Mty</option>
              <option value="Full">Full</option>
            </Select>
          </Field>
          <Field label="Kondisi" htmlFor="condition">
            <Select id="condition" name="condition" defaultValue={container?.condition ?? "AVL"} required>
              <option value="DMG">DMG</option>
              <option value="AVL">AVL</option>
              <option value="AR">AR</option>
            </Select>
          </Field>
          <Field label="Kebersihan" htmlFor="cleanliness">
            <Select id="cleanliness" name="cleanliness" defaultValue={container?.cleanliness ?? "ctm"} required>
              <option value="dty">dty</option>
              <option value="ctm">ctm</option>
            </Select>
          </Field>
          <Field label="Lokasi Survey" htmlFor="surveyLocation">
            <Input id="surveyLocation" name="surveyLocation" defaultValue={container?.surveyLocation} required />
          </Field>
          <Field label="Tanggal Survey" htmlFor="dateSurvey">
            <Input
              id="dateSurvey"
              name="dateSurvey"
              type="date"
              defaultValue={toDateInputValue(container?.dateSurvey)}
              required
            />
          </Field>
          {showSurveyorPicker && (
            <Field label="Surveyor" htmlFor="surveyorId">
              <Select id="surveyorId" name="surveyorId" defaultValue={container?.surveyorId ?? ""}>
                <option value="">— Belum ditentukan —</option>
                {surveyors.map((surveyor) => (
                  <option key={surveyor.id} value={surveyor.id}>
                    {surveyor.fullName}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi Kontainer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="No. Kontainer" htmlFor="containerNumber">
            <Input id="containerNumber" name="containerNumber" defaultValue={container?.containerNumber} required />
          </Field>
          <Field label="Ukuran (ft)" htmlFor="size">
            <Input id="size" name="size" type="number" min={1} defaultValue={container?.size} required />
          </Field>
          <Field label="Tanggal Manufaktur" htmlFor="dateManufactured">
            <Input
              id="dateManufactured"
              name="dateManufactured"
              type="date"
              defaultValue={toDateInputValue(container?.dateManufactured)}
              required
            />
          </Field>
          <Field label="Tipe ISO" htmlFor="type">
            <Input id="type" name="type" defaultValue={container?.type} required />
          </Field>
          <Field label="CSC" htmlFor="csc">
            <Input id="csc" name="csc" defaultValue={container?.csc} required />
          </Field>
          <Field label="MGM" htmlFor="mgm">
            <Input id="mgm" name="mgm" defaultValue={container?.mgm} required />
          </Field>
          <Field label="ACEP" htmlFor="acep">
            <Input id="acep" name="acep" defaultValue={container?.acep} required />
          </Field>
          <Field label="Payload (kg)" htmlFor="payload">
            <Input id="payload" name="payload" type="number" min={1} defaultValue={container?.payload} required />
          </Field>
          <Field label="TCT" htmlFor="tct">
            <Input id="tct" name="tct" defaultValue={container?.tct} required />
          </Field>
          <Field label="Tare (kg)" htmlFor="tare">
            <Input id="tare" name="tare" type="number" min={1} defaultValue={container?.tare} required />
          </Field>
          <Field label="Cu. Cap (CBM)" htmlFor="cuCap">
            <Input id="cuCap" name="cuCap" type="number" min={1} defaultValue={container?.cuCap} required />
          </Field>
          <Field label="Third Security System" htmlFor="thirdSctySys">
            <Input id="thirdSctySys" name="thirdSctySys" defaultValue={container?.thirdSctySys ?? ""} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catatan</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="note"
            name="note"
            placeholder="Tulis keterangan inspeksi di sini..."
            defaultValue={container?.note ?? ""}
          />
        </CardContent>
      </Card>
      </fieldset>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {!readOnly && (
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      )}
    </form>
  );
}
