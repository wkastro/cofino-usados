# Proximamente Etiqueta Exclusion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vehicles tagged with `proximamente` only appear on `/proximamente`; all other listings and recommendations exclude them automatically.

**Architecture:** Add a slug exclusion to the Prisma `where` clause in `getVehiculos` and the recommendation queries. Add a `showFilters` prop to the vehicle grid components so the `/proximamente` page can render without filter UI.

**Tech Stack:** Next.js 16 App Router, Prisma (MariaDB), React 19, TypeScript, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-04-13-proximamente-etiqueta-exclusion-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/constants/etiqueta-comercial.ts` | Modify | Add `PROXIMAMENTE_SLUG` constant |
| `app/actions/vehiculo.ts` | Modify | Exclude proximamente in `getVehiculos` |
| `features/recommendations/actions/recommendations.ts` | Modify | Exclude in `buildFilterWhere` + `getSimilarVehicles` |
| `features/comprar/components/infinite-vehicle-grid.tsx` | Modify | Add `showFilters` prop |
| `features/filters/components/vehicle-listing-grid.tsx` | Modify | Accept + pass `showFilters` prop |
| `app/(site)/proximamente/page.tsx` | Modify | Replace stub with real page |

---

## Task 1: Add `PROXIMAMENTE_SLUG` constant

**Files:**
- Modify: `lib/constants/etiqueta-comercial.ts`

Current file content:
```ts
export const etiquetaStyles: Record<string, string> = {
  liquidacion: "text-[#9E2F22] bg-[#9E2F22]/15",
  "autos-certificados": "text-[#687C1B] bg-[#687C1B]/20",
  consignacion: "text-[#8A38F5] bg-[#8A38F5]/15",
  "baja-de-precio": "text-[#D5850D] bg-[#D5850D]/15",
  "nuevo-ingreso": "text-[#0C59F3] bg-[#0C59F3]/15",
  proximamente: "text-[#161918] bg-[#161918]/15",
};
```

- [ ] **Step 1: Add the constant**

Replace the file content with:

```ts
export const PROXIMAMENTE_SLUG = "proximamente" as const;

export const etiquetaStyles: Record<string, string> = {
  liquidacion: "text-[#9E2F22] bg-[#9E2F22]/15",
  "autos-certificados": "text-[#687C1B] bg-[#687C1B]/20",
  consignacion: "text-[#8A38F5] bg-[#8A38F5]/15",
  "baja-de-precio": "text-[#D5850D] bg-[#D5850D]/15",
  "nuevo-ingreso": "text-[#0C59F3] bg-[#0C59F3]/15",
  proximamente: "text-[#161918] bg-[#161918]/15",
};
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/constants/etiqueta-comercial.ts
git commit -m "feat: add PROXIMAMENTE_SLUG constant"
```

---

## Task 2: Exclude `proximamente` in `getVehiculos`

**Files:**
- Modify: `app/actions/vehiculo.ts`

- [ ] **Step 1: Add import**

At the top of `app/actions/vehiculo.ts`, add the import after the existing imports:

```ts
import { PROXIMAMENTE_SLUG } from "@/lib/constants/etiqueta-comercial";
```

- [ ] **Step 2: Add exclusion to the `where` object**

The `where` object inside `getVehiculos` currently ends with the price filter. Add the exclusion line. The full updated `where` object is:

```ts
const where = {
  estado: NOT_FACTURADO,
  ...(filters.etiqueta !== PROXIMAMENTE_SLUG && {
    etiquetaComercial: { slug: { not: PROXIMAMENTE_SLUG } },
  }),
  ...(filters.marca && { marca: { slug: filters.marca } }),
  ...(filters.categoria && { categoria: { slug: filters.categoria } }),
  ...(transmision && { transmision }),
  ...(filters.etiqueta && {
    etiquetaComercial: { slug: filters.etiqueta },
  }),
  ...(combustible && { combustible }),
  ...(filters.anio != null && { anio: { gte: filters.anio } }),
  ...((filters.kmin != null || filters.kmax != null) && {
    kilometraje: {
      ...(filters.kmin != null && { gte: filters.kmin }),
      ...(filters.kmax != null && { lte: filters.kmax }),
    },
  }),
  ...((filters.precioMin != null || filters.precioMax != null) && {
    precio: {
      ...(filters.precioMin != null && { gte: filters.precioMin }),
      ...(filters.precioMax != null && { lte: filters.precioMax }),
    },
  }),
};
```

Note: when `filters.etiqueta === PROXIMAMENTE_SLUG`, the exclusion spread is `false` (skipped) and the existing `filters.etiqueta` spread applies `{ etiquetaComercial: { slug: "proximamente" } }` — which correctly fetches only those vehicles.

- [ ] **Step 3: Verify lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/actions/vehiculo.ts
git commit -m "feat: exclude proximamente vehicles from getVehiculos by default"
```

