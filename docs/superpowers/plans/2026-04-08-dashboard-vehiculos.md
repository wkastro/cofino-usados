# Dashboard Vehículos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar un CRUD completo de vehículos en el dashboard admin (`/dashboard/vehiculos`) con tabla paginada/filtrable, formulario de create/edit y gestión de galería, siguiendo los patrones ya establecidos en el proyecto.

**Architecture:** RSC pages bajo `app/dashboard/vehiculos/` como shells con `<Suspense>`; toda la lógica en `features/dashboard/vehiculos/`. Queries read-only con `"use cache"` + `cacheTag`; mutaciones con `"use server"` server actions. TanStack Table en el cliente; React Hook Form + Zod para los formularios. Paginación y búsqueda vía URL `searchParams`.

**Tech Stack:** Next.js 16 (`cacheComponents: true`), React 19, TanStack Table v8, React Hook Form v7, Zod v4, Prisma (MariaDB), `sonner` toasts, Tailwind CSS v4, `@/features/dashboard/components/ui/*`.

---

## File Map

```
# Tipos y validaciones
features/dashboard/vehiculos/types/vehiculo.ts         (CREAR)
features/dashboard/vehiculos/validations/vehiculo.ts   (CREAR)
features/dashboard/vehiculos/lib/slug.ts               (CREAR)

# Data layer
features/dashboard/vehiculos/queries/vehiculo.queries.ts    (CREAR)
features/dashboard/vehiculos/queries/relations.queries.ts   (CREAR)
features/dashboard/vehiculos/actions/vehiculo.actions.ts    (CREAR)

# Hooks (client)
features/dashboard/vehiculos/hooks/useVehiculosTable.ts  (CREAR)
features/dashboard/vehiculos/hooks/useVehiculoForm.ts    (CREAR)

# Componentes compartidos
features/dashboard/vehiculos/components/shared/estado-badge.tsx  (CREAR)

# Tabla
features/dashboard/vehiculos/components/vehiculos-table/skeleton.tsx    (CREAR)
features/dashboard/vehiculos/components/vehiculos-table/columns.tsx     (CREAR)
features/dashboard/vehiculos/components/vehiculos-table/row-actions.tsx (CREAR)
features/dashboard/vehiculos/components/vehiculos-table/toolbar.tsx     (CREAR)
features/dashboard/vehiculos/components/vehiculos-table/table.tsx       (CREAR)

# Formulario
features/dashboard/vehiculos/components/vehiculo-form/form.tsx           (CREAR)
features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx (CREAR)

# RSC page components (hidratados bajo Suspense)
features/dashboard/vehiculos/components/vehiculos-page.tsx       (CREAR)
features/dashboard/vehiculos/components/vehiculo-create-page.tsx (CREAR)
features/dashboard/vehiculos/components/vehiculo-edit-page.tsx   (CREAR)

# App routes
app/dashboard/vehiculos/page.tsx           (CREAR)
app/dashboard/vehiculos/nuevo/page.tsx     (CREAR)
app/dashboard/vehiculos/[id]/editar/page.tsx (CREAR)

# Navigation
features/dashboard/navigation/sidebar/sidebar-items.ts (MODIFICAR)
```

---

## Task 1: Tipos TypeScript, Validaciones Zod y utilidad slug

**Files:**
- Create: `features/dashboard/vehiculos/types/vehiculo.ts`
- Create: `features/dashboard/vehiculos/validations/vehiculo.ts`
- Create: `features/dashboard/vehiculos/lib/slug.ts`

- [ ] **Step 1: Crear los tipos TypeScript**

```ts
// features/dashboard/vehiculos/types/vehiculo.ts
import type { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/client"

// ─── Selects para formularios ────────────────────────────────────────────────
export interface SelectOption {
  id: string
  nombre: string
}

// ─── Opciones de relaciones para el formulario ───────────────────────────────
export interface VehiculoRelationOptions {
  marcas: SelectOption[]
  categorias: SelectOption[]
  sucursales: SelectOption[]
  etiquetas: SelectOption[]
}

// ─── Fila para la tabla ──────────────────────────────────────────────────────
export interface VehiculoRow {
  id: string
  nombre: string
  slug: string
  placa: string
  codigo: string | null
  precio: number
  kilometraje: number
  anio: number
  estado: EstadoVenta
  transmision: Transmision
  combustible: Combustible
  marca: string
  categoria: string
  sucursal: string
  createdAt: Date
}

// ─── Detalle completo (para formulario de edición) ───────────────────────────
export interface VehiculoAdmin {
  id: string
  nombre: string
  slug: string
  codigo: string | null
  placa: string
  precio: number
  preciosiniva: number
  kilometraje: number
  motor: string | null
  anio: number
  estado: EstadoVenta
  transmision: Transmision
  combustible: Combustible
  traccion: Traccion
  color_interior: string | null
  color_exterior: string | null
  descripcion: string | null
  marcaId: string
  sucursalId: string
  categoriaId: string
  etiquetaComercialId: string | null
  galeria: GaleriaItem[]
  createdAt: Date
  updatedAt: Date
}

export interface GaleriaItem {
  id: string
  url: string
  orden: number
}

// ─── Resultado paginado para la tabla ────────────────────────────────────────
export interface VehiculosAdminResponse {
  vehiculos: VehiculoRow[]
  total: number
  pages: number
  page: number
}

// ─── Resultado estándar de server actions ────────────────────────────────────
export interface ActionResult<T = undefined> {
  ok: boolean
  message: string
  data?: T
  fieldErrors?: Record<string, string[]>
}
```

