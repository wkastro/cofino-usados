# Sistemas de Recomendación Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar dos sistemas de recomendación de vehículos: 6 destacados en el home y 3 similares en la página de detalle de cada vehículo.

**Architecture:** Nuevo feature `features/recommendations/` con acciones Prisma crudas + wrappers cacheados (`use cache` + `cacheTag`), y dos server components que reutilizan `VehicleCard`. Home usa etiqueta comercial + diversidad por marca + fallback a recientes. Detalle usa cascada de 4 niveles: categoría+marca+precio → categoría+marca → categoría → global. **No** se filtra por `estado` en ninguna query de recomendaciones.

**Tech Stack:** Next.js 16 (App Router, Cache Components), React 19, Prisma 7 + MariaDB, TypeScript, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-04-07-sistemas-recomendacion-design.md`

**Nota sobre verificación:** Este proyecto no tiene framework de testing configurado (no hay `jest`, `vitest`, ni scripts `test` en `package.json`). La verificación en cada tarea se hace con `npm run lint`, `npm run build` y una verificación visual manual en `npm run dev`. No se agregan tests unitarios — eso queda fuera de scope.

---

## File Structure

**Archivos a crear:**

- `features/recommendations/actions/recommendations.ts` — queries Prisma (`getHomeRecommendations`, `getSimilarVehicles`).
- `features/recommendations/actions/recommendations.cached.ts` — wrappers `"use cache"` con `cacheLife` y `cacheTag`.
- `features/recommendations/components/home-recommendations.tsx` — server component, 6 cards en el home.
- `features/recommendations/components/similar-vehicles.tsx` — server component, 3 cards en el detalle.

**Archivos a modificar:**

- `app/page.tsx` — integrar `<HomeRecommendations />` dentro de `<Suspense>`.
- `app/comprar/[slug]/page.tsx` — integrar `<SimilarVehicles slug={...} />` dentro de `<Suspense>`.
- `CLAUDE.md` — eliminar mención a `lib/data/cars.json`.

**Archivos a eliminar:**

- `lib/data/cars.json` — data mock ya no usada.

**Archivos reutilizados (no modificar):**

- `components/global/vehicle-card.tsx` — render de cada tarjeta.
- `components/global/vehicle-card-skeleton.tsx` — ya exporta `VehicleCardSkeletonGrid` con prop `count`; se reutiliza como fallback de Suspense.
- `app/actions/vehiculo.cached.ts` — proveedor de `getCachedVehicleBySlug` (usado internamente por `getSimilarVehicles`).
- `types/vehiculo/vehiculo.d.ts` — tipos `Vehiculo`, `VehicleDetail`.

---

## Task 1: Crear acciones Prisma sin cache

**Files:**
- Create: `features/recommendations/actions/recommendations.ts`

- [ ] **Step 1: Crear el archivo con las queries Prisma**

```ts
// features/recommendations/actions/recommendations.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getVehicleBySlug } from "@/app/actions/vehiculo";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

const HOME_LIMIT = 6;
const SIMILAR_LIMIT = 3;
const MAX_PER_BRAND = 2;
const PRICE_DELTA = 0.20;

/**
 * Select compartido para recomendaciones.
 * Coincide con el select de `getVehiculos` para mantener compatibilidad
 * con el componente `VehicleCard`.
 */
const RECOMMENDATION_SELECT = {
  id: true,
  nombre: true,
  slug: true,
  precio: true,
  preciosiniva: true,
  kilometraje: true,
  motor: true,
  anio: true,
  traccion: true,
  transmision: true,
  combustible: true,
  color_exterior: true,
  marca: { select: { id: true, nombre: true } },
  categoria: { select: { id: true, nombre: true } },
  sucursal: { select: { id: true, nombre: true } },
  etiquetaComercial: {
    select: { nombre: true, slug: true },
  },
} as const;

type PrismaVehicleRow = {
  id: string;
  nombre: string;
  slug: string;
  precio: { toString(): string } | number;
  preciosiniva: { toString(): string } | number;
  kilometraje: number;
  motor: string | null;
  anio: number;
  traccion: string;
  transmision: string;
  combustible: string;
  color_exterior: string | null;
  marca: { id: string; nombre: string };
  categoria: { id: string; nombre: string };
  sucursal: { id: string; nombre: string };
  etiquetaComercial: { nombre: string; slug: string } | null;
};

