"use client"

import { Controller } from "react-hook-form"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/enums"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/dashboard/components/ui/card"
import { useVehiculoForm } from "../../hooks/useVehiculoForm"
import type { VehiculoAdmin, VehiculoRelationOptions } from "../../types/vehiculo"

interface VehiculoFormProps {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
  options: VehiculoRelationOptions
}

const ESTADOS = Object.values(EstadoVenta)
const TRANSMISIONES = Object.values(Transmision)
const COMBUSTIBLES = Object.values(Combustible)
const TRACCIONES = Object.values(Traccion)

export function VehiculoForm({ mode, vehiculo, options }: VehiculoFormProps) {
  const { form, onSubmit, isPending } = useVehiculoForm({ mode, vehiculo })
  const { register, control, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/vehiculos">
            <ArrowLeftIcon className="size-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Nuevo vehículo" : `Editar: ${vehiculo?.nombre}`}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Columna principal ─────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Información básica */}
          <Card>
            <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input id="nombre" placeholder="Ej: Toyota Corolla SE" {...register("nombre")} />
                {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="placa">Placa *</Label>
                <Input id="placa" placeholder="Ej: P123ABC" {...register("placa")} />
                {errors.placa && <p className="text-xs text-destructive">{errors.placa.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="codigo">Código interno</Label>
                <Input id="codigo" placeholder="Código AS400" {...register("codigo")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="anio">Año *</Label>
                <Input id="anio" type="number" {...register("anio")} />
                {errors.anio && <p className="text-xs text-destructive">{errors.anio.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="motor">Motor (cc)</Label>
                <Input id="motor" placeholder="Ej: 1800" {...register("motor")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="kilometraje">Kilometraje *</Label>
                <Input id="kilometraje" type="number" {...register("kilometraje")} />
                {errors.kilometraje && <p className="text-xs text-destructive">{errors.kilometraje.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="color_exterior">Color exterior</Label>
                <Input id="color_exterior" placeholder="Ej: Blanco perla" {...register("color_exterior")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="color_interior">Color interior</Label>
                <Input id="color_interior" placeholder="Ej: Negro" {...register("color_interior")} />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del vehículo..."
                  rows={4}
                  {...register("descripcion")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Especificaciones técnicas */}
          <Card>
            <CardHeader><CardTitle>Especificaciones técnicas</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Transmisión */}
              <div className="flex flex-col gap-2">
                <Label>Transmisión *</Label>
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
              {/* Combustible */}
              <div className="flex flex-col gap-2">
                <Label>Combustible *</Label>
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
              {/* Tracción */}
              <div className="flex flex-col gap-2">
                <Label>Tracción *</Label>
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
            </CardContent>
          </Card>
        </div>

        {/* ─── Columna lateral ────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Precios */}
          <Card>
            <CardHeader><CardTitle>Precios</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="precio">Precio con IVA (Q) *</Label>
                <Input id="precio" type="number" step="0.01" {...register("precio")} />
                {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="preciosiniva">Precio sin IVA (Q) *</Label>
                <Input id="preciosiniva" type="number" step="0.01" {...register("preciosiniva")} />
                {errors.preciosiniva && <p className="text-xs text-destructive">{errors.preciosiniva.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader><CardTitle>Estado</CardTitle></CardHeader>
            <CardContent>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </CardContent>
          </Card>

          {/* Relaciones */}
          <Card>
            <CardHeader><CardTitle>Clasificación</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Marca */}
              <div className="flex flex-col gap-2">
                <Label>Marca *</Label>
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
              {/* Categoría */}
              <div className="flex flex-col gap-2">
                <Label>Categoría *</Label>
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
              {/* Sucursal */}
              <div className="flex flex-col gap-2">
                <Label>Sucursal *</Label>
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
              {/* Etiqueta (opcional) */}
              <div className="flex flex-col gap-2">
                <Label>Etiqueta comercial</Label>
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
                          {options.etiquetas.map((e) => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending
                ? mode === "create" ? "Creando..." : "Guardando..."
                : mode === "create" ? "Crear vehículo" : "Guardar cambios"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/vehiculos">Cancelar</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
