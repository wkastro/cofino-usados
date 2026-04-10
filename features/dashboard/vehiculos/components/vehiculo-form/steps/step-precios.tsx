"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
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
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">
          Precio (Q) *
        </Label>
        <Input type="number" step="0.01" {...register("precio")} />
        {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">
          Precio con descuento (Q)
        </Label>
        <Input type="number" step="0.01" {...register("preciodescuento")} />
        {errors.preciodescuento && <p className="text-xs text-destructive">{errors.preciodescuento.message}</p>}
      </div>
    </div>
  )
}