function formatVehicle(row: PrismaVehicleRow): Vehiculo {
  return {
    ...row,
    precio: Number(row.precio),
    preciosiniva: Number(row.preciosiniva),
    color_exterior: row.color_exterior ?? "",
    traccion: row.traccion as string,
    transmision: row.transmision as string,
    combustible: row.combustible as string,
  };
}

/**
 * Aplica diversidad por marca: máximo 2 vehículos por marca.
 * Respeta el contador externo `marcaCount` (mutado in-place) para que
 * fases sucesivas (query de destacados + fallback) compartan estado.
 */
function pickWithBrandDiversity(
  rows: Vehiculo[],
  limit: number,
  marcaCount: Record<string, number>,
  alreadyPicked: Vehiculo[] = [],
): Vehiculo[] {
  const result = [...alreadyPicked];
  for (const row of rows) {
    if (result.length >= limit) break;
    const brandId = row.marca.id;
    const count = marcaCount[brandId] ?? 0;
    if (count >= MAX_PER_BRAND) continue;
    result.push(row);
    marcaCount[brandId] = count + 1;
  }
  return result;
}

export async function getHomeRecommendations(): Promise<Vehiculo[]> {
  // Paso 1: vehículos con etiqueta comercial, ordenados por recientes.
  const destacadosRaw = await prisma.vehiculo.findMany({
    where: { etiquetaComercialId: { not: null } },
    select: RECOMMENDATION_SELECT,
    orderBy: { createdAt: "desc" },
  });
  const destacados = destacadosRaw.map(formatVehicle);

  // Paso 2: aplicar diversidad por marca.
  const marcaCount: Record<string, number> = {};
  let picked = pickWithBrandDiversity(destacados, HOME_LIMIT, marcaCount);

  if (picked.length >= HOME_LIMIT) return picked;

  // Paso 3: fallback con recientes, excluyendo ya seleccionados.
  const excludedIds = picked.map((v) => v.id);
  const recientesRaw = await prisma.vehiculo.findMany({
    where: excludedIds.length > 0 ? { id: { notIn: excludedIds } } : {},
    select: RECOMMENDATION_SELECT,
    orderBy: { createdAt: "desc" },
  });
  const recientes = recientesRaw.map(formatVehicle);

  picked = pickWithBrandDiversity(recientes, HOME_LIMIT, marcaCount, picked);

  if (picked.length >= HOME_LIMIT) return picked;

  // Paso 4: relajar diversidad y completar con los más recientes restantes.
  const pickedIds = new Set(picked.map((v) => v.id));
  for (const v of recientes) {
    if (picked.length >= HOME_LIMIT) break;
    if (pickedIds.has(v.id)) continue;
    picked.push(v);
    pickedIds.add(v.id);
  }

  return picked;
}

export async function getSimilarVehicles(slug: string): Promise<Vehiculo[]> {
  const current = await getVehicleBySlug(slug);
  if (!current) return [];

  const currentId = current.id;
  const categoriaId = current.categoria.id;
  const marcaId = current.marca.id;
  const precio = current.precio;
  const minPrecio = precio * (1 - PRICE_DELTA);
  const maxPrecio = precio * (1 + PRICE_DELTA);

  const collected: Vehiculo[] = [];
  const collectedIds = new Set<string>([currentId]);

  async function runQuery(
    where: Record<string, unknown>,
    orderBy: Record<string, unknown>,
  ): Promise<void> {
    if (collected.length >= SIMILAR_LIMIT) return;
    const remaining = SIMILAR_LIMIT - collected.length;
    const rows = await prisma.vehiculo.findMany({
      where: {
        ...where,
        id: { notIn: Array.from(collectedIds) },
      },
      select: RECOMMENDATION_SELECT,
      orderBy,
      take: remaining,
    });
    for (const row of rows) {
      const formatted = formatVehicle(row);
      collected.push(formatted);
      collectedIds.add(formatted.id);
    }
  }

  // Nivel 1: categoría + marca + precio ±20%
  await runQuery(
    {
      categoriaId,
      marcaId,
      precio: { gte: minPrecio, lte: maxPrecio },
    },
    { precio: "asc" },
  );

  // Nivel 2: categoría + marca (precio libre)
  if (collected.length < SIMILAR_LIMIT) {
    await runQuery({ categoriaId, marcaId }, { precio: "asc" });
  }

  // Nivel 3: categoría (marca libre)
  if (collected.length < SIMILAR_LIMIT) {
    await runQuery({ categoriaId }, { precio: "asc" });
  }

  // Nivel 4: fallback global — cualquier vehículo, más recientes primero
  if (collected.length < SIMILAR_LIMIT) {
    await runQuery({}, { createdAt: "desc" });
  }

  return collected;
}
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `npx tsc --noEmit`
Expected: sin errores relacionados a `features/recommendations/actions/recommendations.ts`.

