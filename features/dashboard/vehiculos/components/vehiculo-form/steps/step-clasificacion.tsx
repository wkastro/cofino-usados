"use client"

import { Controller } from "react-hook-form"
import type { Control, FieldErrors } from "react-hook-form"
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
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Marca *</Label>
        <Controller
          name="marcaId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Selecciona marca" /></SelectTrigger>
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
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Categoría *</Label>
        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
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
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">Sucursal *</Label>
        <Controller
          name="sucursalId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Selecciona sucursal" /></SelectTrigger>
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
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">
          Etiqueta comercial
        </Label>
        <Controller
          name="etiquetaComercialId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? "none"}
              onValueChange={(v) => field.onChange(v === "none" ? null : v)}
            >
              <SelectTrigger><SelectValue placeholder="Sin etiqueta" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Sin etiqueta</SelectItem>
                  {options.etiquetas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}