- [ ] **Step 2: Crear el schema Zod**

```ts
// features/dashboard/vehiculos/validations/vehiculo.ts
import { z } from "zod"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/client"

export const vehiculoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  codigo: z.string().optional().default(""),
  placa: z.string().min(2, "La placa es requerida").max(20, "Placa muy larga"),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0"),
  preciosiniva: z.coerce.number().positive("El precio sin IVA debe ser mayor a 0"),
  kilometraje: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo"),
  motor: z.string().optional().default(""),
  anio: z.coerce
    .number()
    .int()
    .min(1900, "Año inválido")
    .max(new Date().getFullYear() + 2, "Año inválido"),
  estado: z.nativeEnum(EstadoVenta),
  transmision: z.nativeEnum(Transmision),
  combustible: z.nativeEnum(Combustible),
  traccion: z.nativeEnum(Traccion),
  color_interior: z.string().optional().default(""),
  color_exterior: z.string().optional().default(""),
  descripcion: z.string().optional().default(""),
  marcaId: z.string().uuid("Selecciona una marca"),
  sucursalId: z.string().uuid("Selecciona una sucursal"),
  categoriaId: z.string().uuid("Selecciona una categoría"),
  etiquetaComercialId: z.string().uuid().optional().nullable(),
})

export type VehiculoInput = z.infer<typeof vehiculoSchema>

export const galeriaImageSchema = z.object({
  url: z.string().url("Ingresa una URL válida de imagen"),
  orden: z.coerce.number().int().min(0).default(0),
})

export type GaleriaImageInput = z.infer<typeof galeriaImageSchema>
```

- [ ] **Step 3: Crear utilidad de generación de slug**

```ts
// features/dashboard/vehiculos/lib/slug.ts

/**
 * Genera un slug URL-safe a partir de campos del vehículo.
 * Ejemplo: "Toyota Corolla 2022 ABC123" → "toyota-corolla-2022-abc123"
 */
export function generateVehiculoSlug(
  nombre: string,
  marcaNombre: string,
  anio: number,
  placa: string,
): string {
  return `${marcaNombre}-${nombre}-${anio}-${placa}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quitar tildes
    .replace(/[^a-z0-9\s-]/g, "")      // solo alfanumérico y guiones
    .replace(/\s+/g, "-")              // espacios → guiones
    .replace(/-+/g, "-")               // colapsar guiones duplicados
    .replace(/^-|-$/g, "")             // trim guiones extremos
}
```

- [ ] **Step 4: Verificar tipos con tsc**

```bash
cd /path/to/project && npx tsc --noEmit 2>&1 | tail -10
```
Esperado: sin errores.

- [ ] **Step 5: Commit**

```bash
git add features/dashboard/vehiculos/
git commit -m "feat(dashboard/vehiculos): add types, validations and slug util"
```

---

## Task 2: Queries con `use cache`

**Files:**
- Create: `features/dashboard/vehiculos/queries/vehiculo.queries.ts`
- Create: `features/dashboard/vehiculos/queries/relations.queries.ts`

- [ ] **Step 1: Queries de vehículos (admin)**

```ts
// features/dashboard/vehiculos/queries/vehiculo.queries.ts
import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { VehiculoRow, VehiculosAdminResponse, VehiculoAdmin } from "../types/vehiculo"

const PAGE_SIZE = 20

export async function getCachedVehiculosAdmin(
  page = 1,
  search = "",
  estado?: string,
): Promise<VehiculosAdminResponse> {
  "use cache"
  cacheLife("minutes")
  cacheTag("admin-vehiculos")

  const where = {
    ...(search.trim() && {
      OR: [
        { nombre: { contains: search.trim() } },
        { placa: { contains: search.trim() } },
        { codigo: { contains: search.trim() } },
      ],
    }),
    ...(estado && { estado: estado as never }),
  }

  const clampedPage = Math.max(1, page)

  const [rawVehiculos, total] = await prisma.$transaction([
    prisma.vehiculo.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        slug: true,
        placa: true,
        codigo: true,
        precio: true,
        kilometraje: true,
        anio: true,
        estado: true,
        transmision: true,
        combustible: true,
        createdAt: true,
        marca: { select: { nombre: true } },
        categoria: { select: { nombre: true } },
        sucursal: { select: { nombre: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (clampedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.vehiculo.count({ where }),
  ])

  const vehiculos: VehiculoRow[] = rawVehiculos.map((v) => ({
    id: v.id,
    nombre: v.nombre,
    slug: v.slug,
    placa: v.placa,
    codigo: v.codigo,
    precio: Number(v.precio),
    kilometraje: v.kilometraje,
    anio: v.anio,
    estado: v.estado,
    transmision: v.transmision,
    combustible: v.combustible,
    marca: v.marca.nombre,
    categoria: v.categoria.nombre,
    sucursal: v.sucursal.nombre,
    createdAt: v.createdAt,
  }))

  return {
    vehiculos,
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page: clampedPage,
  }
}

export async function getCachedVehiculoAdminById(id: string): Promise<VehiculoAdmin | null> {
  "use cache"
  cacheLife("minutes")
  cacheTag(`admin-vehiculo-${id}`)

  const v = await prisma.vehiculo.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      slug: true,
      codigo: true,
      placa: true,
      precio: true,
      preciosiniva: true,
      kilometraje: true,
      motor: true,
      anio: true,
      estado: true,
      transmision: true,
      combustible: true,
      traccion: true,
      color_interior: true,
      color_exterior: true,
      descripcion: true,
      marcaId: true,
      sucursalId: true,
      categoriaId: true,
      etiquetaComercialId: true,
      createdAt: true,
      updatedAt: true,
      galeria: {
        select: { id: true, url: true, orden: true },
        orderBy: { orden: "asc" },
      },
    },
  })

  if (!v) return null

  return {
    ...v,
    precio: Number(v.precio),
    preciosiniva: Number(v.preciosiniva),
  }
}
```

- [ ] **Step 2: Queries de relaciones para formulario**

```ts
// features/dashboard/vehiculos/queries/relations.queries.ts
import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { SelectOption, VehiculoRelationOptions } from "../types/vehiculo"