Si `tsc --noEmit` arroja errores preexistentes de otros archivos, es aceptable — solo asegúrate de que ninguno provenga del nuevo archivo.

- [ ] **Step 3: Commit**

```bash
git add features/recommendations/actions/recommendations.ts
git commit -m "feat(recommendations): agregar queries prisma para home y detalle"
```

---

## Task 2: Crear wrappers cacheados

**Files:**
- Create: `features/recommendations/actions/recommendations.cached.ts`

- [ ] **Step 1: Crear el archivo con los wrappers `use cache`**

```ts
// features/recommendations/actions/recommendations.cached.ts
import { cacheLife, cacheTag } from "next/cache";
import { getHomeRecommendations, getSimilarVehicles } from "./recommendations";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export async function getCachedHomeRecommendations(): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("home-recommendations");

  return getHomeRecommendations();
}

export async function getCachedSimilarVehicles(slug: string): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`similar-vehicles-${slug}`);

  return getSimilarVehicles(slug);
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add features/recommendations/actions/recommendations.cached.ts
git commit -m "feat(recommendations): agregar wrappers cacheados con use cache"
```

---

## Task 3: Crear componente `HomeRecommendations`

**Files:**
- Create: `features/recommendations/components/home-recommendations.tsx`

- [ ] **Step 1: Crear el server component**

```tsx
// features/recommendations/components/home-recommendations.tsx
import type React from "react";
import { getCachedHomeRecommendations } from "../actions/recommendations.cached";
import { VehicleCard } from "@/components/global/vehicle-card";
import { Container } from "@/components/layout/container";

export async function HomeRecommendations(): Promise<React.ReactElement | null> {
  const vehicles = await getCachedHomeRecommendations();

  if (vehicles.length === 0) return null;

  return (
    <section className="w-full py-12">
      <Container>
        <h2 className="font-semibold text-[#111111] mb-10 tracking-tight">
          Vehículos destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="w-full flex justify-center">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Nota de estilo:** el markup del grid replica el de `VehicleCardSkeletonGrid` (en `components/global/vehicle-card-skeleton.tsx`) para que el skeleton y el contenido real tengan exactamente el mismo layout — evita "saltos" visuales cuando Suspense resuelve.

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add features/recommendations/components/home-recommendations.tsx
git commit -m "feat(recommendations): agregar componente HomeRecommendations"
```

---

## Task 4: Crear componente `SimilarVehicles`

**Files:**
- Create: `features/recommendations/components/similar-vehicles.tsx`

- [ ] **Step 1: Crear el server component**

```tsx
// features/recommendations/components/similar-vehicles.tsx
import type React from "react";
import { getCachedSimilarVehicles } from "../actions/recommendations.cached";
import { VehicleCard } from "@/components/global/vehicle-card";

interface SimilarVehiclesProps {
  slug: string;
}

export async function SimilarVehicles({
  slug,
}: SimilarVehiclesProps): Promise<React.ReactElement | null> {
  const vehicles = await getCachedSimilarVehicles(slug);

  if (vehicles.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-semibold text-[#111111] mb-10 tracking-tight">
        Vehículos similares
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="w-full flex justify-center">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add features/recommendations/components/similar-vehicles.tsx
git commit -m "feat(recommendations): agregar componente SimilarVehicles"
```

---

## Task 5: Integrar `HomeRecommendations` en `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Leer el estado actual del archivo**

