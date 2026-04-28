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
import type { VehiculoRelationOptions } from "../../../types/vehiculo"

interface StepClasificacionProps {
  control: Control<VehiculoInput>
  errors: FieldErrors<VehiculoInput>
  options: VehiculoRelationOptions
}

export function StepClasificacion({ control, errors, options }: StepClasificacionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.marcaId ? "text-destructive" : "text-muted-foreground")}>
          Marca *
        </Label>
        <Controller
          name="marcaId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.marcaId}>
                <SelectValue placeholder="Selecciona marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.marcas.map((m) => <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.marcaId && <p className="text-xs text-destructive">{errors.marcaId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.categoriaId ? "text-destructive" : "text-muted-foreground")}>
          Categoría *
        </Label>
        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.categoriaId}>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoriaId && <p className="text-xs text-destructive">{errors.categoriaId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.sucursalId ? "text-destructive" : "text-muted-foreground")}>
          Sucursal *
        </Label>
        <Controller
          name="sucursalId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.sucursalId}>
                <SelectValue placeholder="Selecciona sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.sucursales.map((s) => <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.sucursalId && <p className="text-xs text-destructive">{errors.sucursalId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={cn("text-xs uppercase tracking-wide", errors.etiquetaComercialId ? "text-destructive" : "text-muted-foreground")}>
          Etiqueta comercial *
        </Label>
        <Controller
          name="etiquetaComercialId"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.etiquetaComercialId}>
                <SelectValue placeholder="Selecciona etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.etiquetas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.etiquetaComercialId && <p className="text-xs text-destructive">{errors.etiquetaComercialId.message}</p>}
      </div>
    </div>
  )
}