export async function getCachedMarcasOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-marcas-options")

  return prisma.marca.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedCategoriasOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-categorias-options")

  return prisma.categoria.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedSucursalesOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-sucursales-options")

  return prisma.sucursal.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedEtiquetasOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-etiquetas-options")

  return prisma.etiquetaComercial.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedRelationOptions(): Promise<VehiculoRelationOptions> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-relation-options")

  const [marcas, categorias, sucursales, etiquetas] = await Promise.all([
    getCachedMarcasOptions(),
    getCachedCategoriasOptions(),
    getCachedSucursalesOptions(),
    getCachedEtiquetasOptions(),
  ])

  return { marcas, categorias, sucursales, etiquetas }
}
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```
Esperado: sin errores.

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/vehiculos/queries/
git commit -m "feat(dashboard/vehiculos): add cached queries for list and relations"
```

---

## Task 3: Server Actions (mutaciones CRUD)

**Files:**
- Create: `features/dashboard/vehiculos/actions/vehiculo.actions.ts`

- [ ] **Step 1: Crear el archivo de acciones**

```ts
// features/dashboard/vehiculos/actions/vehiculo.actions.ts
"use server"

import { revalidateTag, revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { vehiculoSchema, galeriaImageSchema } from "../validations/vehiculo"
import { generateVehiculoSlug } from "../lib/slug"
import type { VehiculoInput } from "../validations/vehiculo"
import type { ActionResult } from "../types/vehiculo"
import { EstadoVenta } from "@/generated/prisma/client"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function revalidateVehiculoCaches(slug?: string, id?: string): void {
  revalidateTag("admin-vehiculos")
  revalidateTag("vehicle-list")
  revalidateTag("home-recommendations")
  if (slug) revalidateTag(`vehicle-${slug}`)
  if (id) revalidateTag(`admin-vehiculo-${id}`)
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createVehiculo(
  input: VehiculoInput,
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin()

  const parsed = vehiculoSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  // Obtener nombre de marca para construir el slug
  const marca = await prisma.marca.findUnique({
    where: { id: data.marcaId },
    select: { nombre: true },
  })
  if (!marca) return { ok: false, message: "La marca seleccionada no existe." }

  let slug = generateVehiculoSlug(data.nombre, marca.nombre, data.anio, data.placa)

  // Garantizar unicidad del slug
  const existing = await prisma.vehiculo.findUnique({ where: { slug }, select: { id: true } })
  if (existing) slug = `${slug}-${Date.now()}`

  const vehiculo = await prisma.vehiculo.create({
    data: {
      nombre: data.nombre,
      slug,
      codigo: data.codigo || null,
      placa: data.placa,
      precio: data.precio,
      preciosiniva: data.preciosiniva,
      kilometraje: data.kilometraje,
      motor: data.motor || null,
      anio: data.anio,
      estado: data.estado,
      transmision: data.transmision,
      combustible: data.combustible,
      traccion: data.traccion,
      color_interior: data.color_interior || null,
      color_exterior: data.color_exterior || null,
      descripcion: data.descripcion || null,
      marcaId: data.marcaId,
      sucursalId: data.sucursalId,
      categoriaId: data.categoriaId,
      etiquetaComercialId: data.etiquetaComercialId ?? null,
    },
    select: { id: true, slug: true },
  })

  revalidateVehiculoCaches(vehiculo.slug, vehiculo.id)

  return {
    ok: true,
    message: "Vehículo creado exitosamente.",
    data: { id: vehiculo.id, slug: vehiculo.slug },
  }
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateVehiculo(
  id: string,
  input: VehiculoInput,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = vehiculoSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  const current = await prisma.vehiculo.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!current) return { ok: false, message: "Vehículo no encontrado." }

  await prisma.vehiculo.update({
    where: { id },
    data: {
      nombre: data.nombre,
      codigo: data.codigo || null,
      placa: data.placa,
      precio: data.precio,
      preciosiniva: data.preciosiniva,
      kilometraje: data.kilometraje,
      motor: data.motor || null,
      anio: data.anio,
      estado: data.estado,
      transmision: data.transmision,
      combustible: data.combustible,
      traccion: data.traccion,
      color_interior: data.color_interior || null,
      color_exterior: data.color_exterior || null,
      descripcion: data.descripcion || null,
      marcaId: data.marcaId,
      sucursalId: data.sucursalId,
      categoriaId: data.categoriaId,
      etiquetaComercialId: data.etiquetaComercialId ?? null,
    },
  })

  revalidateVehiculoCaches(current.slug, id)
  revalidatePath(`/catalogo/${current.slug}`)

  return { ok: true, message: "Vehículo actualizado exitosamente." }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteVehiculo(id: string): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  await prisma.vehiculo.delete({ where: { id } })

  revalidateVehiculoCaches(vehiculo.slug, id)
  revalidatePath(`/catalogo/${vehiculo.slug}`)

  return { ok: true, message: "Vehículo eliminado." }
}

// ─── Cambiar estado rápido ────────────────────────────────────────────────────

export async function changeEstadoVehiculo(
  id: string,
  estado: EstadoVenta,
): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  await prisma.vehiculo.update({ where: { id }, data: { estado } })

  revalidateVehiculoCaches(vehiculo.slug, id)

  return { ok: true, message: `Estado cambiado a ${estado}.` }
}

// ─── Galería ─────────────────────────────────────────────────────────────────

export async function addGaleriaImage(
  vehiculoId: string,
  url: string,
  orden: number,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = galeriaImageSchema.safeParse({ url, orden })
  if (!parsed.success) {
    return {
      ok: false,
      message: "URL de imagen inválida.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  await prisma.galeria.create({
    data: { vehiculoId, url: parsed.data.url, orden: parsed.data.orden },
  })

  revalidateTag(`admin-vehiculo-${vehiculoId}`)

  return { ok: true, message: "Imagen añadida." }
}

export async function removeGaleriaImage(
  galeriaId: string,
  vehiculoId: string,
): Promise<ActionResult> {
  await requireAdmin()

  await prisma.galeria.delete({ where: { id: galeriaId } })

  revalidateTag(`admin-vehiculo-${vehiculoId}`)

  return { ok: true, message: "Imagen eliminada." }
}

export async function reorderGaleriaImages(
  vehiculoId: string,
  images: { id: string; orden: number }[],
): Promise<ActionResult> {
  await requireAdmin()

  await prisma.$transaction(
    images.map((img) =>
      prisma.galeria.update({
        where: { id: img.id },
        data: { orden: img.orden },
      }),
    ),
  )

  revalidateTag(`admin-vehiculo-${vehiculoId}`)

  return { ok: true, message: "Galería reordenada." }
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```
Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/vehiculos/actions/
git commit -m "feat(dashboard/vehiculos): add CRUD server actions with cache invalidation"
```

---

## Task 4: Navigation — añadir Vehículos al sidebar

**Files:**
- Modify: `features/dashboard/navigation/sidebar/sidebar-items.ts`

- [ ] **Step 1: Añadir item de vehículos**

En `features/dashboard/navigation/sidebar/sidebar-items.ts`, reemplaza el contenido del array `sidebarItems`:

```ts
import { Car, LayoutDashboard, SquareArrowUpRight, type LucideIcon } from "lucide-react";

