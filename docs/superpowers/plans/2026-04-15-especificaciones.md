# Especificaciones CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar los enums de Prisma (Transmision, Combustible, Traccion, EstadoVenta) con modelos de base de datos y construir el módulo CRUD de Especificaciones en el dashboard.

**Architecture:** Migración en dos fases: primero se agregan los nuevos modelos con FKs nullable y se siembra la data, luego se hace required y se eliminan las columnas enum. El módulo de especificaciones usa un `EspecificacionesTab` genérico para las 4 pestañas. El módulo de vehículos se actualiza para cargar opciones desde BD.

**Tech Stack:** Prisma + MariaDB, Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, React Hook Form + Zod, `"use cache"`, Server Actions, TypeScript

---

## File Map

### Crear
- `features/dashboard/especificaciones/types/especificacion.ts`
- `features/dashboard/especificaciones/validations/especificacion.ts`
- `features/dashboard/especificaciones/lib/slug.ts`
- `features/dashboard/especificaciones/queries/especificaciones.queries.ts`
- `features/dashboard/especificaciones/actions/especificaciones.actions.ts`
- `features/dashboard/especificaciones/hooks/useEspecificacionForm.ts`
- `features/dashboard/especificaciones/hooks/useEspecificacionesTable.ts`
- `features/dashboard/especificaciones/components/especificaciones-table/columns.tsx`
- `features/dashboard/especificaciones/components/especificaciones-table/row-actions.tsx`
- `features/dashboard/especificaciones/components/especificaciones-dialog/create-dialog.tsx`
- `features/dashboard/especificaciones/components/especificaciones-dialog/edit-dialog.tsx`
- `features/dashboard/especificaciones/components/especificaciones-tab.tsx`
- `features/dashboard/especificaciones/components/especificaciones-page.tsx`

### Modificar
- `prisma/schema.prisma` — dos fases de migración
- `features/dashboard/vehiculos/queries/relations.queries.ts`
- `features/dashboard/vehiculos/queries/vehiculo.queries.ts`
- `features/dashboard/vehiculos/types/vehiculo.ts`
- `features/dashboard/vehiculos/validations/vehiculo.ts`
- `features/dashboard/vehiculos/actions/vehiculo.actions.ts`
- `features/dashboard/vehiculos/hooks/useVehiculoFormWizard.ts`
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-especificaciones.tsx`
- `features/dashboard/vehiculos/components/shared/estado-badge.tsx`
- `features/dashboard/vehiculos/components/vehiculos-page.tsx`
- `app/dashboard/especificaciones/page.tsx`

---

## Task 1: Schema Fase 1 — Agregar modelos con FKs nullable

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Agregar los 4 nuevos modelos y FK nullable a Vehiculo**

Reemplazar el bloque `// ─── ENUMS ───` y el modelo `Vehiculo` en `prisma/schema.prisma`:

```prisma
// ─── ESPECIFICACIONES ────────────────────────────────────────────────────────

model Transmision {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}

model Combustible {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}

model Traccion {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}

model EstadoVenta {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}
```

En el modelo `Vehiculo`, reemplazar los 4 campos enum por FKs **nullable** (se harán required en Fase 2). Mantener `estado`, `transmision`, `combustible`, `traccion` como campos ENUM temporalmente renombrándolos, y agregar los nuevos FKs:

```prisma
model Vehiculo {
  id                  String             @id @default(uuid()) @db.Char(36)
  nombre              String
  slug                String             @unique
  codigo              String?
  placa               String             @unique
  precio              Decimal            @db.Decimal(12, 2)
  preciodescuento     Decimal?           @db.Decimal(12, 2)
  kilometraje         Int
  motor               String?
  anio                Int
  // Enum temporales — se eliminan en Fase 2
  estado_enum         EstadoVentaEnum    @default(Disponible) @map("estado_enum")
  transmision_enum    TransmisionEnum    @map("transmision_enum")
  combustible_enum    CombustibleEnum    @map("combustible_enum")
  traccion_enum       TraccionEnum       @map("traccion_enum")
  // Nuevas FKs nullable — se harán required en Fase 2
  transmisionId       String?            @db.Char(36)
  combustibleId       String?            @db.Char(36)
  traccionId          String?            @db.Char(36)
  estadoId            String?            @db.Char(36)
  sucursalId          String             @db.Char(36)
  marcaId             String             @db.Char(36)
  categoriaId         String             @db.Char(36)
  transmision         Transmision?       @relation(fields: [transmisionId], references: [id])
  combustible         Combustible?       @relation(fields: [combustibleId], references: [id])
  traccion            Traccion?          @relation(fields: [traccionId], references: [id])
  estadoVenta         EstadoVenta?       @relation(fields: [estadoId], references: [id])
  color_interior      String?
  color_exterior      String?
  descripcion         String?            @db.Text
  marca               Marca              @relation(fields: [marcaId], references: [id])
  sucursal            Sucursal           @relation(fields: [sucursalId], references: [id])
  categoria           Categoria          @relation(fields: [categoriaId], references: [id])
  etiquetaComercialId String?            @db.Char(36)
  etiquetaComercial   EtiquetaComercial? @relation(fields: [etiquetaComercialId], references: [id])
  galeria             Galeria[]
  favoritos           Favorito[]
  reviews             Review[]
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  @@index([precio])
  @@index([kilometraje])
  @@index([anio])
  @@index([sucursalId])
  @@index([marcaId])
  @@index([combustibleId])
  @@index([transmisionId])
  @@index([traccionId])
  @@index([sucursalId, precio])
  @@index([categoriaId, combustibleId])
  @@index([categoriaId])
  @@index([estadoId])
  @@index([codigo])
  @@index([estadoId, precio])
  @@index([estadoId, categoriaId])
  @@index([estadoId, marcaId])
  @@index([estadoId, combustibleId])
  @@index([estadoId, transmisionId])
  @@index([estadoId, traccionId])
  @@index([etiquetaComercialId])
}
```

Al final del archivo, renombrar los enums para evitar colisión con los nuevos modelos:

```prisma
// ─── ENUMS (temporales — se eliminan en Fase 2) ───────────────────────────────

enum EstadoVentaEnum {
  Disponible @map("Disponible")
  Reservado  @map("Reservado")
  Facturado  @map("Facturado")
}

enum TransmisionEnum {
  Automatico @map("Automático")
  Manual     @map("Manual")
}

enum CombustibleEnum {
  Gasolina  @map("Gasolina")
  Diesel    @map("Diesel")
  Hibrido   @map("Híbrido")
  Electrico @map("Eléctrico")
}

enum TraccionEnum {
  T4X4 @map("4x4")
  T4X2 @map("4x2")
  AWD
  T4WD @map("4WD")
}

enum Role {
  ADMIN
  USER
}
```

- [ ] **Step 2: Crear la migración Fase 1**

```bash
npx prisma migrate dev --name add-especificaciones-models-phase1
```

