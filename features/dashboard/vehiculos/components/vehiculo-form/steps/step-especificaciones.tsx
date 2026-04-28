"use client"

import { Controller } from "react-hook-form"
import type { Control, FieldErrors } from "react-hook-form"
import { cn } from "@/features/dashboard/lib/utils"
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
import type { SelectOption } from "../../../types/vehiculo"

interface StepEspecificacionesProps {
  control: Control<VehiculoInput>
  errors: FieldErrors<VehiculoInput>
  transmisiones: SelectOption[]
  combustibles: SelectOption[]
  tracciones: SelectOption[]
  estados: SelectOption[]
}

export function StepEspecificaciones({
  control,
  errors,
  transmisiones,
  combustibles,
  tracciones,
  estados,
}: StepEspecificacionesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.transmisionId ? "text-destructive" : "text-muted-foreground")}>
          Transmisión *
        </Label>
        <Controller
          name="transmisionId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.transmisionId}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {transmisiones.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.transmisionId && (
          <p className="text-xs text-destructive">{errors.transmisionId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.combustibleId ? "text-destructive" : "text-muted-foreground")}>
          Combustible *
        </Label>
        <Controller
          name="combustibleId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.combustibleId}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {combustibles.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.combustibleId && (
          <p className="text-xs text-destructive">{errors.combustibleId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.traccionId ? "text-destructive" : "text-muted-foreground")}>
          Tracción *
        </Label>
        <Controller
          name="traccionId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.traccionId}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tracciones.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.traccionId && (
          <p className="text-xs text-destructive">{errors.traccionId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.estadoId ? "text-destructive" : "text-muted-foreground")}>
          Estado *
        </Label>
        <Controller
          name="estadoId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.estadoId}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {estados.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.estadoId && (
          <p className="text-xs text-destructive">{errors.estadoId.message}</p>
        )}
      </div>
    </div>
  )
}
