"use client";

import { useCallback, useRef, useState } from "react";
import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
  Controller,
} from "react-hook-form";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/field-error";
import type { PurchaseFormData } from "@/lib/validations/purchase";

interface TransferFormProps {
  register: UseFormRegister<PurchaseFormData>;
  control: Control<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
}

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.pdf";

export function TransferForm({ register, control, errors }: TransferFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-5">
      <h3 className="text-fs-md font-semibold">Detalles de la transferencia</h3>

      {/* Bank Name & Account Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">Nombre del banco</Label>
          <Input
            id="bankName"
            placeholder="Ingresa el nombre del banco"
            {...register("bankName")}
            aria-invalid={!!errors.bankName}
          />
          <FieldError message={errors.bankName?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Número de cuenta</Label>
          <Input
            id="accountNumber"
            placeholder="Ingresa el nombre de cuenta"
            {...register("accountNumber")}
            aria-invalid={!!errors.accountNumber}
          />
          <FieldError message={errors.accountNumber?.message} />
        </div>
      </div>

      {/* Auth Number */}
      <div className="space-y-2">
        <Label htmlFor="authNumber">Número de autorización</Label>
        <Input
          id="authNumber"
          placeholder="Ingresa el número de autorización"
          {...register("authNumber")}
          aria-invalid={!!errors.authNumber}
        />
        <FieldError message={errors.authNumber?.message} />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Sube tu recibo</Label>
        <Controller
          control={control}
          name="receipt"
          render={({ field: { onChange } }) => (
            <button
              type="button"
              onClick={handleZoneClick}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-gray-100 p-8 transition-colors hover:bg-gray-200 cursor-pointer"
            >
              <Upload className="size-6 text-gray-600" />
              <p className="text-fs-sm font-semibold">
                {fileName ?? "Click para subir el archivo"}
              </p>
              <p className="text-fs-xs text-gray-400">JPG, PDF, PNG</p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    setFileName(file.name);
                  }
                }}
              />
            </button>
          )}
        />
        <FieldError message={errors.receipt?.message} />
      </div>
    </div>
  );
}