Esperado: migración aplicada sin errores. Se crean las 4 nuevas tablas y las columnas FK nullable en `Vehiculo`.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(schema): add Transmision, Combustible, Traccion, EstadoVenta models (phase 1)"
```

---

## Task 2: Seed — Poblar nuevas tablas y backfill Vehiculo

**Files:**
- Create: `prisma/seed-especificaciones.ts`

- [ ] **Step 1: Crear script de seed**

```typescript
// prisma/seed-especificaciones.ts
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function main() {
  // ─── Transmision ─────────────────────────────────────────────────────────
  const transmisiones = await Promise.all([
    prisma.transmision.upsert({
      where: { slug: "automatico" },
      update: {},
      create: { nombre: "Automático", slug: "automatico" },
    }),
    prisma.transmision.upsert({
      where: { slug: "manual" },
      update: {},
      create: { nombre: "Manual", slug: "manual" },
    }),
  ])

  // ─── Combustible ─────────────────────────────────────────────────────────
  const combustibles = await Promise.all([
    prisma.combustible.upsert({
      where: { slug: "gasolina" },
      update: {},
      create: { nombre: "Gasolina", slug: "gasolina" },
    }),
    prisma.combustible.upsert({
      where: { slug: "diesel" },
      update: {},
      create: { nombre: "Diesel", slug: "diesel" },
    }),
    prisma.combustible.upsert({
      where: { slug: "hibrido" },
      update: {},
      create: { nombre: "Híbrido", slug: "hibrido" },
    }),
    prisma.combustible.upsert({
      where: { slug: "electrico" },
      update: {},
      create: { nombre: "Eléctrico", slug: "electrico" },
    }),
  ])

  // ─── Traccion ─────────────────────────────────────────────────────────────
  const tracciones = await Promise.all([
    prisma.traccion.upsert({
      where: { slug: "4x4" },
      update: {},
      create: { nombre: "4x4", slug: "4x4" },
    }),
    prisma.traccion.upsert({
      where: { slug: "4x2" },
      update: {},
      create: { nombre: "4x2", slug: "4x2" },
    }),
    prisma.traccion.upsert({
      where: { slug: "awd" },
      update: {},
      create: { nombre: "AWD", slug: "awd" },
    }),
    prisma.traccion.upsert({
      where: { slug: "4wd" },
      update: {},
      create: { nombre: "4WD", slug: "4wd" },
    }),
  ])

  // ─── EstadoVenta ──────────────────────────────────────────────────────────
  const estados = await Promise.all([
    prisma.estadoVenta.upsert({
      where: { slug: "disponible" },
      update: {},
      create: { nombre: "Disponible", slug: "disponible" },
    }),
    prisma.estadoVenta.upsert({
      where: { slug: "reservado" },
      update: {},
      create: { nombre: "Reservado", slug: "reservado" },
    }),
    prisma.estadoVenta.upsert({
      where: { slug: "facturado" },
      update: {},
      create: { nombre: "Facturado", slug: "facturado" },
    }),
  ])

  console.log("Seed: tablas de especificaciones pobladas")

  // ─── Backfill Vehiculo ────────────────────────────────────────────────────
  // Mapas nombre → id
  const transmisionMap = Object.fromEntries(transmisiones.map((t) => [t.nombre, t.id]))
  const combustibleMap = Object.fromEntries(combustibles.map((c) => [c.nombre, c.id]))
  const traccionMap = Object.fromEntries(tracciones.map((t) => [t.nombre, t.id]))
  const estadoMap = Object.fromEntries(estados.map((e) => [e.nombre, e.id]))

  // Leer todos los vehículos con sus valores enum actuales
  const vehiculos = await prisma.vehiculo.findMany({
    select: {
      id: true,
      transmision_enum: true,
      combustible_enum: true,
      traccion_enum: true,
      estado_enum: true,
    },
  })

  console.log(`Backfill: ${vehiculos.length} vehículos`)

  // Mapas de enum value → nombre
  const TRANSMISION_ENUM_MAP: Record<string, string> = {
    Automatico: "Automático",
    Manual: "Manual",
  }
  const COMBUSTIBLE_ENUM_MAP: Record<string, string> = {
    Gasolina: "Gasolina",
    Diesel: "Diesel",
    Hibrido: "Híbrido",
    Electrico: "Eléctrico",
  }
  const TRACCION_ENUM_MAP: Record<string, string> = {
    T4X4: "4x4",
    T4X2: "4x2",
    AWD: "AWD",
    T4WD: "4WD",
  }
  const ESTADO_ENUM_MAP: Record<string, string> = {
    Disponible: "Disponible",
    Reservado: "Reservado",
    Facturado: "Facturado",
  }

  for (const v of vehiculos) {
    await prisma.vehiculo.update({
      where: { id: v.id },
      data: {
        transmisionId: transmisionMap[TRANSMISION_ENUM_MAP[v.transmision_enum]],
        combustibleId: combustibleMap[COMBUSTIBLE_ENUM_MAP[v.combustible_enum]],
        traccionId: traccionMap[TRACCION_ENUM_MAP[v.traccion_enum]],
        estadoId: estadoMap[ESTADO_ENUM_MAP[v.estado_enum]],
      },
    })
  }

  console.log("Backfill completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 2: Ejecutar el seed**

```bash
npx tsx prisma/seed-especificaciones.ts
```

Esperado: "Backfill completado" en consola sin errores.

- [ ] **Step 3: Commit**

```bash
git add prisma/seed-especificaciones.ts
git commit -m "feat(schema): seed especificaciones tables and backfill vehiculos"
```

---

## Task 3: Schema Fase 2 — FKs required, eliminar enums temporales

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Actualizar schema a estado final**

En `prisma/schema.prisma`, reemplazar el bloque `model Vehiculo` por la versión final (sin campos enum temporales, FKs required):

```prisma
model Vehiculo {
  id                  String             @id @default(uuid()) @db.Char(36)
  nombre              String
  slug                String             @unique
  codigo              String?
  placa               String             @unique
  precio              Decimal            @db.Decimal(12, 2)
  preciodescuento     Decimal?           @db.Decimal(12, 2)
  kilometraje         Int
  motor               String?
  anio                Int
  transmisionId       String             @db.Char(36)
  combustibleId       String             @db.Char(36)
  traccionId          String             @db.Char(36)
  estadoId            String             @db.Char(36)
  sucursalId          String             @db.Char(36)
  marcaId             String             @db.Char(36)
  categoriaId         String             @db.Char(36)
  color_interior      String?
  color_exterior      String?
  descripcion         String?            @db.Text
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
  transmision         Transmision        @relation(fields: [transmisionId], references: [id])
  combustible         Combustible        @relation(fields: [combustibleId], references: [id])
  traccion            Traccion           @relation(fields: [traccionId], references: [id])
  estadoVenta         EstadoVenta        @relation(fields: [estadoId], references: [id])
  marca               Marca              @relation(fields: [marcaId], references: [id])
  sucursal            Sucursal           @relation(fields: [sucursalId], references: [id])
  categoria           Categoria          @relation(fields: [categoriaId], references: [id])
  etiquetaComercialId String?            @db.Char(36)
  etiquetaComercial   EtiquetaComercial? @relation(fields: [etiquetaComercialId], references: [id])
  galeria             Galeria[]
  favoritos           Favorito[]
  reviews             Review[]

  @@index([precio])
  @@index([kilometraje])
  @@index([anio])
  @@index([sucursalId])
  @@index([marcaId])
  @@index([combustibleId])
  @@index([transmisionId])
  @@index([traccionId])
  @@index([sucursalId, precio])
  @@index([categoriaId, combustibleId])
  @@index([categoriaId])
  @@index([estadoId])
  @@index([codigo])
  @@index([estadoId, precio])
  @@index([estadoId, categoriaId])
  @@index([estadoId, marcaId])
  @@index([estadoId, combustibleId])
  @@index([estadoId, transmisionId])
  @@index([estadoId, traccionId])
  @@index([etiquetaComercialId])
}
```

Eliminar los enums temporales del final del archivo, dejando solo `Role`:

```prisma
// ─── ENUMS ───────────────────────────────────────────────────────────────────

enum Role {
  ADMIN
  USER
}
```

- [ ] **Step 2: Crear la migración Fase 2**

```bash
npx prisma migrate dev --name add-especificaciones-models-phase2
```

Esperado: migración aplicada. Se eliminan las columnas enum temporales y se hace NOT NULL en las FKs.

- [ ] **Step 3: Regenerar cliente Prisma**

```bash
npx prisma generate
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(schema): finalize especificaciones models, remove enum columns (phase 2)"
```

---

## Task 4: Tipos, validaciones y utilidad slug

**Files:**
- Create: `features/dashboard/especificaciones/types/especificacion.ts`
- Create: `features/dashboard/especificaciones/validations/especificacion.ts`
- Create: `features/dashboard/especificaciones/lib/slug.ts`

- [ ] **Step 1: Crear tipos**

```typescript
// features/dashboard/especificaciones/types/especificacion.ts

export type EspecificacionTipo = "transmision" | "combustible" | "traccion" | "estado"

export interface Especificacion {
  id: string
  nombre: string
  slug: string
  estado: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AllEspecificaciones {
  transmisiones: Especificacion[]
  combustibles: Especificacion[]
  tracciones: Especificacion[]
  estados: Especificacion[]
}

export type ActionSuccess<T = undefined> = {
  ok: true
  message: string
  data?: T
}

export type ActionError = {
  ok: false
  message: string
  fieldErrors?: Record<string, string[]>
}

export type EspecificacionActionResult<T = undefined> = ActionSuccess<T> | ActionError
```

- [ ] **Step 2: Crear validación Zod**

```typescript
// features/dashboard/especificaciones/validations/especificacion.ts
import { z } from "zod"

export const especificacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
})

export type EspecificacionInput = z.infer<typeof especificacionSchema>
```

- [ ] **Step 3: Crear utilidad de slug**

```typescript
// features/dashboard/especificaciones/lib/slug.ts
export function generateEspecificacionSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
```

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/especificaciones/
git commit -m "feat(especificaciones): add types, validations, and slug utility"
```

---

## Task 5: Queries cacheadas

**Files:**
- Create: `features/dashboard/especificaciones/queries/especificaciones.queries.ts`

- [ ] **Step 1: Crear queries**

```typescript
// features/dashboard/especificaciones/queries/especificaciones.queries.ts
import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { Especificacion, AllEspecificaciones } from "../types/especificacion"

export async function getCachedTransmisiones(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-transmisiones")
  return prisma.transmision.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedCombustibles(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-combustibles")
  return prisma.combustible.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedTracciones(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-tracciones")
  return prisma.traccion.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedEstados(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-estados")
  return prisma.estadoVenta.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedAllEspecificaciones(): Promise<AllEspecificaciones> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-all-especificaciones")

  const [transmisiones, combustibles, tracciones, estados] = await Promise.all([
    getCachedTransmisiones(),
    getCachedCombustibles(),
    getCachedTracciones(),
    getCachedEstados(),
  ])

  return { transmisiones, combustibles, tracciones, estados }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/especificaciones/queries/
git commit -m "feat(especificaciones): add cached queries"
```

---

## Task 6: Server actions

**Files:**
- Create: `features/dashboard/especificaciones/actions/especificaciones.actions.ts`

- [ ] **Step 1: Crear actions**

```typescript
// features/dashboard/especificaciones/actions/especificaciones.actions.ts
"use server"

import { revalidateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { especificacionSchema } from "../validations/especificacion"
import type { EspecificacionTipo, EspecificacionActionResult } from "../types/especificacion"
import type { EspecificacionInput } from "../validations/especificacion"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CACHE_TAGS: Record<EspecificacionTipo, string> = {
  transmision: "admin-transmisiones",
  combustible: "admin-combustibles",
  traccion: "admin-tracciones",
  estado: "admin-estados",
}

function getDelegate(tipo: EspecificacionTipo) {
  switch (tipo) {
    case "transmision": return prisma.transmision
    case "combustible": return prisma.combustible
    case "traccion":    return prisma.traccion
    case "estado":      return prisma.estadoVenta
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createEspecificacion(
  tipo: EspecificacionTipo,
  input: EspecificacionInput,
): Promise<EspecificacionActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = especificacionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const record = await (getDelegate(tipo) as any).create({
      data: { nombre: parsed.data.nombre, slug: parsed.data.slug },
      select: { id: true },
    })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: "Registro creado.", data: { id: record.id } }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { ok: false, message: "Ya existe un registro con ese nombre o slug." }
    }
    console.error(`[createEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al crear el registro." }
  }
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateEspecificacion(
  tipo: EspecificacionTipo,
  id: string,
  input: EspecificacionInput,
): Promise<EspecificacionActionResult> {
  await requireAdmin()

  const parsed = especificacionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await (getDelegate(tipo) as any).update({
      where: { id },
      data: { nombre: parsed.data.nombre, slug: parsed.data.slug },
    })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: "Registro actualizado." }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { ok: false, message: "Ya existe un registro con ese nombre o slug." }
    }
    console.error(`[updateEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al actualizar el registro." }
  }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteEspecificacion(
  tipo: EspecificacionTipo,
  id: string,
): Promise<EspecificacionActionResult> {
  await requireAdmin()

  // Verificar vehículos asociados
  const fkField: Record<EspecificacionTipo, string> = {
    transmision: "transmisionId",
    combustible: "combustibleId",
    traccion: "traccionId",
    estado: "estadoId",
  }

  const count = await prisma.vehiculo.count({ where: { [fkField[tipo]]: id } })
  if (count > 0) {
    return {
      ok: false,
      message: `No se puede eliminar: ${count} vehículo${count !== 1 ? "s" : ""} usa${count === 1 ? "" : "n"} este registro.`,
    }
  }

  try {
    await (getDelegate(tipo) as any).delete({ where: { id } })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: "Registro eliminado." }
  } catch (error) {
    console.error(`[deleteEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al eliminar el registro." }
  }
}

// ─── Toggle estado ────────────────────────────────────────────────────────────

export async function toggleEstadoEspecificacion(
  tipo: EspecificacionTipo,
  id: string,
  estado: boolean,
): Promise<EspecificacionActionResult> {
  await requireAdmin()

  try {
    await (getDelegate(tipo) as any).update({ where: { id }, data: { estado } })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: estado ? "Registro activado." : "Registro desactivado." }
  } catch (error) {
    console.error(`[toggleEstadoEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al cambiar el estado." }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/especificaciones/actions/
git commit -m "feat(especificaciones): add server actions (create, update, delete, toggle)"
```

---

## Task 7: Custom hooks

**Files:**
- Create: `features/dashboard/especificaciones/hooks/useEspecificacionForm.ts`
- Create: `features/dashboard/especificaciones/hooks/useEspecificacionesTable.ts`

- [ ] **Step 1: Crear useEspecificacionForm**

```typescript
// features/dashboard/especificaciones/hooks/useEspecificacionForm.ts
"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { especificacionSchema, type EspecificacionInput } from "../validations/especificacion"
import { createEspecificacion, updateEspecificacion } from "../actions/especificaciones.actions"
import { generateEspecificacionSlug } from "../lib/slug"
import type { EspecificacionTipo, Especificacion } from "../types/especificacion"

interface UseEspecificacionFormOptions {
  tipo: EspecificacionTipo
  defaultValues?: Especificacion
  onSuccess?: () => void
}

export function useEspecificacionForm({
  tipo,
  defaultValues,
  onSuccess,
}: UseEspecificacionFormOptions) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!defaultValues

  const form = useForm<EspecificacionInput>({
    resolver: zodResolver(especificacionSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      slug: defaultValues?.slug ?? "",
    },
  })

  function handleNombreChange(value: string) {
    form.setValue("nombre", value, { shouldValidate: true })
    if (!isEditing) {
      form.setValue("slug", generateEspecificacionSlug(value), { shouldValidate: true })
    }
  }

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = isEditing
        ? await updateEspecificacion(tipo, defaultValues.id, data)
        : await createEspecificacion(tipo, data)

      if (result.ok) {
        toast.success(result.message)
        form.reset({ nombre: "", slug: "" })
        onSuccess?.()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof EspecificacionInput, { message: messages[0] })
          }
        }
      }
    })
  })

  return { form, onSubmit, isPending, handleNombreChange, isEditing }
}
```

- [ ] **Step 2: Crear useEspecificacionesTable**

```typescript
// features/dashboard/especificaciones/hooks/useEspecificacionesTable.ts
"use client"

import { useState, useCallback } from "react"
import type { Especificacion } from "../types/especificacion"

export function useEspecificacionesTable(data: Especificacion[]) {
  const [search, setSearch] = useState("")

  const filtered = data.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()),
  )

  const clearSearch = useCallback(() => setSearch(""), [])

  return { search, setSearch, filtered, clearSearch, total: data.length }
}
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/especificaciones/hooks/
git commit -m "feat(especificaciones): add useEspecificacionForm and useEspecificacionesTable hooks"
```

---

## Task 8: Componentes de tabla

**Files:**
- Create: `features/dashboard/especificaciones/components/especificaciones-table/columns.tsx`
- Create: `features/dashboard/especificaciones/components/especificaciones-table/row-actions.tsx`

- [ ] **Step 1: Crear columns**

```tsx
// features/dashboard/especificaciones/components/especificaciones-table/columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/features/dashboard/components/ui/badge"
import type { Especificacion, EspecificacionTipo } from "../../types/especificacion"
import { RowActions } from "./row-actions"

export function getEspecificacionesColumns(
  tipo: EspecificacionTipo,
  onEdit: (row: Especificacion) => void,
): ColumnDef<Especificacion>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.estado ? "default" : "secondary"}>
          {row.original.estado ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <RowActions row={row.original} tipo={tipo} onEdit={onEdit} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
```

- [ ] **Step 2: Crear row-actions**

```tsx
// features/dashboard/especificaciones/components/especificaciones-table/row-actions.tsx
"use client"

import { useState, useTransition } from "react"
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/features/dashboard/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/dashboard/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/dashboard/components/ui/alert-dialog"
import { deleteEspecificacion, toggleEstadoEspecificacion } from "../../actions/especificaciones.actions"
import type { Especificacion, EspecificacionTipo } from "../../types/especificacion"

interface RowActionsProps {
  row: Especificacion
  tipo: EspecificacionTipo
  onEdit: (row: Especificacion) => void
}

export function RowActions({ row, tipo, onEdit }: RowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleEstadoEspecificacion(tipo, row.id, !row.estado)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  function handleConfirmDelete() {
    startTransition(async () => {
      const result = await deleteEspecificacion(tipo, row.id)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
      setDeleteOpen(false)
    })
  }

  return (
    <>
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
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {row.nombre}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(row)}>
            <PencilIcon className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggle}>
            {row.estado ? (
              <ToggleRightIcon className="mr-2 size-4" />
            ) : (
              <ToggleLeftIcon className="mr-2 size-4" />
            )}
            {row.estado ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <TrashIcon className="mr-2 size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará{" "}
              <span className="font-medium text-foreground">{row.nombre}</span>{" "}
              de forma permanente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/especificaciones/components/especificaciones-table/
git commit -m "feat(especificaciones): add table columns and row-actions components"
```

---

## Task 9: Dialogs de creación y edición

**Files:**
- Create: `features/dashboard/especificaciones/components/especificaciones-dialog/create-dialog.tsx`
- Create: `features/dashboard/especificaciones/components/especificaciones-dialog/edit-dialog.tsx`

- [ ] **Step 1: Crear create-dialog**

```tsx
// features/dashboard/especificaciones/components/especificaciones-dialog/create-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/dashboard/components/ui/dialog"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { useEspecificacionForm } from "../../hooks/useEspecificacionForm"
import type { EspecificacionTipo } from "../../types/especificacion"

interface CreateDialogProps {
  tipo: EspecificacionTipo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDialog({ tipo, open, onOpenChange }: CreateDialogProps) {
  const { form, onSubmit, isPending, handleNombreChange } = useEspecificacionForm({
    tipo,
    onSuccess: () => onOpenChange(false),
  })

  const { register, formState: { errors }, watch } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-nombre">Nombre</Label>
            <Input
              id="create-nombre"
              placeholder="Ej. Automático"
              {...register("nombre")}
              onChange={(e) => handleNombreChange(e.target.value)}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-slug">Slug</Label>
            <Input
              id="create-slug"
              placeholder="Ej. automatico"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Crear edit-dialog**

```tsx
// features/dashboard/especificaciones/components/especificaciones-dialog/edit-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/dashboard/components/ui/dialog"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { useEspecificacionForm } from "../../hooks/useEspecificacionForm"
import type { Especificacion, EspecificacionTipo } from "../../types/especificacion"

interface EditDialogProps {
  tipo: EspecificacionTipo
  row: Especificacion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDialog({ tipo, row, open, onOpenChange }: EditDialogProps) {
  const { form, onSubmit, isPending, handleNombreChange } = useEspecificacionForm({
    tipo,
    defaultValues: row ?? undefined,
    onSuccess: () => onOpenChange(false),
  })

  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nombre">Nombre</Label>
            <Input
              id="edit-nombre"
              {...register("nombre")}
              onChange={(e) => handleNombreChange(e.target.value)}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input id="edit-slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/especificaciones/components/especificaciones-dialog/
git commit -m "feat(especificaciones): add create and edit dialogs"
```

---

## Task 10: EspecificacionesTab y EspecificacionesPage

**Files:**
- Create: `features/dashboard/especificaciones/components/especificaciones-tab.tsx`
- Create: `features/dashboard/especificaciones/components/especificaciones-page.tsx`

- [ ] **Step 1: Crear EspecificacionesTab**

```tsx
// features/dashboard/especificaciones/components/especificaciones-tab.tsx
"use client"

import { useState, useMemo } from "react"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/dashboard/components/ui/table"
import { CreateDialog } from "./especificaciones-dialog/create-dialog"
import { EditDialog } from "./especificaciones-dialog/edit-dialog"
import { getEspecificacionesColumns } from "./especificaciones-table/columns"
import { useEspecificacionesTable } from "../hooks/useEspecificacionesTable"
import type { Especificacion, EspecificacionTipo } from "../types/especificacion"

interface EspecificacionesTabProps {
  tipo: EspecificacionTipo
  titulo: string
  data: Especificacion[]
}

export function EspecificacionesTab({ tipo, titulo, data }: EspecificacionesTabProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Especificacion | null>(null)

  const { search, setSearch, filtered, clearSearch } = useEspecificacionesTable(data)

  function handleEdit(row: Especificacion) {
    setSelectedRow(row)
    setEditOpen(true)
  }

  const columns = useMemo(() => getEspecificacionesColumns(tipo, handleEdit), [tipo])

  const table = useReactTable<Especificacion>({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar en ${titulo.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-8"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="mr-1.5 size-4" />
          Nuevo
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70"
                  >
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
                <TableRow
                  key={row.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium">
                      {search ? "Sin resultados para la búsqueda" : `No hay registros en ${titulo.toLowerCase()}`}
                    </p>
                    {!search && (
                      <p className="text-xs">Crea el primer registro con el botón "Nuevo"</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <CreateDialog tipo={tipo} open={createOpen} onOpenChange={setCreateOpen} />
      <EditDialog
        tipo={tipo}
        row={selectedRow}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setSelectedRow(null)
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Crear EspecificacionesPage**

```tsx
// features/dashboard/especificaciones/components/especificaciones-page.tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/dashboard/components/ui/tabs"
import { EspecificacionesTab } from "./especificaciones-tab"
import type { AllEspecificaciones } from "../types/especificacion"

interface EspecificacionesPageProps {
  data: AllEspecificaciones
}

export function EspecificacionesPage({ data }: EspecificacionesPageProps) {
  return (
    <Tabs defaultValue="transmision" className="flex flex-col gap-4">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="transmision">Transmisión</TabsTrigger>
        <TabsTrigger value="combustible">Combustible</TabsTrigger>
        <TabsTrigger value="traccion">Tracción</TabsTrigger>
        <TabsTrigger value="estado">Estado de venta</TabsTrigger>
      </TabsList>

      <TabsContent value="transmision">
        <EspecificacionesTab
          tipo="transmision"
          titulo="Transmisión"
          data={data.transmisiones}
        />
      </TabsContent>
      <TabsContent value="combustible">
        <EspecificacionesTab
          tipo="combustible"
          titulo="Combustible"
          data={data.combustibles}
        />
      </TabsContent>
      <TabsContent value="traccion">
        <EspecificacionesTab
          tipo="traccion"
          titulo="Tracción"
          data={data.tracciones}
        />
      </TabsContent>
      <TabsContent value="estado">
        <EspecificacionesTab
          tipo="estado"
          titulo="Estado de venta"
          data={data.estados}
        />
      </TabsContent>
    </Tabs>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/especificaciones/components/
git commit -m "feat(especificaciones): add EspecificacionesTab and EspecificacionesPage components"
```

---

## Task 11: Página de ruta App Router

**Files:**
- Modify: `app/dashboard/especificaciones/page.tsx`

- [ ] **Step 1: Implementar la página**

```tsx
// app/dashboard/especificaciones/page.tsx
import { EspecificacionesPage } from "@/features/dashboard/especificaciones/components/especificaciones-page"
import { getCachedAllEspecificaciones } from "@/features/dashboard/especificaciones/queries/especificaciones.queries"

export const metadata = { title: "Especificaciones" }

export default async function Page() {
  const data = await getCachedAllEspecificaciones()

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Especificaciones</h1>
      </div>
      <EspecificacionesPage data={data} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/especificaciones/page.tsx
git commit -m "feat(especificaciones): add app route page"
```

---

## Task 12: Actualizar módulo vehículos — relations queries, tipos y validación

**Files:**
- Modify: `features/dashboard/vehiculos/queries/relations.queries.ts`
- Modify: `features/dashboard/vehiculos/types/vehiculo.ts`
- Modify: `features/dashboard/vehiculos/validations/vehiculo.ts`

- [ ] **Step 1: Actualizar relations.queries.ts**

Agregar las 4 nuevas queries y actualizar `getCachedRelationOptions` en `features/dashboard/vehiculos/queries/relations.queries.ts`:

```typescript
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

export async function getCachedTransmisionesOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-transmisiones")
  return prisma.transmision.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedCombustiblesOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-combustibles")
  return prisma.combustible.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedTraccionesOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-tracciones")
  return prisma.traccion.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedEstadosOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-estados")
  return prisma.estadoVenta.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedRelationOptions(): Promise<VehiculoRelationOptions> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-relation-options")

  const [marcas, categorias, sucursales, etiquetas, transmisiones, combustibles, tracciones, estados] =
    await Promise.all([
      getCachedMarcasOptions(),
      getCachedCategoriasOptions(),
      getCachedSucursalesOptions(),
      getCachedEtiquetasOptions(),
      getCachedTransmisionesOptions(),
      getCachedCombustiblesOptions(),
      getCachedTraccionesOptions(),
      getCachedEstadosOptions(),
    ])

  return { marcas, categorias, sucursales, etiquetas, transmisiones, combustibles, tracciones, estados }
}
```

- [ ] **Step 2: Actualizar types/vehiculo.ts**

```typescript
// features/dashboard/vehiculos/types/vehiculo.ts

export interface SelectOption {
  id: string
  nombre: string
}

export interface VehiculoRelationOptions {
  marcas: SelectOption[]
  categorias: SelectOption[]
  sucursales: SelectOption[]
  etiquetas: SelectOption[]
  transmisiones: SelectOption[]
  combustibles: SelectOption[]
  tracciones: SelectOption[]
  estados: SelectOption[]
}

export interface EspecificacionInfo {
  id: string
  nombre: string
  slug: string
}

export interface VehiculoRow {
  id: string
  nombre: string
  slug: string
  placa: string
  codigo: string | null
  precio: number
  kilometraje: number
  anio: number
  estadoVenta: EspecificacionInfo
  transmision: EspecificacionInfo
  combustible: EspecificacionInfo
  marca: string
  categoria: string
  sucursal: string
  createdAt: Date
}

export interface VehiculoAdmin {
  id: string
  nombre: string
  slug: string
  codigo: string | null
  placa: string
  precio: number
  preciodescuento: number | null
  kilometraje: number
  motor: string | null
  anio: number
  estadoId: string
  transmisionId: string
  combustibleId: string
  traccionId: string
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

export interface VehiculosAdminResponse {
  vehiculos: VehiculoRow[]
  total: number
  pages: number
  page: number
  estadoOptions: SelectOption[]
}

export type ActionSuccess<T = undefined> = {
  ok: true
  message: string
  data?: T
}

export type ActionError = {
  ok: false
  message: string
  fieldErrors?: Record<string, string[]>
}

export type ActionResult<T = undefined> = ActionSuccess<T> | ActionError
```

- [ ] **Step 3: Actualizar validations/vehiculo.ts**

```typescript
// features/dashboard/vehiculos/validations/vehiculo.ts
import * as z from "zod"

export const vehiculoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  codigo: z.string().optional().default("").transform(v => v?.trim() || null),
  placa: z.string().min(2, "La placa es requerida").max(20, "Placa muy larga"),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0"),
  preciodescuento: z.coerce.number().positive("El precio con descuento debe ser mayor a 0").optional().nullable(),
  kilometraje: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo"),
  motor: z.string().optional().default("").transform(v => v?.trim() || null),
  anio: z.coerce
    .number()
    .int()
    .min(1900, "Año inválido")
    .max(new Date().getFullYear() + 2, "Año inválido"),
  estadoId: z.string().uuid("Selecciona un estado"),
  transmisionId: z.string().uuid("Selecciona una transmisión"),
  combustibleId: z.string().uuid("Selecciona un combustible"),
  traccionId: z.string().uuid("Selecciona una tracción"),
  color_interior: z.string().optional().default("").transform(v => v?.trim() || null),
  color_exterior: z.string().optional().default("").transform(v => v?.trim() || null),
  descripcion: z.string().optional().default("").transform(v => v?.trim() || null),
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

- [ ] **Step 4: Commit**

```bash
git add features/dashboard/vehiculos/queries/relations.queries.ts \
        features/dashboard/vehiculos/types/vehiculo.ts \
        features/dashboard/vehiculos/validations/vehiculo.ts
git commit -m "feat(vehiculos): update relation queries, types, and validation for FK-based especificaciones"
```

---

## Task 13: Actualizar módulo vehículos — queries, actions, form wizard, step, estado-badge, vehiculos-page

**Files:**
- Modify: `features/dashboard/vehiculos/queries/vehiculo.queries.ts`
- Modify: `features/dashboard/vehiculos/actions/vehiculo.actions.ts`
- Modify: `features/dashboard/vehiculos/hooks/useVehiculoFormWizard.ts`
- Modify: `features/dashboard/vehiculos/components/vehiculo-form/steps/step-especificaciones.tsx`
- Modify: `features/dashboard/vehiculos/components/shared/estado-badge.tsx`
- Modify: `features/dashboard/vehiculos/components/vehiculos-page.tsx`

- [ ] **Step 1: Actualizar vehiculo.queries.ts**

Reemplazar completamente `features/dashboard/vehiculos/queries/vehiculo.queries.ts`:

```typescript
import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { VehiculoRow, VehiculosAdminResponse, VehiculoAdmin, SelectOption } from "../types/vehiculo"
import { getCachedEstadosOptions } from "./relations.queries"

const PAGE_SIZE = 20

export async function getCachedVehiculosAdmin(
  page = 1,
  search = "",
  estadoSlug?: string,
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
    ...(estadoSlug && {
      estadoVenta: { slug: estadoSlug },
    }),
  }

  const clampedPage = Math.max(1, page)

  const [rawVehiculos, total, estadoOptions] = await Promise.all([
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
        estadoVenta: { select: { id: true, nombre: true, slug: true } },
        transmision: { select: { id: true, nombre: true, slug: true } },
        combustible: { select: { id: true, nombre: true, slug: true } },
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
    getCachedEstadosOptions(),
  ])

  const vehiculos: VehiculoRow[] = rawVehiculos.map((v) => ({
    id: v.id,
    nombre: v.nombre,
    slug: v.slug,
    placa: v.placa,
    codigo: v.codigo,
    precio: parseFloat(v.precio.toString()),
    kilometraje: v.kilometraje,
    anio: v.anio,
    estadoVenta: v.estadoVenta,
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
    estadoOptions,
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
      preciodescuento: true,
      kilometraje: true,
      motor: true,
      estadoId: true,
      transmisionId: true,
      combustibleId: true,
      traccionId: true,
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
    precio: parseFloat(v.precio.toString()),
    preciodescuento: v.preciodescuento != null ? parseFloat(v.preciodescuento.toString()) : null,
  }
}
```

- [ ] **Step 2: Actualizar vehiculo.actions.ts**

Reemplazar completamente `features/dashboard/vehiculos/actions/vehiculo.actions.ts` (solo la sección de create/update, el resto permanece):

```typescript
"use server"

import { revalidateTag, revalidatePath, updateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { vehiculoSchema, galeriaImageSchema } from "../validations/vehiculo"
import { generateVehiculoSlug } from "../lib/slug"
import type { VehiculoInput } from "../validations/vehiculo"
import type { ActionResult } from "../types/vehiculo"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function revalidateVehiculoCaches(slug?: string, id?: string): void {
  updateTag("admin-vehiculos")
  revalidateTag("vehicle-list", "hours")
  revalidateTag("home-recommendations", "hours")
  if (slug) revalidateTag(`vehicle-${slug}`, "days")
  if (id) updateTag(`admin-vehiculo-${id}`)
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

  const marca = await prisma.marca.findUnique({
    where: { id: data.marcaId },
    select: { nombre: true },
  })
  if (!marca) return { ok: false, message: "La marca seleccionada no existe." }

  let slug = generateVehiculoSlug(data.nombre, marca.nombre, data.anio, data.placa)
  const existing = await prisma.vehiculo.findUnique({ where: { slug }, select: { id: true } })
  if (existing) slug = `${slug}-${Date.now()}`

  let vehiculo: { id: string; slug: string }
  try {
    vehiculo = await prisma.vehiculo.create({
      data: {
        nombre: data.nombre,
        slug,
        codigo: data.codigo ?? null,
        placa: data.placa,
        precio: data.precio,
        preciodescuento: data.preciodescuento ?? null,
        kilometraje: data.kilometraje,
        motor: data.motor ?? null,
        anio: data.anio,
        estadoId: data.estadoId,
        transmisionId: data.transmisionId,
        combustibleId: data.combustibleId,
        traccionId: data.traccionId,
        color_interior: data.color_interior ?? null,
        color_exterior: data.color_exterior ?? null,
        descripcion: data.descripcion ?? null,
        marcaId: data.marcaId,
        sucursalId: data.sucursalId,
        categoriaId: data.categoriaId,
        etiquetaComercialId: data.etiquetaComercialId ?? null,
      },
      select: { id: true, slug: true },
    })
  } catch (error) {
    console.error("[createVehiculo]", error)
    return { ok: false, message: "Error al crear el vehículo. Verifica que la placa no esté duplicada." }
  }

  revalidateVehiculoCaches(vehiculo.slug, vehiculo.id)
  return { ok: true, message: "Vehículo creado exitosamente.", data: { id: vehiculo.id, slug: vehiculo.slug } }
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

  const current = await prisma.vehiculo.findUnique({ where: { id }, select: { slug: true } })
  if (!current) return { ok: false, message: "Vehículo no encontrado." }

  try {
    await prisma.vehiculo.update({
      where: { id },
      data: {
        nombre: data.nombre,
        codigo: data.codigo ?? null,
        placa: data.placa,
        precio: data.precio,
        preciodescuento: data.preciodescuento ?? null,
        kilometraje: data.kilometraje,
        motor: data.motor ?? null,
        anio: data.anio,
        estadoId: data.estadoId,
        transmisionId: data.transmisionId,
        combustibleId: data.combustibleId,
        traccionId: data.traccionId,
        color_interior: data.color_interior ?? null,
        color_exterior: data.color_exterior ?? null,
        descripcion: data.descripcion ?? null,
        marcaId: data.marcaId,
        sucursalId: data.sucursalId,
        categoriaId: data.categoriaId,
        etiquetaComercialId: data.etiquetaComercialId ?? null,
      },
    })
  } catch (error) {
    console.error("[updateVehiculo]", error)
    return { ok: false, message: "Error al actualizar el vehículo. Verifica que la placa no esté duplicada." }
  }

  revalidateVehiculoCaches(current.slug, id)
  revalidatePath(`/catalogo/${current.slug}`)
  return { ok: true, message: "Vehículo actualizado exitosamente." }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteVehiculo(id: string): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({ where: { id }, select: { slug: true } })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  try {
    await prisma.vehiculo.delete({ where: { id } })
  } catch (error) {
    console.error("[deleteVehiculo]", error)
    return { ok: false, message: "Error al eliminar el vehículo." }
  }

  revalidateVehiculoCaches(vehiculo.slug, id)
  revalidatePath(`/catalogo/${vehiculo.slug}`)
  return { ok: true, message: "Vehículo eliminado." }
}

// ─── Galería ─────────────────────────────────────────────────────────────────

export async function addGaleriaImage(
  vehiculoId: string,
  url: string,
  orden: number,
): Promise<ActionResult<{ id: string; url: string; orden: number }>> {
  await requireAdmin()

  const parsed = galeriaImageSchema.safeParse({ url, orden })
  if (!parsed.success) {
    return {
      ok: false,
      message: "URL de imagen inválida.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  let created: { id: string; url: string; orden: number }
  try {
    created = await prisma.galeria.create({
      data: { vehiculoId, url: parsed.data.url, orden: parsed.data.orden },
      select: { id: true, url: true, orden: true },
    })
  } catch (error) {
    console.error("[addGaleriaImage]", error)
    return { ok: false, message: "Error al añadir la imagen. Verifica que el vehículo existe." }
  }

  updateTag(`admin-vehiculo-${vehiculoId}`)
  return { ok: true, message: "Imagen añadida.", data: created }
}

export async function removeGaleriaImage(
  galeriaId: string,
  vehiculoId: string,
): Promise<ActionResult> {
  await requireAdmin()

  try {
    await prisma.galeria.delete({ where: { id: galeriaId, vehiculoId } })
  } catch (error) {
    console.error("[removeGaleriaImage]", error)
    return { ok: false, message: "Imagen no encontrada o no pertenece a este vehículo." }
  }

  updateTag(`admin-vehiculo-${vehiculoId}`)
  return { ok: true, message: "Imagen eliminada." }
}

export async function reorderGaleriaImages(
  vehiculoId: string,
  images: { id: string; orden: number }[],
): Promise<ActionResult> {
  await requireAdmin()

  try {
    await prisma.$transaction(
      images.map((img) =>
        prisma.galeria.update({
          where: { id: img.id, vehiculoId },
          data: { orden: img.orden },
        }),
      ),
    )
  } catch (error) {
    console.error("[reorderGaleriaImages]", error)
    return { ok: false, message: "Error al reordenar las imágenes." }
  }

  updateTag(`admin-vehiculo-${vehiculoId}`)
  return { ok: true, message: "Galería reordenada." }
}
```

- [ ] **Step 3: Actualizar useVehiculoFormWizard.ts**

Reemplazar el contenido de `features/dashboard/vehiculos/hooks/useVehiculoFormWizard.ts`:

```typescript
"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { vehiculoSchema, type VehiculoInput } from "../validations/vehiculo"
import { createVehiculo, updateVehiculo } from "../actions/vehiculo.actions"
import type { VehiculoAdmin, ActionResult } from "../types/vehiculo"

const TOTAL_STEPS = 5

const STEP_FIELDS: Record<number, (keyof VehiculoInput)[]> = {
  0: ["nombre", "placa", "anio", "kilometraje"],
  1: ["transmisionId", "combustibleId", "traccionId"],
  2: ["precio"],
  3: ["marcaId", "categoriaId", "sucursalId"],
  4: [],
}

interface UseVehiculoFormWizardOptions {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
  initialStep?: number
}

interface UseVehiculoFormWizardReturn {
  form: UseFormReturn<VehiculoInput, unknown, VehiculoInput>
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  isPending: boolean
  currentStep: number
  goNext: () => Promise<void>
  goPrev: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function useVehiculoFormWizard({
  mode,
  vehiculo,
  initialStep = 0,
}: UseVehiculoFormWizardOptions): UseVehiculoFormWizardReturn {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(initialStep)
  const isValidating = useRef(false)

  const form = useForm<VehiculoInput, unknown, VehiculoInput>({
    resolver: zodResolver(vehiculoSchema) as Resolver<VehiculoInput, unknown, VehiculoInput>,
    defaultValues: {
      nombre: vehiculo?.nombre ?? "",
      codigo: vehiculo?.codigo ?? "",
      placa: vehiculo?.placa ?? "",
      precio: vehiculo?.precio ?? 0,
      preciodescuento: vehiculo?.preciodescuento ?? null,
      kilometraje: vehiculo?.kilometraje ?? 0,
      motor: vehiculo?.motor ?? "",
      anio: vehiculo?.anio ?? new Date().getFullYear(),
      estadoId: vehiculo?.estadoId ?? "",
      transmisionId: vehiculo?.transmisionId ?? "",
      combustibleId: vehiculo?.combustibleId ?? "",
      traccionId: vehiculo?.traccionId ?? "",
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
    if (isValidating.current) return
    isValidating.current = true
    try {
      const fields = STEP_FIELDS[currentStep]
      const valid = fields.length === 0 || (await form.trigger(fields))
      if (valid) setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    } finally {
      isValidating.current = false
    }
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      let result: ActionResult<{ id: string; slug: string } | undefined>
      if (mode === "create") {
        result = await createVehiculo(data)
      } else {
        if (!vehiculo) {
          toast.error("No se puede guardar: vehículo no encontrado.")
          return
        }
        result = await updateVehiculo(vehiculo.id, data)
      }

      if (result.ok) {
        toast.success(result.message)
        if (mode === "create" && result.data?.id) {
          router.push(`/dashboard/vehiculos/${result.data.id}/editar?step=4`)
        } else {
          router.push("/dashboard/vehiculos")
        }
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

- [ ] **Step 4: Actualizar step-especificaciones.tsx**

Reemplazar completamente `features/dashboard/vehiculos/components/vehiculo-form/steps/step-especificaciones.tsx`:

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
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Transmisión *</Label>
        <Controller
          name="transmisionId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Combustible *</Label>
        <Controller
          name="combustibleId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tracción *</Label>
        <Controller
          name="traccionId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Estado</Label>
        <Controller
          name="estadoId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Actualizar estado-badge.tsx para usar string en lugar de enum**

Reemplazar `features/dashboard/vehiculos/components/shared/estado-badge.tsx`:

```tsx
import { cn } from "@/features/dashboard/lib/utils"

type EstadoConfig = { label: string; dotClass: string; wrapperClass: string }

const ESTADO_CONFIG: Record<string, EstadoConfig> = {
  Disponible: {
    label: "Disponible",
    dotClass: "bg-primary",
    wrapperClass: "bg-primary/20 text-primary-foreground border border-primary/40",
  },
  Reservado: {
    label: "Reservado",
    dotClass: "bg-amber-400",
    wrapperClass:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20",
  },
  Facturado: {
    label: "Facturado",
    dotClass: "bg-muted-foreground/40",
    wrapperClass: "bg-muted text-muted-foreground border border-border",
  },
}

interface EstadoBadgeProps {
  estado: string
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    dotClass: "bg-muted-foreground/40",
    wrapperClass: "bg-muted text-muted-foreground border border-border",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.wrapperClass,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", config.dotClass)} aria-hidden="true" />
      {config.label}
    </span>
  )
}
```

- [ ] **Step 6: Actualizar vehiculos-page.tsx para pasar estadoOptions y transmisiones/combustibles/tracciones/estados al form**

Revisar qué componentes necesitan los options y asegurarse que se pasen correctamente. La columna `estado` en la tabla ahora usa `row.original.estadoVenta.nombre`:

En `features/dashboard/vehiculos/components/vehiculos-table/columns.tsx`, actualizar la celda de estado:

```tsx
{
  accessorKey: "estadoVenta",
  header: "Estado",
  cell: ({ row }) => <EstadoBadge estado={row.original.estadoVenta.nombre} />,
},
```

En `features/dashboard/vehiculos/hooks/useVehiculosTable.ts`, reemplazar el uso de `Object.values(EstadoVenta)`:

```typescript
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useRef, useTransition } from "react"
import type { SelectOption } from "../types/vehiculo"

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
  estadoOptions: SelectOption[]
}

export function useVehiculosTable(estadoOptions: SelectOption[]): UseVehiculosTableReturn {
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
      if (!("page" in updates)) params.set("page", "1")
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams],
  )

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setSearch = useCallback(
    (value: string) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
      searchTimerRef.current = setTimeout(() => {
        pushParams({ q: value })
      }, 350)
    },
    [pushParams],
  )

  const setEstado = useCallback(
    (value: string) => pushParams({ estado: value }),
    [pushParams],
  )

  const setPage = useCallback(
    (value: number) => pushParams({ page: String(value) }),
    [pushParams],
  )

  const clearFilters = useCallback(() => pushParams({ q: null, estado: null }), [pushParams])

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
    estadoOptions,
  }
}
```

En `features/dashboard/vehiculos/components/vehiculos-table/table.tsx`, actualizar para pasar `estadoOptions`:

```tsx
export function VehiculosTable({ data }: VehiculosTableProps) {
  const tableHook = useVehiculosTable(data.estadoOptions)
  // ... resto igual
}
```

En `features/dashboard/vehiculos/components/vehiculos-table/toolbar.tsx`, actualizar el map de `estadoOptions` en la línea ~69 para usar `SelectOption` en lugar de `string`:

```tsx
// Cambiar:
{table.estadoOptions.map((e) => (
  <SelectItem key={e} value={e}>{e}</SelectItem>
))}

