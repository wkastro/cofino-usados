"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import type { VehiculoInput } from "../../../validations/vehiculo"

interface StepInfoGeneralProps {
  register: UseFormRegister<VehiculoInput>
  errors: FieldErrors<VehiculoInput>
}

export function StepInfoGeneral({ register, errors }: StepInfoGeneralProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Nombre *</Label>
        <Input placeholder="Ej: Toyota Corolla SE" {...register("nombre")} />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Placa *</Label>
        <Input placeholder="Ej: P123ABC" {...register("placa")} />
        {errors.placa && <p className="text-xs text-destructive">{errors.placa.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Código interno</Label>
        <Input placeholder="Código AS400" {...register("codigo")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Año *</Label>
        <Input type="number" {...register("anio")} />
        {errors.anio && <p className="text-xs text-destructive">{errors.anio.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Kilometraje *</Label>
        <Input type="number" {...register("kilometraje")} />
        {errors.kilometraje && <p className="text-xs text-destructive">{errors.kilometraje.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Motor (cc)</Label>
        <Input placeholder="Ej: 1800" {...register("motor")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Color exterior</Label>
        <Input placeholder="Ej: Blanco perla" {...register("color_exterior")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Color interior</Label>
        <Input placeholder="Ej: Negro" {...register("color_interior")} />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Descripción</Label>
        <Textarea
          placeholder="Descripción detallada del vehículo..."
          rows={4}
          {...register("descripcion")}
        />
      </div>
    </div>
  )
}