// ... (mantener las interfaces NavSubItem, NavMainItem, NavGroup sin cambios)

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [
      {
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Catálogo",
    items: [
      {
        title: "Vehículos",
        url: "/dashboard/vehiculos",
        icon: Car,
      },
    ],
  },
  {
    id: 3,
    label: "More",
    items: [
      {
        title: "Coming Soon",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/navigation/sidebar/sidebar-items.ts
git commit -m "feat(dashboard): add Vehículos nav item to sidebar"
```

---

## Task 5: Componente compartido EstadoBadge + skeleton de tabla

**Files:**
- Create: `features/dashboard/vehiculos/components/shared/estado-badge.tsx`
- Create: `features/dashboard/vehiculos/components/vehiculos-table/skeleton.tsx`

- [ ] **Step 1: Crear EstadoBadge**

```tsx
// features/dashboard/vehiculos/components/shared/estado-badge.tsx
import { Badge } from "@/features/dashboard/components/ui/badge"
import { EstadoVenta } from "@/generated/prisma/client"

const ESTADO_CONFIG: Record<
  EstadoVenta,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Disponible: { label: "Disponible", variant: "default" },
  Reservado:  { label: "Reservado",  variant: "secondary" },
  Facturado:  { label: "Facturado",  variant: "outline" },
  Vendido:    { label: "Vendido",    variant: "destructive" },
}

interface EstadoBadgeProps {
  estado: EstadoVenta
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? { label: estado, variant: "outline" as const }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
```

- [ ] **Step 2: Crear skeleton de tabla**

```tsx
// features/dashboard/vehiculos/components/vehiculos-table/skeleton.tsx
import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export function VehiculosTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-9 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 border-b bg-muted px-4 py-3">
          {[180, 80, 100, 100, 80, 80, 100, 80].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-4 py-3">
            {[180, 80, 100, 100, 80, 80, 100, 80].map((w, j) => (
              <Skeleton key={j} className="h-4" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="size-8" />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/vehiculos/components/
git commit -m "feat(dashboard/vehiculos): add EstadoBadge and table skeleton"
```

---

## Task 6: Definición de columnas + RowActions de la tabla

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculos-table/row-actions.tsx`
- Create: `features/dashboard/vehiculos/components/vehiculos-table/columns.tsx`

- [ ] **Step 1: Crear RowActions**

```tsx
// features/dashboard/vehiculos/components/vehiculos-table/row-actions.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, CircleDotIcon } from "lucide-react"
import { toast } from "sonner"
import { EstadoVenta } from "@/generated/prisma/client"
import { Button } from "@/features/dashboard/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/features/dashboard/components/ui/dropdown-menu"
import { deleteVehiculo, changeEstadoVehiculo } from "../../actions/vehiculo.actions"
import type { VehiculoRow } from "../../types/vehiculo"

const ESTADOS = Object.values(EstadoVenta)

interface RowActionsProps {
  row: VehiculoRow
}

export function RowActions({ row }: RowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleEdit() {
    router.push(`/dashboard/vehiculos/${row.id}/editar`)
  }

  function handleChangeEstado(estado: EstadoVenta) {
    startTransition(async () => {
      const result = await changeEstadoVehiculo(row.id, estado)
      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar "${row.nombre}"? Esta acción no se puede deshacer.`)) return

    startTransition(async () => {
      const result = await deleteVehiculo(row.id)
      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          disabled={isPending}
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <PencilIcon className="mr-2 size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <CircleDotIcon className="mr-2 size-4" />
            Cambiar estado
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {ESTADOS.map((estado) => (
              <DropdownMenuItem
                key={estado}
                disabled={estado === row.estado}
                onClick={() => handleChangeEstado(estado)}
              >
                {estado}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <TrashIcon className="mr-2 size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 2: Crear las columnas TanStack**

```tsx
// features/dashboard/vehiculos/components/vehiculos-table/columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency, formatKilometers } from "@/lib/formatters/vehicle"
import { EstadoBadge } from "../shared/estado-badge"
import { RowActions } from "./row-actions"
import type { VehiculoRow } from "../../types/vehiculo"

export const vehiculosColumns: ColumnDef<VehiculoRow>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="min-w-[180px]">
        <p className="font-medium leading-tight">{row.original.nombre}</p>
        <p className="text-xs text-muted-foreground">{row.original.placa}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => <span className="text-sm">{row.original.marca}</span>,
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
    cell: ({ row }) => <span className="text-sm">{row.original.categoria}</span>,
  },
  {
    accessorKey: "anio",
    header: "Año",
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.anio}</span>,
  },
  {
    accessorKey: "precio",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {formatCurrency(row.original.precio)}
      </div>
    ),
  },
  {
    accessorKey: "kilometraje",
    header: () => <div className="text-right">KM</div>,
    cell: ({ row }) => (
      <div className="text-right text-sm tabular-nums text-muted-foreground">
        {formatKilometers(row.original.kilometraje)}
      </div>
    ),
  },
  {
    accessorKey: "sucursal",
    header: "Sucursal",
    cell: ({ row }) => <span className="text-sm">{row.original.sucursal}</span>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <EstadoBadge estado={row.original.estado} />,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RowActions row={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculos-table/
git commit -m "feat(dashboard/vehiculos): add table columns and row actions"
```

---

## Task 7: Hook de tabla + Toolbar

**Files:**
- Create: `features/dashboard/vehiculos/hooks/useVehiculosTable.ts`
- Create: `features/dashboard/vehiculos/components/vehiculos-table/toolbar.tsx`

- [ ] **Step 1: Crear el hook `useVehiculosTable`**

```ts
// features/dashboard/vehiculos/hooks/useVehiculosTable.ts
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { EstadoVenta } from "@/generated/prisma/client"

const ESTADOS = Object.values(EstadoVenta)

export interface UseVehiculosTableReturn {
  search: string
  estado: string
  page: number
  isPending: boolean
  setSearch: (value: string) => void
  setEstado: (value: string) => void
  setPage: (value: number) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  estadoOptions: string[]
}

export function useVehiculosTable(): UseVehiculosTableReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const search = searchParams.get("q") ?? ""
  const estado = searchParams.get("estado") ?? ""
  const page = Number(searchParams.get("page") ?? "1")

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      // Whenever filters change, reset to page 1
      if (!("page" in updates)) params.set("page", "1")
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams],
  )

  const setSearch = useCallback(
    (value: string) => pushParams({ q: value }),
    [pushParams],
  )

  const setEstado = useCallback(
    (value: string) => pushParams({ estado: value }),
    [pushParams],
  )

  const setPage = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(value))
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams],
  )

  const clearFilters = useCallback(
    () => pushParams({ q: null, estado: null }),
    [pushParams],
  )

  return {
    search,
    estado,
    page,
    isPending,
    setSearch,
    setEstado,
    setPage,
    clearFilters,
    hasActiveFilters: !!(search || estado),
    estadoOptions: ESTADOS,
  }
}
```

- [ ] **Step 2: Crear Toolbar**

```tsx
// features/dashboard/vehiculos/components/vehiculos-table/toolbar.tsx
"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { SearchIcon, XIcon, PlusIcon, FilterIcon } from "lucide-react"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import type { UseVehiculosTableReturn } from "../../hooks/useVehiculosTable"

interface ToolbarProps {
  table: UseVehiculosTableReturn
}

const ALL_VALUE = "all"

export function VehiculosToolbar({ table }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync input with URL on external navigation
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== table.search) {
      inputRef.current.value = table.search
    }
  }, [table.search])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    table.setSearch(e.target.value)
  }

  function handleEstadoChange(value: string) {
    table.setEstado(value === ALL_VALUE ? "" : value)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            defaultValue={table.search}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, placa..."
            className="pl-9"
          />
        </div>
        <Select
          value={table.estado || ALL_VALUE}
          onValueChange={handleEstadoChange}
        >
          <SelectTrigger className="w-[140px]" size="default">
            <FilterIcon className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {table.estadoOptions.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {table.hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={table.clearFilters}>
            <XIcon className="size-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/vehiculos/nuevo">
          <PlusIcon className="size-4 mr-1" />
          Nuevo vehículo
        </Link>
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/vehiculos/hooks/ features/dashboard/vehiculos/components/vehiculos-table/toolbar.tsx
git commit -m "feat(dashboard/vehiculos): add table hook and toolbar with URL-based filters"
```

---

## Task 8: Componente cliente de la tabla

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculos-table/table.tsx`

- [ ] **Step 1: Crear el componente de tabla**

```tsx
// features/dashboard/vehiculos/components/vehiculos-table/table.tsx
"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { Button } from "@/features/dashboard/components/ui/button"
import { Label } from "@/features/dashboard/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/dashboard/components/ui/table"
import { vehiculosColumns } from "./columns"
import { VehiculosToolbar } from "./toolbar"
import { useVehiculosTable } from "../../hooks/useVehiculosTable"
import type { VehiculoRow, VehiculosAdminResponse } from "../../types/vehiculo"

interface VehiculosTableProps {
  data: VehiculosAdminResponse
}

export function VehiculosTable({ data }: VehiculosTableProps) {
  const tableHook = useVehiculosTable()

  const table = useReactTable<VehiculoRow>({
    data: data.vehiculos,
    columns: vehiculosColumns,
    getCoreRowModel: getCoreRowModel(),
    // Pagination is server-side — TanStack just renders
    manualPagination: true,
    pageCount: data.pages,
    state: {
      pagination: {
        pageIndex: data.page - 1,
        pageSize: 20,
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <VehiculosToolbar table={tableHook} />

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={vehiculosColumns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No se encontraron vehículos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="hidden text-sm text-muted-foreground lg:block">
          {data.total} vehículo{data.total !== 1 ? "s" : ""} en total
        </p>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label className="text-sm font-medium">Página</Label>
            <span className="text-sm tabular-nums">
              {data.page} / {data.pages}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => tableHook.setPage(1)}
              disabled={data.page <= 1}
            >
              <ChevronsLeftIcon />
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => tableHook.setPage(data.page - 1)}
              disabled={data.page <= 1}
            >
              <ChevronLeftIcon />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => tableHook.setPage(data.page + 1)}
              disabled={data.page >= data.pages}
            >
              <ChevronRightIcon />
              <span className="sr-only">Página siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => tableHook.setPage(data.pages)}
              disabled={data.page >= data.pages}
            >
              <ChevronsRightIcon />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculos-table/table.tsx
git commit -m "feat(dashboard/vehiculos): add paginated table client component"
```

---

## Task 9: Hook del formulario + componente de formulario

**Files:**
- Create: `features/dashboard/vehiculos/hooks/useVehiculoForm.ts`
- Create: `features/dashboard/vehiculos/components/vehiculo-form/form.tsx`

- [ ] **Step 1: Crear el hook `useVehiculoForm`**

```ts
// features/dashboard/vehiculos/hooks/useVehiculoForm.ts
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/client"
import { vehiculoSchema, type VehiculoInput } from "../validations/vehiculo"
import { createVehiculo, updateVehiculo } from "../actions/vehiculo.actions"
import type { VehiculoAdmin } from "../types/vehiculo"

interface UseVehiculoFormOptions {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
}

export function useVehiculoForm({ mode, vehiculo }: UseVehiculoFormOptions) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<VehiculoInput>({
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
      etiquetaComercialId: vehiculo?.etiquetaComercialId ?? undefined,
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createVehiculo(data)
          : await updateVehiculo(vehiculo!.id, data)

      if (result.ok) {
        toast.success(result.message)
        router.push("/dashboard/vehiculos")
        router.refresh()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof VehiculoInput, {
              message: messages[0],
            })
          }
        }
      }
    })
  })

  return { form, onSubmit, isPending }
}
```

- [ ] **Step 2: Crear el componente de formulario**

```tsx
// features/dashboard/vehiculos/components/vehiculo-form/form.tsx
"use client"

import { Controller } from "react-hook-form"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/client"
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

// Opciones de enums para selects
const ESTADOS   = Object.values(EstadoVenta)
const TRANSMISIONES = Object.values(Transmision)
const COMBUSTIBLES  = Object.values(Combustible)
const TRACCIONES    = Object.values(Traccion)

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
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Sin etiqueta" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">Sin etiqueta</SelectItem>
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
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/vehiculos/hooks/useVehiculoForm.ts features/dashboard/vehiculos/components/vehiculo-form/form.tsx
git commit -m "feat(dashboard/vehiculos): add vehicle form component with RHF + Zod"
```

---

## Task 10: GaleriaManager

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx`

- [ ] **Step 1: Crear el componente**

```tsx
// features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx
"use client"

import { useState, useTransition } from "react"
import { ImageIcon, PlusIcon, TrashIcon, GripVerticalIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/dashboard/components/ui/card"
import {
  addGaleriaImage,
  removeGaleriaImage,
  reorderGaleriaImages,
} from "../../actions/vehiculo.actions"
import type { GaleriaItem } from "../../types/vehiculo"

interface GaleriaManagerProps {
  vehiculoId: string
  initialImages: GaleriaItem[]
}

export function GaleriaManager({ vehiculoId, initialImages }: GaleriaManagerProps) {
  const [images, setImages] = useState<GaleriaItem[]>(initialImages)
  const [newUrl, setNewUrl] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleAddImage() {
    if (!newUrl.trim()) return

    startTransition(async () => {
      const orden = images.length
      const result = await addGaleriaImage(vehiculoId, newUrl.trim(), orden)
      if (result.ok) {
        // Re-fetch happens via cacheTag invalidation; optimistic update:
        setImages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), url: newUrl.trim(), orden },
        ])
        setNewUrl("")
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleRemove(galeriaId: string) {
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
    const reordered = [...images]
    ;[reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]]
    const withOrden = reordered.map((img, i) => ({ ...img, orden: i }))
    setImages(withOrden)

    startTransition(async () => {
      const result = await reorderGaleriaImages(
        vehiculoId,
        withOrden.map(({ id, orden }) => ({ id, orden })),
      )
      if (!result.ok) toast.error(result.message)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-5" />
          Galería
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Add URL form */}
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
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {images.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Sin imágenes. Añade una URL arriba.
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
                      <GripVerticalIcon className="size-3" />
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
                    <TrashIcon className="size-3" />
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
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculo-form/galeria-manager.tsx
git commit -m "feat(dashboard/vehiculos): add gallery manager component"
```

---

## Task 11: RSC page components (hidratados bajo Suspense)

**Files:**
- Create: `features/dashboard/vehiculos/components/vehiculos-page.tsx`
- Create: `features/dashboard/vehiculos/components/vehiculo-create-page.tsx`
- Create: `features/dashboard/vehiculos/components/vehiculo-edit-page.tsx`

- [ ] **Step 1: Crear `VehiculosPage` (lista)**

```tsx
// features/dashboard/vehiculos/components/vehiculos-page.tsx
import { getCachedVehiculosAdmin } from "../queries/vehiculo.queries"
import { VehiculosTable } from "./vehiculos-table/table"

interface VehiculosPageProps {
  page: number
  search: string
  estado: string
}

export async function VehiculosPage({ page, search, estado }: VehiculosPageProps) {
  const data = await getCachedVehiculosAdmin(page, search, estado || undefined)

  return <VehiculosTable data={data} />
}
```

- [ ] **Step 2: Crear `VehiculoCreatePage`**

```tsx
// features/dashboard/vehiculos/components/vehiculo-create-page.tsx
import { getCachedRelationOptions } from "../queries/relations.queries"
import { VehiculoForm } from "./vehiculo-form/form"

export async function VehiculoCreatePage() {
  const options = await getCachedRelationOptions()

  return <VehiculoForm mode="create" options={options} />
}
```

- [ ] **Step 3: Crear `VehiculoEditPage`**

```tsx
// features/dashboard/vehiculos/components/vehiculo-edit-page.tsx
import { notFound } from "next/navigation"
import { getCachedVehiculoAdminById } from "../queries/vehiculo.queries"
import { getCachedRelationOptions } from "../queries/relations.queries"
import { VehiculoForm } from "./vehiculo-form/form"
import { GaleriaManager } from "./vehiculo-form/galeria-manager"

interface VehiculoEditPageProps {
  id: string
}

export async function VehiculoEditPage({ id }: VehiculoEditPageProps) {
  const [vehiculo, options] = await Promise.all([
    getCachedVehiculoAdminById(id),
    getCachedRelationOptions(),
  ])

  if (!vehiculo) notFound()

  return (
    <div className="flex flex-col gap-8">
      <VehiculoForm mode="edit" vehiculo={vehiculo} options={options} />
      <GaleriaManager vehiculoId={vehiculo.id} initialImages={vehiculo.galeria} />
    </div>
  )
}
```

- [ ] **Step 4: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add features/dashboard/vehiculos/components/vehiculos-page.tsx \
        features/dashboard/vehiculos/components/vehiculo-create-page.tsx \
        features/dashboard/vehiculos/components/vehiculo-edit-page.tsx
git commit -m "feat(dashboard/vehiculos): add RSC page components"
```

---

## Task 12: App routes (páginas Next.js)

**Files:**
- Create: `app/dashboard/vehiculos/page.tsx`
- Create: `app/dashboard/vehiculos/nuevo/page.tsx`
- Create: `app/dashboard/vehiculos/[id]/editar/page.tsx`

- [ ] **Step 1: Crear la página de lista**

```tsx
// app/dashboard/vehiculos/page.tsx
import { Suspense } from "react"
import type { SearchParams } from "next/dist/server/request/search-params"
import { VehiculosPage } from "@/features/dashboard/vehiculos/components/vehiculos-page"
import { VehiculosTableSkeleton } from "@/features/dashboard/vehiculos/components/vehiculos-table/skeleton"

interface PageProps {
  searchParams: Promise<SearchParams>
}

export const metadata = { title: "Vehículos" }

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page   = Number(params.page   ?? "1")
  const search = String(params.q      ?? "")
  const estado = String(params.estado ?? "")

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Vehículos</h1>
      </div>
      <Suspense key={`${page}-${search}-${estado}`} fallback={<VehiculosTableSkeleton />}>
        <VehiculosPage page={page} search={search} estado={estado} />
      </Suspense>
    </div>
  )
}
```

> **Nota clave:** la `key` del `<Suspense>` cambia con los filtros, forzando re-render del fallback al filtrar — este es el patrón correcto para paginación/búsqueda en Next 16 + `cacheComponents`.

- [ ] **Step 2: Crear la página de nuevo vehículo**

```tsx
// app/dashboard/vehiculos/nuevo/page.tsx
import { Suspense } from "react"
import { VehiculoCreatePage } from "@/features/dashboard/vehiculos/components/vehiculo-create-page"
import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export const metadata = { title: "Nuevo vehículo" }

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-xl" />}>
      <VehiculoCreatePage />
    </Suspense>
  )
}
```

- [ ] **Step 3: Crear la página de edición**

```tsx
// app/dashboard/vehiculos/[id]/editar/page.tsx
import { Suspense } from "react"
import type { PageProps } from "next/dist/shared/lib/page-props"
import { VehiculoEditPage } from "@/features/dashboard/vehiculos/components/vehiculo-edit-page"
import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export const metadata = { title: "Editar vehículo" }

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<Skeleton className="h-[800px] w-full rounded-xl" />}>
      <VehiculoEditPage id={id} />
    </Suspense>
  )
}
```

- [ ] **Step 4: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | tail -10
```
Esperado: sin errores.

