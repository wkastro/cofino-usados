# Vehicle Listing Grid Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicated per-page server grid components (`ComprarVehicleGrid`, `CertificadosVehicleGrid`) with a single configurable `VehicleListingGrid` server component, and delete dead code (`HomeVehicleGrid`).

**Architecture:** A new server component `features/filters/components/vehicle-listing-grid.tsx` accepts `searchParams`, optional `lockedFilters` (merged on top of URL params), an optional `title`, and an optional `pageSize`. Pages import it directly — no new per-page components needed for future listing pages.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, Prisma (via cached actions), TypeScript.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `features/filters/components/vehicle-listing-grid.tsx` | Shared server component — fetches data, merges locked filters, renders `InfiniteVehicleGrid` |
| Modify | `app/(site)/comprar/page.tsx` | Switch from `ComprarVehicleGrid` to `VehicleListingGrid` |
| Modify | `app/(site)/certificados/page.tsx` | Switch from `CertificadosVehicleGrid` to `VehicleListingGrid` with `lockedFilters` |
| Delete | `features/comprar/components/comprar-vehicle-grid.tsx` | Replaced by `VehicleListingGrid` |
| Delete | `features/certificados/components/certificados-vehicle-grid.tsx` | Replaced by `VehicleListingGrid` |
| Delete | `features/filters/components/home-vehicle-grid.tsx` | Dead code — never imported in the app |

---

### Task 1: Create `VehicleListingGrid` server component

**Files:**
- Create: `features/filters/components/vehicle-listing-grid.tsx`

- [ ] **Step 1: Create the file with the following content**

```tsx
import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import {
  getCachedVehiculos,
  getCachedEtiquetas,
  getCachedPriceRange,
  getCachedMinYear,
  getCachedKilometrajeRange,
} from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams, VehicleFilters } from "@/types/filters/filters";

const DEFAULT_PAGE_SIZE = 9;

interface VehicleListingGridProps {
  searchParams: Promise<SearchParams>;
  lockedFilters?: Partial<VehicleFilters>;
  title?: string;
  pageSize?: number;
}

export async function VehicleListingGrid({
  searchParams,
  lockedFilters,
  title,
  pageSize = DEFAULT_PAGE_SIZE,
}: VehicleListingGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters: VehicleFilters = {
    ...parseSearchParamsToFilters(resolvedParams),
    ...lockedFilters,
  };

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] =
    await Promise.all([
      getCachedVehiculos(1, filters, pageSize),
      lockedFilters?.etiqueta ? Promise.resolve([]) : getCachedEtiquetas(),
      getCachedPriceRange(),
      getCachedMinYear(),
      getCachedKilometrajeRange(),
    ]);

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
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `vehicle-listing-grid.tsx`.

- [ ] **Step 3: Commit**

```bash
git add features/filters/components/vehicle-listing-grid.tsx
git commit -m "feat: add VehicleListingGrid shared server component"
```

---

### Task 2: Migrate `comprar/page.tsx` to use `VehicleListingGrid`

**Files:**
- Modify: `app/(site)/comprar/page.tsx`

- [ ] **Step 1: Replace the file content**

```tsx
import { Suspense } from "react";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

interface BuyPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  return (
    <FilterLoadingProvider>
      <Suspense>
        <HomeSearchBarContent searchParams={searchParams} className="mt-4" />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
        <VehicleListingGrid searchParams={searchParams} title="Autos recomendados" />
      </Suspense>
    </FilterLoadingProvider>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start the dev server and verify `/comprar` loads correctly**

```bash
npm run dev
```

Open `http://localhost:3000/comprar`. Verify:
- Vehicle grid renders with title "Autos recomendados"
- Top filter bar (marca, tipo, transmisión) is present and functional
- Advanced filters button opens the drawer with all sections (Estado, Combustible, Precio, Año, Kilometraje)
- Applying a filter updates the grid
- Infinite scroll loads more vehicles when scrolling past the 9th card (only if there are more than 9)

- [ ] **Step 4: Commit**

```bash
git add app/(site)/comprar/page.tsx
git commit -m "refactor: migrate comprar page to VehicleListingGrid"
```

---

### Task 3: Migrate `certificados/page.tsx` to use `VehicleListingGrid`

**Files:**
- Modify: `app/(site)/certificados/page.tsx`

- [ ] **Step 1: Replace the file content**

```tsx
import { Suspense } from "react";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

interface CertificadosPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CertificadosPage({
  searchParams,
}: CertificadosPageProps) {
  return (
    <FilterLoadingProvider>
      <Suspense>
        <HomeSearchBarContent searchParams={searchParams} className="mt-4" />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
        <VehicleListingGrid
          searchParams={searchParams}
          lockedFilters={{ etiqueta: "autos-certificados" }}
          title="Autos Certificados"
        />
      </Suspense>
    </FilterLoadingProvider>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify `/certificados` in the dev server**

Open `http://localhost:3000/certificados`. Verify:
- Only vehicles with `etiquetaComercial = "Autos Certificados"` appear
- Top filter bar is present
- Advanced filters drawer does NOT show the "Estado" section (because `lockedFilters.etiqueta` is set, so `etiquetaOptions` is empty)
- Filters for Combustible, Precio, Año, Kilometraje work correctly
- Infinite scroll works if more than 9 certificados vehicles exist

- [ ] **Step 4: Commit**

```bash
git add app/(site)/certificados/page.tsx
git commit -m "refactor: migrate certificados page to VehicleListingGrid"
```

---

### Task 4: Delete replaced and dead code

**Files:**
- Delete: `features/comprar/components/comprar-vehicle-grid.tsx`
- Delete: `features/certificados/components/certificados-vehicle-grid.tsx`
- Delete: `features/filters/components/home-vehicle-grid.tsx`

- [ ] **Step 1: Delete the three files**

```bash
rm features/comprar/components/comprar-vehicle-grid.tsx
rm features/certificados/components/certificados-vehicle-grid.tsx
rm features/filters/components/home-vehicle-grid.tsx
```

- [ ] **Step 2: Check for any remaining imports of the deleted files**

```bash
grep -r "comprar-vehicle-grid\|certificados-vehicle-grid\|home-vehicle-grid" app/ features/ --include="*.tsx" --include="*.ts"
```

Expected: no output. If any imports are found, remove them.

- [ ] **Step 3: Check if `features/certificados/` is now empty**

```bash
find features/certificados -type f
```

If empty (no files remain), delete the directory:

```bash
rm -rf features/certificados
```

- [ ] **Step 4: Verify TypeScript still compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Verify both pages still work in the dev server**

Open `http://localhost:3000/comprar` and `http://localhost:3000/certificados`. Both should function identically to before the deletions.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: delete replaced and dead code (comprar/certificados vehicle grids, HomeVehicleGrid)"
```