// Por:
{table.estadoOptions.map((e) => (
  <SelectItem key={e.slug} value={e.slug}>{e.nombre}</SelectItem>
))}
```

- [ ] **Step 7: Actualizar form.tsx para pasar options a StepEspecificaciones**

En `features/dashboard/vehiculos/components/vehiculo-form/form.tsx`, localizar la línea 98-100 y reemplazar:

```tsx
// Cambiar:
{currentStep === 1 && (
  <StepEspecificaciones control={control} errors={errors} />
)}

// Por:
{currentStep === 1 && (
  <StepEspecificaciones
    control={control}
    errors={errors}
    transmisiones={options.transmisiones}
    combustibles={options.combustibles}
    tracciones={options.tracciones}
    estados={options.estados}
  />
)}
```

- [ ] **Step 8: Commit**

```bash
git add features/dashboard/vehiculos/
git commit -m "feat(vehiculos): migrate from enums to FK-based especificaciones across queries, actions, hooks, and components"
```

---

## Verificación final

- [ ] Ejecutar `npm run build` para verificar que no hay errores de TypeScript ni de compilación.
- [ ] Navegar a `/dashboard/especificaciones` y verificar que las 4 pestañas muestran los registros correctamente.
- [ ] Crear, editar y eliminar un registro en cada pestaña.
- [ ] Navegar a `/dashboard/vehiculos/nuevo` y verificar que los selects de transmisión, combustible, tracción y estado cargan desde la BD.
- [ ] Crear un vehículo nuevo para confirmar que se guarda correctamente con los IDs.