- [ ] **Step 5: Lint**

```bash
npm run lint 2>&1 | grep -E "vehiculos|dashboard/vehiculos" | head -20
```
Esperado: sin errores en los archivos creados.

- [ ] **Step 6: Smoke test manual**

1. Iniciar el servidor: `npm run dev`
2. Visitar `http://localhost:3000/auth` → hacer login como admin.
3. Verificar que el sidebar muestre **"Vehículos"** con icono de auto.
4. Navegar a `/dashboard/vehiculos` → la tabla debe cargar con los vehículos de la DB.
5. Escribir en el buscador → la URL se actualiza con `?q=...` y la tabla refiltra.
6. Hacer clic en "Nuevo vehículo" → llega al form vacío.
7. Completar el formulario con datos válidos → al guardar, redirige a la lista y aparece el nuevo vehículo.
8. Clic en acciones → "Editar" → carga el form pre-relleno con los datos.
9. Guardar edición → redirige a la lista, el cambio está reflejado.
10. Acciones → "Cambiar estado" → el badge de estado se actualiza.
11. Acciones → "Eliminar" → pide confirmación, luego desaparece de la lista.
12. En edición, añadir una URL de imagen → aparece en la galería.
13. Eliminar imagen de la galería → desaparece.

- [ ] **Step 7: Commit final**