---

## Task 3: Exclude `proximamente` in recommendation queries

**Files:**
- Modify: `features/recommendations/actions/recommendations.ts`

- [ ] **Step 1: Add import**

After the existing imports at the top of the file, add:

```ts
import { PROXIMAMENTE_SLUG } from "@/lib/constants/etiqueta-comercial";
```

- [ ] **Step 2: Update `buildFilterWhere`**

The function currently starts with `return { estado: NOT_FACTURADO, ... }`. Replace the `etiquetaComercial` filter spread with a ternary to avoid a JS key-conflict bug (two spreads writing the same key, last one wins). The full updated function:

```ts
function buildFilterWhere(filters: VehicleFilters): Record<string, unknown> {
  const transmision = filters.transmision ? TRANSMISION_MAP[filters.transmision] : undefined;
  const combustible = filters.combustible ? COMBUSTIBLE_MAP[filters.combustible] : undefined;

  return {
    estado: NOT_FACTURADO,
    ...(filters.etiqueta
      ? { etiquetaComercial: { slug: filters.etiqueta } }
      : { etiquetaComercial: { slug: { not: PROXIMAMENTE_SLUG } } }),
    ...(filters.marca && { marca: { slug: filters.marca } }),
    ...(filters.categoria && { categoria: { slug: filters.categoria } }),
    ...(transmision && { transmision }),
    ...(combustible && { combustible }),
    ...(filters.anio != null && { anio: { gte: filters.anio } }),
    ...((filters.kmin != null || filters.kmax != null) && {
      kilometraje: {
        ...(filters.kmin != null && { gte: filters.kmin }),
        ...(filters.kmax != null && { lte: filters.kmax }),
      },
    }),
    ...((filters.precioMin != null || filters.precioMax != null) && {
      precio: {
        ...(filters.precioMin != null && { gte: filters.precioMin }),
        ...(filters.precioMax != null && { lte: filters.precioMax }),
      },
    }),
  };
}
```

Note: the separate `filters.etiqueta` spread is removed — the ternary handles both cases in one clause.


- [ ] **Step 3: Update `getSimilarVehicles` — add exclusion to `runQuery`**

Inside `getSimilarVehicles`, the `runQuery` inner function builds a `where` like:

```ts
where: {
  estado: NOT_FACTURADO,
  ...where,
  id: { notIn: Array.from(collectedIds) },
},
```

Add the exclusion unconditionally (similar vehicles should never be "proximamente"):

```ts
where: {
  estado: NOT_FACTURADO,
  etiquetaComercial: { slug: { not: PROXIMAMENTE_SLUG } },
  ...where,
  id: { notIn: Array.from(collectedIds) },
},
```

