"use client";

import { type Control, type UseFormRegister, type FieldErrors, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/forms/field-error";
import type { PurchaseFormData } from "@/lib/validations/purchase";

interface CardFormProps {
  register: UseFormRegister<PurchaseFormData>;
  control: Control<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() + i)
);

export function CardForm({ register, control, errors }: CardFormProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-fs-md font-semibold">
        Informacion de la tarjeta
      </h3>

      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número de la tarjeta</Label>
        <Input
          id="cardNumber"
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          {...register("cardNumber")}
          aria-invalid={!!errors.cardNumber}
        />
        <FieldError message={errors.cardNumber?.message} />
      </div>

      {/* Card Name */}
      <div className="space-y-2">
        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
        <Input
          id="cardName"
          placeholder="Ingresa el nombre en la tarjeta"
          {...register("cardName")}
          aria-invalid={!!errors.cardName}
        />
        <FieldError message={errors.cardName?.message} />
      </div>

      {/* Expiration + CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Expiración</Label>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="expMonth"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.expMonth}>
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              control={control}
              name="expYear"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.expYear}>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError message={errors.expMonth?.message || errors.expYear?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="***"
            maxLength={4}
            {...register("cvv")}
            aria-invalid={!!errors.cvv}
          />
          <FieldError message={errors.cvv?.message} />
        </div>
      </div>

      {/* NIT */}
      <div className="space-y-2">
        <Label htmlFor="nit">NIT / Consumidor Final</Label>
        <Input
          id="nit"
          placeholder="Ingresa el NIT o CF"
          {...register("nit")}
          aria-invalid={!!errors.nit}
        />
        <FieldError message={errors.nit?.message} />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!errors.acceptTerms}
              />
              <Label htmlFor="acceptTerms" className="text-fs-sm leading-tight font-normal">
                Acepto los{" "}
                <span className="font-medium underline">Terminos y condiciones</span>
              </Label>
            </div>
          )}
        />
        <FieldError message={errors.acceptTerms?.message} />

        <Controller
          control={control}
          name="acceptNoRefund"
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="acceptNoRefund"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!errors.acceptNoRefund}
              />
              <Label htmlFor="acceptNoRefund" className="text-fs-sm leading-tight font-normal">
                Si se reserva el vehiculo no se devuelve el 100%
              </Label>
            </div>
          )}
        />
        <FieldError message={errors.acceptNoRefund?.message} />
      </div>
    </div>
  );
}