```bash
git add app/dashboard/vehiculos/
git commit -m "feat(dashboard/vehiculos): add list, create and edit pages — closes vehicle management feature"
```

---

## Notas de arquitectura

### Por qué `cacheComponents: true` + `Suspense key`

Con `cacheComponents: true` (PPR), los componentes server con datos dinámicos deben estar dentro de `<Suspense>`. Usar `key={`${page}-${search}-${estado}`}` en el Suspense que envuelve `VehiculosPage` garantiza que Next descarta el componente cacheado y dispara un nuevo fetch cuando los filtros cambian, mostrando el skeleton como fallback durante la transición.

### Por qué URL searchParams en vez de estado local

El estado de tabla (página, búsqueda, filtros) vive en la URL, no en `useState`. Esto permite:
- Deep-linking (compartir una búsqueda filtrada)
- Back/forward del navegador
- Hydration sin flash de contenido

### Por qué `getCachedRelationOptions` en vez de múltiples queries

Las opciones de marcas/categorías/sucursales/etiquetas son estables (se revalidan con `cacheTag("admin-relation-options")` y vida `hours`). Agruparlas en una sola función cached evita 4 round-trips independientes al DB en cada carga del formulario.

### Invalidación de caché

| Tag | Invalidado cuando |
|---|---|
| `admin-vehiculos` | Create / update / delete / cambio estado |
| `admin-vehiculo-{id}` | Update / cambio estado / galería |
| `vehicle-list` | Create / update / delete (afecta catálogo público) |
| `vehicle-{slug}` | Update / delete del vehículo con ese slug |
| `home-recommendations` | Create / update / delete |
| `admin-relation-options` | NO — se invalida manualmente si se gestionan marcas/categorías |