El contenido actual es:

```tsx
import { Suspense } from "react";
import Hero from "@/components/sections/home/hero";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { HomeVehicleGrid } from "@/features/filters/components/home-vehicle-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: HomeProps): Promise<React.ReactElement> {
  return (
    <FilterLoadingProvider>
      {/* Hero is static — renders instantly */}
      <Hero>
        <Suspense>
          <HomeSearchBarContent searchParams={searchParams} className="absolute bottom-6 left-0 right-0 z-30 hola" />
        </Suspense>
      </Hero>

      {/* Vehicle grid streams in */}
      <Suspense fallback={<VehicleCardSkeletonGrid />}>
        <HomeVehicleGrid searchParams={searchParams} />
      </Suspense>

      {/* Static sections */}
      <WrapperMarquee />
      <AnnouncementGrid />
    </FilterLoadingProvider>
  );
}
```

- [ ] **Step 2: Añadir el import de `HomeRecommendations`**

Insertar después del import de `HomeVehicleGrid`:

```tsx
import { HomeRecommendations } from "@/features/recommendations/components/home-recommendations";
```

- [ ] **Step 3: Añadir el bloque Suspense después de `<AnnouncementGrid />`**

Reemplazar el bloque `{/* Static sections */}` por:

```tsx
      {/* Static sections */}
      <WrapperMarquee />
      <AnnouncementGrid />

      {/* Recommendations */}
      <Suspense fallback={<VehicleCardSkeletonGrid count={6} />}>
        <HomeRecommendations />
      </Suspense>
```

**Nota:** `VehicleCardSkeletonGrid` ya acepta el prop `count` (ver `components/global/vehicle-card-skeleton.tsx:49-53`). Se reutiliza para no duplicar markup.

- [ ] **Step 4: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): integrar seccion de vehiculos destacados"
```

---

## Task 6: Integrar `SimilarVehicles` en `app/comprar/[slug]/page.tsx`

**Files:**
- Modify: `app/comprar/[slug]/page.tsx`

- [ ] **Step 1: Leer el estado actual del archivo**

El contenido actual es:

```tsx
import type React from "react";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PurchaseContent } from "@/features/comprar/components/purchase-content";

interface BuyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BuyPage({ params }: BuyPageProps): Promise<React.ReactElement> {
  return (
    <Container className="py-4">
      <Suspense
        fallback={
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 animate-pulse">
            <div className="space-y-6">
              <div className="h-12 w-full rounded-full bg-muted" />
              <div className="h-96 w-full rounded-2xl bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-muted" />
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
            </div>
          </div>
        }
      >
        <PurchaseContent params={params} />
      </Suspense>
    </Container>
  );
}
```

- [ ] **Step 2: Resolver `slug` a nivel de page y pasar el original `params` a `PurchaseContent`**

Reemplazar el archivo completo por:

```tsx
import type React from "react";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PurchaseContent } from "@/features/comprar/components/purchase-content";
import { SimilarVehicles } from "@/features/recommendations/components/similar-vehicles";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";

interface BuyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BuyPage({ params }: BuyPageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  return (
    <Container className="py-4">
      <Suspense
        fallback={
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 animate-pulse">
            <div className="space-y-6">
              <div className="h-12 w-full rounded-full bg-muted" />
              <div className="h-96 w-full rounded-2xl bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-muted" />
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
            </div>
          </div>
        }
      >
        <PurchaseContent params={params} />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={3} />}>
        <SimilarVehicles slug={slug} />
      </Suspense>
    </Container>
  );
}
```

**Nota importante:** `params` es una Promise de Next.js. Awaitearla para extraer `slug` **no la invalida** — sigue siendo una Promise válida que puede pasarse a `PurchaseContent` (que internamente la va a awaitear). No se modifica el contrato de `PurchaseContent`.

- [ ] **Step 3: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
git add "app/comprar/[slug]/page.tsx"
git commit -m "feat(comprar): integrar seccion de vehiculos similares"
```

---

## Task 7: Eliminar `lib/data/cars.json` y actualizar `CLAUDE.md`

**Files:**
- Delete: `lib/data/cars.json`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Verificar que no hay imports a `cars.json`**