- [ ] **Step 4: Verify lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add features/recommendations/actions/recommendations.ts
git commit -m "feat: exclude proximamente vehicles from recommendations and similar vehicles"
```

---

## Task 4: Add `showFilters` prop to `InfiniteVehicleGrid`

**Files:**
- Modify: `features/comprar/components/infinite-vehicle-grid.tsx`

- [ ] **Step 1: Add prop to interface and component signature**

In `InfiniteVehicleGridProps`, add:

```ts
interface InfiniteVehicleGridProps {
  initialData: VehicleResponse;
  pageSize: number;
  filters: VehicleFilters;
  etiquetas?: EtiquetaComercial[];
  priceRange?: RangeValues;
  minYear?: number;
  kilometrajeRange?: RangeValues;
  title?: string;
  showFilters?: boolean;
}
```

And update the destructuring in the component function:

```ts
export function InfiniteVehicleGrid({
  initialData,
  pageSize,
  filters,
  etiquetas = [],
  priceRange,
  minYear,
  kilometrajeRange,
  title = "Autos recomendados",
  showFilters = true,
}: InfiniteVehicleGridProps) {
```

- [ ] **Step 2: Conditionally render `AdvancedFiltersButton`**

Find the section header inside the JSX:

```tsx
<div className="mb-10 flex items-center justify-between gap-4">
  <h2 className="font-semibold text-[#111111] tracking-tight">
    {title}
  </h2>
  <AdvancedFiltersButton
    etiquetas={etiquetas}
    priceRange={priceRange}
    minYear={minYear}
    kilometrajeRange={kilometrajeRange}
  />
</div>
```

Replace with:

```tsx
<div className="mb-10 flex items-center justify-between gap-4">
  <h2 className="font-semibold text-[#111111] tracking-tight">
    {title}
  </h2>
  {showFilters && (
    <AdvancedFiltersButton
      etiquetas={etiquetas}
      priceRange={priceRange}
      minYear={minYear}
      kilometrajeRange={kilometrajeRange}
    />
  )}
</div>
```

- [ ] **Step 3: Verify lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add features/comprar/components/infinite-vehicle-grid.tsx
git commit -m "feat: add showFilters prop to InfiniteVehicleGrid"
```

---

## Task 5: Thread `showFilters` through `VehicleListingGrid`

**Files:**
- Modify: `features/filters/components/vehicle-listing-grid.tsx`

- [ ] **Step 1: Add prop to interface and component**

Update `VehicleListingGridProps`:

```ts
interface VehicleListingGridProps {
  searchParams: Promise<SearchParams>;
  lockedFilters?: Partial<VehicleFilters>;
  title?: string;
  pageSize?: number;
  showFilters?: boolean;
}
```

Update the function signature:

```ts
export async function VehicleListingGrid({
  searchParams,
  lockedFilters,
  title,
  pageSize = DEFAULT_PAGE_SIZE,
  showFilters = true,
}: VehicleListingGridProps): Promise<React.ReactElement> {
```

- [ ] **Step 2: Pass prop to `InfiniteVehicleGrid`**

In the return statement, add `showFilters={showFilters}` to `InfiniteVehicleGrid`:

```tsx
return (
  <InfiniteVehicleGrid
    initialData={vehicles}
    pageSize={pageSize}
    filters={filters}
    etiquetas={etiquetaOptions}
    priceRange={priceRange}
    minYear={minYear}
    kilometrajeRange={kilometrajeRange}
    title={title}
    showFilters={showFilters}
  />
);
```

- [ ] **Step 3: Verify lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add features/filters/components/vehicle-listing-grid.tsx
git commit -m "feat: thread showFilters prop through VehicleListingGrid"
```

---

## Task 6: Implement `/proximamente` page

**Files:**
- Modify: `app/(site)/proximamente/page.tsx`

- [ ] **Step 1: Replace stub with real implementation**

Replace the entire file content with:

```tsx
import { Suspense } from "react";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import type { SearchParams } from "@/types/filters/filters";

interface ProximamentePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProximamentePage({ searchParams }: ProximamentePageProps) {
  return (
    <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
      <VehicleListingGrid
        searchParams={searchParams}
        lockedFilters={{ etiqueta: "proximamente" }}
        title="Próximamente"
        showFilters={false}
      />
    </Suspense>
  );
}
```

Notes:
- No `FilterLoadingProvider` needed — `FilterLoadingContext` has a safe default (`isPending: false`), so `InfiniteVehicleGrid` won't crash without it.
- No `HomeSearchBarContent` — this page has no search bar.
- `lockedFilters={{ etiqueta: "proximamente" }}` ensures the query fetches only proximamente vehicles and prevents URL injection of a different etiqueta.

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify manually**

```bash
npm run dev
```

Check the following:
1. Visit `http://localhost:3000/proximamente` — should show a grid of vehicles tagged "proximamente" with title "Próximamente" and no filter button.
2. Visit `http://localhost:3000/comprar` — vehicles tagged "proximamente" should NOT appear.
3. Visit `http://localhost:3000` (home) — vehicles tagged "proximamente" should NOT appear in recommendations.
4. Visit `http://localhost:3000/certificados` — vehicles tagged "proximamente" should NOT appear.

- [ ] **Step 4: Commit**

```bash
git add app/(site)/proximamente/page.tsx
git commit -m "feat: implement proximamente page with locked etiqueta filter and no filters UI"
```
