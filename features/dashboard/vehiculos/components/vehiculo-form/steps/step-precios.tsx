"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { cn } from "@/features/dashboard/lib/utils"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import type { VehiculoInput } from "../../../validations/vehiculo"

interface StepPreciosProps {
  register: UseFormRegister<VehiculoInput>
  errors: FieldErrors<VehiculoInput>
}

export function StepPrecios({ register, errors }: StepPreciosProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.precio ? "text-destructive" : "text-muted-foreground")}>
          Precio (Q) *
        </Label>
        <Input
          type="number"
          step="0.01"
          aria-invalid={!!errors.precio}
          {...register("precio")}
        />
        {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.preciodescuento ? "text-destructive" : "text-muted-foreground")}>
          Precio con descuento (Q)
        </Label>
        <Input
          type="number"
          step="0.01"
          aria-invalid={!!errors.preciodescuento}
          {...register("preciodescuento")}
        />
        {errors.preciodescuento && (
          <p className="text-xs text-destructive">{errors.preciodescuento.message}</p>
        )}
      </div>
    </div>
  )
}