Usar Grep tool con patrón `cars.json` en todo el proyecto (incluyendo `lib/data/cars.json` mismo).

Expected: el único match debe estar en `CLAUDE.md`. Si hay otro import en código, **detenerse** y avisar — esta tarea no debe ejecutarse hasta resolverlo.

- [ ] **Step 2: Eliminar el archivo**

```bash
rm lib/data/cars.json
```

Si `lib/data/` queda vacío después, eliminar también el directorio:

```bash
rmdir lib/data 2>/dev/null || true
```

- [ ] **Step 3: Actualizar `CLAUDE.md`**

Abrir `CLAUDE.md` y localizar la sección `### Data Patterns`. Eliminar la línea:

```markdown
- Demo vehicle data is currently served from `lib/data/cars.json` (not from DB)
```

La sección queda así:

```markdown
### Data Patterns

- **Server components** fetch data directly or use Prisma
- **Client components** use React Hook Form + custom hooks for form state
- **Feature hooks** (e.g. `useLoginForm`, `useRegisterForm`, `useTestDriveForm`) encapsulate all form logic, validation, and API calls — components stay thin
```

- [ ] **Step 4: Verificar con grep que `cars.json` no aparece más**

Usar Grep tool con patrón `cars.json`.
Expected: cero matches.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md lib/data/cars.json
git commit -m "chore: eliminar lib/data/cars.json obsoleto"
```

---

## Task 8: Verificación final (lint + build + smoke test manual)

**Files:** ninguno (solo verificación).

- [ ] **Step 1: Ejecutar lint**

Run: `npm run lint`
Expected: cero errores, cero warnings relacionados a los archivos nuevos o modificados.

Si hay warnings preexistentes en otros archivos, son aceptables — pero ningún warning nuevo en:
- `features/recommendations/**`
- `app/page.tsx`
- `app/comprar/[slug]/page.tsx`

- [ ] **Step 2: Ejecutar build**

Run: `npm run build`
Expected: build exitoso. Prisma generate corre primero (como siempre), luego Next build.

Si el build falla por errores de tipo en los archivos nuevos, corregir antes de continuar.

- [ ] **Step 3: Smoke test manual en dev**

Run: `npm run dev`

En el navegador:

1. Abrir `http://localhost:3000/` → verificar que:
   - Se muestra la sección "Vehículos destacados" con hasta 6 tarjetas.
   - El skeleton aparece mientras carga (si la DB tarda).
   - Las tarjetas se ven idénticas a las del grid principal (mismo `VehicleCard`).
   - No se repiten más de 2 vehículos de la misma marca en la sección.

2. Abrir `http://localhost:3000/comprar/<algún-slug-válido>` → verificar que:
   - Se muestra la sección "Vehículos similares" al final con hasta 3 tarjetas.
   - **El vehículo actual NO aparece** en la sección.
   - Las 3 tarjetas intentan ser de la misma categoría (y preferiblemente marca) que el actual.

3. Abrir un vehículo con pocos "similares" en DB (si existe) → verificar que la cascada hace su trabajo y aun así aparecen hasta 3 tarjetas.

- [ ] **Step 4: Detener dev server**

`Ctrl+C` en la terminal donde corre `npm run dev`.

- [ ] **Step 5: Commit final vacío con resumen (opcional)**

Si hubo ajustes menores durante la verificación, commitearlos. Si no, esta tarea termina sin commit nuevo.

---

## Resumen de verificación

Al terminar las 8 tareas, el repositorio debe tener:

- ✅ 4 archivos nuevos en `features/recommendations/`.
- ✅ 2 archivos de páginas modificados (`app/page.tsx`, `app/comprar/[slug]/page.tsx`).
- ✅ `CLAUDE.md` actualizado.
- ✅ `lib/data/cars.json` eliminado.
- ✅ `npm run lint` pasa.
- ✅ `npm run build` pasa.
- ✅ Home muestra "Vehículos destacados" (6).
- ✅ Detalle muestra "Vehículos similares" (3, sin el actual).
- ✅ Ambas secciones usan `<Suspense>` + skeletons.
- ✅ Queries cacheadas con `cacheLife("hours")` y tags `home-recommendations` y `similar-vehicles-${slug}`.
