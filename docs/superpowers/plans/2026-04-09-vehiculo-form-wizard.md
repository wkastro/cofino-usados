# Vehiculo Form Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the vehiculo create/edit form as a 5-step wizard with per-step Zod validation and a single submit at the end.

**Architecture:** A new `useVehiculoFormWizard` hook wraps the existing `react-hook-form` + Zod setup, adding `currentStep`, `goNext()` (triggers validation for the current step's fields), and `goPrev()`. Each step is an isolated presentational component. The gallery is migrated from a standalone `GaleriaManager` into `StepGaleria`, which accepts an `UploadAdapter` for future S3 integration.

**Tech Stack:** Next.js 16 App Router, React 19, React Hook Form, Zod, shadcn/ui (Button, Card, Badge, Separator), Tailwind CSS v4, TypeScript.

---

## File Map

**Create:**
- `features/dashboard/vehiculos/hooks/useVehiculoFormWizard.ts` — wizard state + form logic
- `features/dashboard/vehiculos/components/vehiculo-form/upload-adapter.ts` — UploadAdapter interface + LocalUrlAdapter
- `features/dashboard/vehiculos/components/vehiculo-form/stepper.tsx` — visual stepper component
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-info-general.tsx` — step 1
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-especificaciones.tsx` — step 2
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-precios.tsx` — step 3
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-clasificacion.tsx` — step 4
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-galeria.tsx` — step 5

**Modify:**
- `features/dashboard/vehiculos/components/vehiculo-form/form.tsx` — full rewrite to wizard shell
- `features/dashboard/vehiculos/components/vehiculo-edit-page.tsx` — remove standalone GaleriaManager

**Delete:**
- `features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx` — replaced by step-galeria.tsx

---

## Task 1: Upload adapter

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/upload-adapter.ts`

- [ ] **Step 1: Create upload-adapter.ts**

```ts
export interface UploadAdapter {
  upload(file: File): Promise<{ url: string }>
}

/**
 * Current implementation: URL input only.
 * Swap for S3Adapter when ready — StepGaleria accepts any UploadAdapter.
 */
export class LocalUrlAdapter implements UploadAdapter {
  async upload(_file: File): Promise<{ url: string }> {
    throw new Error("LocalUrlAdapter does not support file uploads. Use URL input instead.")
  }
}

export const localUrlAdapter = new LocalUrlAdapter()
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: no errors in `upload-adapter.ts`

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/upload-adapter.ts
git commit -m "feat(vehiculos): add UploadAdapter interface with LocalUrlAdapter"
```

---

## Task 2: Stepper component

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/stepper.tsx`

- [ ] **Step 1: Create stepper.tsx**

```tsx
"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/features/dashboard/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Pasos del formulario">
      <ol className="flex items-start">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          return (
            <li key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 min-w-0">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isActive && "border-primary text-primary",
                    !isCompleted && !isActive && "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckIcon className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap hidden sm:block",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 mt-[-16px] transition-colors",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/stepper.tsx
git commit -m "feat(vehiculos): add Stepper component"
```

---

## Task 3: Step 1 — Info General

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/steps/step-info-general.tsx`

- [ ] **Step 1: Create step-info-general.tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/steps/step-info-general.tsx
git commit -m "feat(vehiculos): add StepInfoGeneral component"
```

---

## Task 4: Step 2 — Especificaciones

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/steps/step-especificaciones.tsx`

- [ ] **Step 1: Create step-especificaciones.tsx**

```tsx
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
              <SelectTrigger><SelectValue /></SelectTrigger>
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
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/steps/step-especificaciones.tsx
git commit -m "feat(vehiculos): add StepEspecificaciones component"
```

---

## Task 5: Step 3 — Precios

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/steps/step-precios.tsx`

- [ ] **Step 1: Create step-precios.tsx**

```tsx
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
          Precio con IVA (Q) *
        </Label>
        <Input type="number" step="0.01" {...register("precio")} />
        {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground tracking-wide">
          Precio sin IVA (Q) *
        </Label>
        <Input type="number" step="0.01" {...register("preciosiniva")} />
        {errors.preciosiniva && <p className="text-xs text-destructive">{errors.preciosiniva.message}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/steps/step-precios.tsx
git commit -m "feat(vehiculos): add StepPrecios component"
```

---

## Task 6: Step 4 — Clasificación

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/steps/step-clasificacion.tsx`

- [ ] **Step 1: Create step-clasificacion.tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/steps/step-clasificacion.tsx
git commit -m "feat(vehiculos): add StepClasificacion component"
```

---

## Task 7: Step 5 — Galería

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/steps/step-galeria.tsx`

This replaces `galeria-manager.tsx`. In **create mode** (`vehiculoId === null`), images are queued locally with a `pending-` id prefix — they are not persisted until the user submits. In **edit mode**, images are persisted in real time as before.

- [ ] **Step 1: Create step-galeria.tsx**

```tsx
"use client"

import { useState, useTransition } from "react"
import { ImageIcon, PlusIcon, TrashIcon, GripVerticalIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import {
  addGaleriaImage,
  removeGaleriaImage,
  reorderGaleriaImages,
} from "../../../actions/vehiculo.actions"
import type { GaleriaItem } from "../../../types/vehiculo"
import type { UploadAdapter } from "../upload-adapter"

interface StepGaleriaProps {
  vehiculoId: string | null
  initialImages: GaleriaItem[]
  adapter: UploadAdapter
}

export function StepGaleria({ vehiculoId, initialImages, adapter: _adapter }: StepGaleriaProps) {
  const [images, setImages] = useState<GaleriaItem[]>(initialImages)
  const [newUrl, setNewUrl] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleAddImage() {
    if (!newUrl.trim()) return

    if (!vehiculoId) {
      setImages((prev) => [
        ...prev,
        { id: `pending-${Date.now()}`, url: newUrl.trim(), orden: prev.length },
      ])
      setNewUrl("")
      return
    }

    startTransition(async () => {
      const result = await addGaleriaImage(vehiculoId, newUrl.trim(), images.length)
      if (result.ok && result.data) {
        setImages((prev) => [
          ...prev,
          { id: result.data!.id, url: result.data!.url, orden: result.data!.orden },
        ])
        setNewUrl("")
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleRemove(galeriaId: string) {
    if (!vehiculoId || galeriaId.startsWith("pending-")) {
      setImages((prev) => prev.filter((img) => img.id !== galeriaId))
      return
    }
    startTransition(async () => {
      const result = await removeGaleriaImage(galeriaId, vehiculoId)
      if (result.ok) {
        setImages((prev) => prev.filter((img) => img.id !== galeriaId))
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleMoveUp(index: number) {
    if (index === 0) return
    const previous = [...images]
    const reordered = [...images]
    ;[reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]]
    const withOrden = reordered.map((img, i) => ({ ...img, orden: i }))
    setImages(withOrden)

    if (!vehiculoId) return

    startTransition(async () => {
      const result = await reorderGaleriaImages(
        vehiculoId,
        withOrden.map(({ id, orden }) => ({ id, orden })),
      )
      if (!result.ok) {
        setImages(previous)
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="gallery-url" className="sr-only">URL de imagen</Label>
          <Input
            id="gallery-url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://cdn.ejemplo.com/imagen.jpg"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddImage}
          disabled={isPending || !newUrl.trim()}
          aria-label="Añadir imagen"
        >
          <PlusIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed gap-2 text-muted-foreground">
          <ImageIcon className="size-8" />
          <p className="text-sm">Añade URLs de imágenes arriba</p>
          {!vehiculoId && (
            <p className="text-xs">Las imágenes se guardarán al crear el vehículo</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, index) => (
            <div key={img.id} className="group relative rounded-lg border overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 bg-black/40 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7"
                    onClick={() => handleMoveUp(index)}
                    disabled={isPending}
                  >
                    <GripVerticalIcon className="size-3" aria-hidden="true" />
                    <span className="sr-only">Subir</span>
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-7"
                  onClick={() => handleRemove(img.id)}
                  disabled={isPending}
                >
                  <TrashIcon className="size-3" aria-hidden="true" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/steps/step-galeria.tsx
git commit -m "feat(vehiculos): add StepGaleria component with create/edit mode support"
```

---

## Task 8: useVehiculoFormWizard hook

**Files:**
- Create: `features/dashboard/vehiculos/hooks/useVehiculoFormWizard.ts`

- [ ] **Step 1: Create useVehiculoFormWizard.ts**

```ts
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/enums"
import { vehiculoSchema, type VehiculoInput } from "../validations/vehiculo"
import { createVehiculo, updateVehiculo } from "../actions/vehiculo.actions"
import type { VehiculoAdmin, ActionResult } from "../types/vehiculo"

const TOTAL_STEPS = 5

const STEP_FIELDS: Record<number, (keyof VehiculoInput)[]> = {
  0: ["nombre", "placa", "anio", "kilometraje"],
  1: ["transmision", "combustible", "traccion"],
  2: ["precio", "preciosiniva"],
  3: ["marcaId", "categoriaId", "sucursalId"],
  4: [],
}

interface UseVehiculoFormWizardOptions {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
}

export function useVehiculoFormWizard({ mode, vehiculo }: UseVehiculoFormWizardOptions) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      nombre: vehiculo?.nombre ?? "",
      codigo: vehiculo?.codigo ?? "",
      placa: vehiculo?.placa ?? "",
      precio: vehiculo?.precio ?? 0,
      preciosiniva: vehiculo?.preciosiniva ?? 0,
      kilometraje: vehiculo?.kilometraje ?? 0,
      motor: vehiculo?.motor ?? "",
      anio: vehiculo?.anio ?? new Date().getFullYear(),
      estado: vehiculo?.estado ?? EstadoVenta.Disponible,
      transmision: vehiculo?.transmision ?? Transmision.Automatico,
      combustible: vehiculo?.combustible ?? Combustible.Gasolina,
      traccion: vehiculo?.traccion ?? Traccion.T4X2,
      color_interior: vehiculo?.color_interior ?? "",
      color_exterior: vehiculo?.color_exterior ?? "",
      descripcion: vehiculo?.descripcion ?? "",
      marcaId: vehiculo?.marcaId ?? "",
      sucursalId: vehiculo?.sucursalId ?? "",
      categoriaId: vehiculo?.categoriaId ?? "",
      etiquetaComercialId: vehiculo?.etiquetaComercialId ?? null,
    },
  })

  async function goNext() {
    const fields = STEP_FIELDS[currentStep]
    const valid = fields.length === 0 || (await form.trigger(fields))
    if (valid) setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      let result: ActionResult<unknown>
      if (mode === "create") {
        result = await createVehiculo(data as VehiculoInput)
      } else {
        if (!vehiculo) {
          toast.error("No se puede guardar: vehículo no encontrado.")
          return
        }
        result = await updateVehiculo(vehiculo.id, data as VehiculoInput)
      }

      if (result.ok) {
        toast.success(result.message)
        router.push("/dashboard/vehiculos")
        router.refresh()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof VehiculoInput, { message: messages[0] })
          }
        }
      }
    })
  })

  return {
    form,
    onSubmit,
    isPending,
    currentStep,
    goNext,
    goPrev,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === TOTAL_STEPS - 1,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/hooks/useVehiculoFormWizard.ts
git commit -m "feat(vehiculos): add useVehiculoFormWizard hook with per-step validation"
```

---

## Task 9: Rewrite form.tsx as wizard shell

**Files:**
- Modify: `features/dashboard/vehiculos/components/vehiculo-form/form.tsx`

- [ ] **Step 1: Replace the full content of form.tsx**

```tsx
"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/features/dashboard/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/card"
import { useVehiculoFormWizard } from "../../hooks/useVehiculoFormWizard"
import { Stepper } from "./stepper"
import { StepInfoGeneral } from "./steps/step-info-general"
import { StepEspecificaciones } from "./steps/step-especificaciones"
import { StepPrecios } from "./steps/step-precios"
import { StepClasificacion } from "./steps/step-clasificacion"
import { StepGaleria } from "./steps/step-galeria"
import { localUrlAdapter } from "./upload-adapter"
import type { VehiculoAdmin, VehiculoRelationOptions } from "../../types/vehiculo"

const STEP_LABELS = ["Info General", "Especificaciones", "Precios", "Clasificación", "Galería"]

const STEP_DESCRIPTIONS: Record<number, string> = {
  0: "Información básica e identificación del vehículo.",
  1: "Transmisión, combustible, tracción y estado.",
  2: "Precios con y sin IVA.",
  3: "Marca, categoría, sucursal y etiqueta comercial.",
  4: "Imágenes del vehículo.",
}

interface VehiculoFormProps {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
  options: VehiculoRelationOptions
}

export function VehiculoForm({ mode, vehiculo, options }: VehiculoFormProps) {
  const {
    form,
    onSubmit,
    isPending,
    currentStep,
    goNext,
    goPrev,
    isFirstStep,
    isLastStep,
  } = useVehiculoFormWizard({ mode, vehiculo })

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

      {/* Stepper */}
      <Stepper steps={STEP_LABELS} currentStep={currentStep} />

      {/* Step Card */}
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{STEP_LABELS[currentStep]}</CardTitle>
            <CardDescription>{STEP_DESCRIPTIONS[currentStep]}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <StepInfoGeneral register={register} errors={errors} />
            )}
            {currentStep === 1 && (
              <StepEspecificaciones control={control} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepPrecios register={register} errors={errors} />
            )}
            {currentStep === 3 && (
              <StepClasificacion control={control} errors={errors} options={options} />
            )}
            {currentStep === 4 && (
              <StepGaleria
                vehiculoId={vehiculo?.id ?? null}
                initialImages={vehiculo?.galeria ?? []}
                adapter={localUrlAdapter}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={isFirstStep}
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Anterior
          </Button>
          {isLastStep ? (
            <Button type="submit" disabled={isPending}>
              {isPending
                ? mode === "create" ? "Creando..." : "Guardando..."
                : mode === "create" ? "Crear vehículo" : "Guardar cambios"}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Siguiente
              <ArrowRightIcon className="size-4 ml-1" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/form.tsx
git commit -m "feat(vehiculos): rewrite VehiculoForm as 5-step wizard"
```

---

## Task 10: Update VehiculoEditPage and delete galeria-manager.tsx

**Files:**
- Modify: `features/dashboard/vehiculos/components/vehiculo-edit-page.tsx`
- Delete: `features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx`

`GaleriaManager` is now embedded in the wizard as `StepGaleria`. The edit page no longer renders it separately.

- [ ] **Step 1: Replace vehiculo-edit-page.tsx**

```tsx
import { notFound } from "next/navigation"
import { getCachedVehiculoAdminById } from "../queries/vehiculo.queries"
import { getCachedRelationOptions } from "../queries/relations.queries"
import { VehiculoForm } from "./vehiculo-form/form"

interface VehiculoEditPageProps {
  id: string
}

export async function VehiculoEditPage({ id }: VehiculoEditPageProps) {
  const [vehiculo, options] = await Promise.all([
    getCachedVehiculoAdminById(id),
    getCachedRelationOptions(),
  ])

  if (!vehiculo) notFound()

  return <VehiculoForm mode="edit" vehiculo={vehiculo} options={options} />
}
```

- [ ] **Step 2: Delete galeria-manager.tsx**

```bash
git rm features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-edit-page.tsx
git commit -m "feat(vehiculos): integrate GaleriaManager into wizard, remove standalone component"
```

---

## Task 11: Verify build

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: no errors. Fix any TypeScript or import errors before proceeding.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build completes with no errors. If `galeria-manager` is still imported anywhere, the build will fail with a module not found error — grep for it and remove the import.

```bash
# Check for stale imports
grep -r "galeria-manager" --include="*.ts" --include="*.tsx" .
```

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(vehiculos): vehicle form wizard — 5 steps with per-step validation"
```
