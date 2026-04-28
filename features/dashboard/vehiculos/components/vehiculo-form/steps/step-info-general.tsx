"use client"

import { useState } from "react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { cn } from "@/features/dashboard/lib/utils"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import { checkPlacaDisponible } from "../../../actions/vehiculo.actions"
import type { VehiculoInput } from "../../../validations/vehiculo"

interface StepInfoGeneralProps {
  register: UseFormRegister<VehiculoInput>
  errors: FieldErrors<VehiculoInput>
  vehiculoId?: string
  onPlacaDuplicada?: (duplicada: boolean) => void
}

export function StepInfoGeneral({ register, errors, vehiculoId, onPlacaDuplicada }: StepInfoGeneralProps) {
  const [placaTomada, setPlacaTomada] = useState<string | null>(null)

  const { onBlur: rhfOnBlur, onChange: rhfOnChange, ...placaRest } = register("placa")

  async function handlePlacaBlur(e: React.FocusEvent<HTMLInputElement>) {
    await rhfOnBlur(e)
    const placa = e.target.value.trim()
    if (!placa) {
      setPlacaTomada(null)
      onPlacaDuplicada?.(false)
      return
    }
    const { disponible } = await checkPlacaDisponible(placa, vehiculoId)
    setPlacaTomada(disponible ? null : "Esta placa ya está registrada en el sistema.")
    onPlacaDuplicada?.(!disponible)
  }

  const placaError = errors.placa?.message ?? placaTomada ?? undefined

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.nombre ? "text-destructive" : "text-muted-foreground")}>
          Nombre *
        </Label>
        <Input
          placeholder="Ej: Toyota Corolla SE"
          aria-invalid={!!errors.nombre}
          {...register("nombre")}
        />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", placaError ? "text-destructive" : "text-muted-foreground")}>
          Placa *
        </Label>
        <Input
          placeholder="Ej: P123ABC"
          aria-invalid={!!placaError}
          onBlur={handlePlacaBlur}
          onChange={(e) => { void rhfOnChange(e); setPlacaTomada(null); onPlacaDuplicada?.(false) }}
          {...placaRest}
        />
        {placaError && <p className="text-xs text-destructive">{placaError}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Código interno</Label>
        <Input placeholder="Código AS400" {...register("codigo")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.anio ? "text-destructive" : "text-muted-foreground")}>
          Año *
        </Label>
        <Input
          type="number"
          aria-invalid={!!errors.anio}
          {...register("anio")}
        />
        {errors.anio && <p className="text-xs text-destructive">{errors.anio.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.kilometraje ? "text-destructive" : "text-muted-foreground")}>
          Kilometraje *
        </Label>
        <Input
          type="number"
          aria-invalid={!!errors.kilometraje}
          {...register("kilometraje")}
        />
        {errors.kilometraje && <p className="text-xs text-destructive">{errors.kilometraje.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.motor ? "text-destructive" : "text-muted-foreground")}>
          Motor (cc) *
        </Label>
        <Input placeholder="Ej: 1800" aria-invalid={!!errors.motor} {...register("motor")} />
        {errors.motor && <p className="text-xs text-destructive">{errors.motor.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.color_exterior ? "text-destructive" : "text-muted-foreground")}>
          Color exterior *
        </Label>
        <Input placeholder="Ej: Blanco perla" aria-invalid={!!errors.color_exterior} {...register("color_exterior")} />
        {errors.color_exterior && <p className="text-xs text-destructive">{errors.color_exterior.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.color_interior ? "text-destructive" : "text-muted-foreground")}>
          Color interior *
        </Label>
        <Input placeholder="Ej: Negro" aria-invalid={!!errors.color_interior} {...register("color_interior")} />
        {errors.color_interior && <p className="text-xs text-destructive">{errors.color_interior.message}</p>}
      </div>

      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.descripcion ? "text-destructive" : "text-muted-foreground")}>
          Descripción *
        </Label>
        <Textarea
          placeholder="Descripción detallada del vehículo..."
          rows={4}
          aria-invalid={!!errors.descripcion}
          {...register("descripcion")}
        />
        {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
      </div>
    </div>
  )
}
