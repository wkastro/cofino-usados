"use client"

import { Controller } from "react-hook-form"
import type { Control, FieldErrors } from "react-hook-form"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/enums"
import { Label } from "@/features/dashboard/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import type { VehiculoInput } from "../../../validations/vehiculo"

const TRANSMISIONES = Object.values(Transmision)
const COMBUSTIBLES = Object.values(Combustible)
const TRACCIONES = Object.values(Traccion)
const ESTADOS = Object.values(EstadoVenta)

interface StepEspecificacionesProps {
  control: Control<VehiculoInput>
  errors: FieldErrors<VehiculoInput>
}

export function StepEspecificaciones({ control, errors }: StepEspecificacionesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Transmisión *</Label>
        <Controller
          name="transmision"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TRANSMISIONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.transmision && <p className="text-xs text-destructive">{errors.transmision.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Combustible *</Label>
        <Controller
          name="combustible"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COMBUSTIBLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.combustible && <p className="text-xs text-destructive">{errors.combustible.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Tracción *</Label>
        <Controller
          name="traccion"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TRACCIONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.traccion && <p className="text-xs text-destructive">{errors.traccion.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Estado</Label>
        <Controller
          name="estado"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}
