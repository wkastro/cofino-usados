# Architecture Restructure Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize project files so features own their validations, constants, and actions; `app/` only contains page/layout/route files.

**Architecture:** Move files into their owning feature directories, update all imports, delete empty directories. No code logic changes — only file moves and import path updates.

**Tech Stack:** Next.js 16, TypeScript, `@/` path alias

---

### Task 1: Move `features/sections/home/hero.tsx` to `components/sections/home/`

**Files:**
- Move: `features/sections/home/hero.tsx` -> `components/sections/home/hero.tsx`
- Modify: `app/page.tsx:2`
- Delete: `features/sections/` (empty after move)

- [ ] **Step 1: Move the file**

```bash
mv features/sections/home/hero.tsx components/sections/home/hero.tsx
```

- [ ] **Step 2: Update import in `app/page.tsx`**

Change line 2 from:
```tsx
import Hero from "@/features/sections/home/hero";
```
to:
```tsx
import Hero from "@/components/sections/home/hero";
```

- [ ] **Step 3: Delete empty directories**

```bash
rm -rf features/sections/
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/home/hero.tsx app/page.tsx
git rm features/sections/home/hero.tsx
git commit -m "move: hero.tsx to components/sections/home/"
```

---

### Task 2: Move `app/catalogo/[slug]/vehicle-detail.tsx` to `features/vehicle-detail/components/`

**Files:**
- Move: `app/catalogo/[slug]/vehicle-detail.tsx` -> `features/vehicle-detail/components/vehicle-detail.tsx`
- Modify: `app/catalogo/[slug]/page.tsx:7`

- [ ] **Step 1: Move the file**

```bash
mv "app/catalogo/[slug]/vehicle-detail.tsx" features/vehicle-detail/components/vehicle-detail.tsx
```

- [ ] **Step 2: Update import in `app/catalogo/[slug]/page.tsx`**

Change line 7 from:
```tsx
import { VehicleDetail } from "./vehicle-detail";
```
to:
```tsx
import { VehicleDetail } from "@/features/vehicle-detail/components/vehicle-detail";
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add features/vehicle-detail/components/vehicle-detail.tsx app/catalogo/\[slug\]/page.tsx
git rm app/catalogo/\[slug\]/vehicle-detail.tsx
git commit -m "move: vehicle-detail.tsx to features/vehicle-detail/components/"
```

---

### Task 3: Split `app/home-content.tsx` into feature directories

This file has 3 server components. `HomeSearchBarContent` and `HomeVehicleGrid` serve the home page via filters data-fetching. `ComprarVehicleGrid` serves the comprar page.

**Files:**
- Create: `features/filters/components/home-search-bar-content.tsx` (HomeSearchBarContent)
- Create: `features/filters/components/home-vehicle-grid.tsx` (HomeVehicleGrid)
- Create: `features/comprar/components/comprar-vehicle-grid.tsx` (ComprarVehicleGrid)
- Modify: `app/page.tsx:5`
- Modify: `app/comprar/page.tsx:2`
- Delete: `app/home-content.tsx`

- [ ] **Step 1: Create `features/filters/components/home-search-bar-content.tsx`**

```tsx
import { getCachedCategories, getCachedBrands } from "@/app/actions/vehiculo.cached";
import { getTransmissions } from "@/features/filters/actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import type { SearchParams } from "@/types/filters/filters";

interface HomeSearchBarContentProps {
  searchParams: Promise<SearchParams>;
  className?: string;
}

export async function HomeSearchBarContent({ searchParams, className }: HomeSearchBarContentProps): Promise<React.ReactElement> {
  const [categories, brands, transmissions] = await Promise.all([
    getCachedCategories(),
    getCachedBrands(),
    getTransmissions(),
  ]);

  return (
    <HomeSearchBar brands={brands} categories={categories} transmissions={transmissions} className={className} />
  );
}
```

Note: The import for `getTransmissions` points to `@/features/filters/actions/filters` because Task 5 moves it there. If executing this task before Task 5, temporarily use `@/app/actions/filters`.

- [ ] **Step 2: Create `features/filters/components/home-vehicle-grid.tsx`**

```tsx
import { VehicleGrid } from "@/features/filters/components/vehicle-grid";
import { getCachedVehiculos, getCachedEtiquetas, getCachedPriceRange, getCachedMinYear, getCachedKilometrajeRange } from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

interface HomeVehicleGridProps {
  searchParams: Promise<SearchParams>;
  showAdvancedFiltersButton?: boolean;
}

export async function HomeVehicleGrid({
  searchParams,
  showAdvancedFiltersButton = true,
}: HomeVehicleGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = parseSearchParamsToFilters(resolvedParams);

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedVehiculos(1, filters),
    getCachedEtiquetas(),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <VehicleGrid
      vehicles={vehicles}
      showAdvancedFiltersButton={showAdvancedFiltersButton}
      etiquetas={etiquetaOptions}
      priceRange={priceRange}
      minYear={minYear}
      kilometrajeRange={kilometrajeRange}
    />
  );
}
```

Note: The import for `VehicleGrid` points to `@/features/filters/components/vehicle-grid` because Task 4 moves it there. If executing this task before Task 4, temporarily use `@/components/sections/home/vehicle-grid`.

- [ ] **Step 3: Create `features/comprar/components/comprar-vehicle-grid.tsx`**

```tsx
import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { getCachedVehiculos, getCachedEtiquetas, getCachedPriceRange, getCachedMinYear, getCachedKilometrajeRange } from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

const COMPRAR_PAGE_SIZE = 9;

interface ComprarVehicleGridProps {
  searchParams: Promise<SearchParams>;
}

export async function ComprarVehicleGrid({
  searchParams,
}: ComprarVehicleGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = parseSearchParamsToFilters(resolvedParams);

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedVehiculos(1, filters, COMPRAR_PAGE_SIZE),
    getCachedEtiquetas(),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <InfiniteVehicleGrid
      initialData={vehicles}
      pageSize={COMPRAR_PAGE_SIZE}
      filters={filters}
      etiquetas={etiquetaOptions}
      priceRange={priceRange}
      minYear={minYear}
      kilometrajeRange={kilometrajeRange}
    />
  );
}
```

- [ ] **Step 4: Update `app/page.tsx` import**

Change line 5 from:
```tsx
import { HomeSearchBarContent, HomeVehicleGrid } from "./home-content";
```
to:
```tsx
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { HomeVehicleGrid } from "@/features/filters/components/home-vehicle-grid";
```

- [ ] **Step 5: Update `app/comprar/page.tsx` import**

Change line 2 from:
```tsx
import { HomeSearchBarContent, ComprarVehicleGrid } from "../home-content";
```
to:
```tsx
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { ComprarVehicleGrid } from "@/features/comprar/components/comprar-vehicle-grid";
```

- [ ] **Step 6: Delete `app/home-content.tsx`**

```bash
rm app/home-content.tsx
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add features/filters/components/home-search-bar-content.tsx features/filters/components/home-vehicle-grid.tsx features/comprar/components/comprar-vehicle-grid.tsx app/page.tsx app/comprar/page.tsx
git rm app/home-content.tsx
git commit -m "move: split home-content.tsx into feature directories"
```

---

### Task 4: Move `components/sections/home/vehicle-grid.tsx` to `features/filters/components/`

**Files:**
- Move: `components/sections/home/vehicle-grid.tsx` -> `features/filters/components/vehicle-grid.tsx`
- Modify: any file importing from `@/components/sections/home/vehicle-grid`

Current importers (from grep): only `app/home-content.tsx` — but by this task, that file is already split (Task 3), and `home-vehicle-grid.tsx` already points to `@/features/filters/components/vehicle-grid`.

- [ ] **Step 1: Move the file**

```bash
mv components/sections/home/vehicle-grid.tsx features/filters/components/vehicle-grid.tsx
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add features/filters/components/vehicle-grid.tsx
git rm components/sections/home/vehicle-grid.tsx
git commit -m "move: vehicle-grid.tsx to features/filters/components/"
```

---

### Task 5: Move `app/actions/filters.ts` to `features/filters/actions/`

**Files:**
- Move: `app/actions/filters.ts` -> `features/filters/actions/filters.ts`
- Modify: any file importing from `@/app/actions/filters`

Current importers: only `app/home-content.tsx` — but by this task, that file is split (Task 3), and `home-search-bar-content.tsx` already points to `@/features/filters/actions/filters`.

- [ ] **Step 1: Create directory and move file**

```bash
mkdir -p features/filters/actions
mv app/actions/filters.ts features/filters/actions/filters.ts
```

- [ ] **Step 2: Update import in `app/actions/vehiculo.cached.ts`**

Check if `vehiculo.cached.ts` imports from `./filters`. If not, no change needed. (From our audit, it does not — `getTransmissions` is only imported via `home-content.tsx` which is now split.)

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add features/filters/actions/filters.ts
git rm app/actions/filters.ts
git commit -m "move: filters.ts to features/filters/actions/"
```

---

### Task 6: Move `app/actions/favorito.ts` to `features/favoritos/actions/`

**Files:**
- Move: `app/actions/favorito.ts` -> `features/favoritos/actions/favorito.ts`
- Modify: `features/favoritos/component/favorites-content.tsx:1`
- Modify: `features/favoritos/context/favorites-context.tsx:17`

- [ ] **Step 1: Create directory and move file**

```bash
mkdir -p features/favoritos/actions
mv app/actions/favorito.ts features/favoritos/actions/favorito.ts
```

- [ ] **Step 2: Update import in `features/favoritos/component/favorites-content.tsx`**

Change line 1 from:
```tsx
import { getFavoriteVehiculos } from "@/app/actions/favorito";
```
to:
```tsx
import { getFavoriteVehiculos } from "@/features/favoritos/actions/favorito";
```

- [ ] **Step 3: Update import in `features/favoritos/context/favorites-context.tsx`**

Change line 17 from:
```tsx
} from "@/app/actions/favorito";
```
to:
```tsx
} from "@/features/favoritos/actions/favorito";
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add features/favoritos/actions/favorito.ts features/favoritos/component/favorites-content.tsx features/favoritos/context/favorites-context.tsx
git rm app/actions/favorito.ts
git commit -m "move: favorito.ts to features/favoritos/actions/"
```

---

### Task 7: Rename `features/favoritos/component/` to `features/favoritos/components/`

**Files:**
- Rename: `features/favoritos/component/` -> `features/favoritos/components/`
- Modify: any file importing from `features/favoritos/component/` (check grep)

- [ ] **Step 1: Check importers**

```bash
grep -r "features/favoritos/component/" --include="*.tsx" --include="*.ts" -l
```

Expected: `app/favoritos/page.tsx` (and possibly others).

- [ ] **Step 2: Rename directory**

```bash
mv features/favoritos/component features/favoritos/components
```

- [ ] **Step 3: Update imports**

In `app/favoritos/page.tsx`, change:
```tsx
import { FavoritesContent } from "@/features/favoritos/component/favorites-content";
```
to:
```tsx
import { FavoritesContent } from "@/features/favoritos/components/favorites-content";
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add features/favoritos/components/ app/favoritos/page.tsx
git rm -r features/favoritos/component/
git commit -m "rename: favoritos/component/ to components/ (consistent naming)"
```

---

### Task 8: Move validation schemas into their feature directories

**Files:**
- Move: `lib/validations/auth-users.ts` -> `features/auth-users/validations/auth-users.ts`
- Move: `lib/validations/auth-dashboard.ts` -> `features/auth-dashboard/validations/auth-dashboard.ts`
- Move: `lib/validations/test-drive.ts` -> `features/test-drive/validations/test-drive.ts`
- Move: `lib/validations/exchange.ts` -> `features/intercambiar/validations/exchange.ts`
- Move: `lib/validations/purchase.ts` -> `features/comprar/validations/purchase.ts`
- Keep: `lib/validations/auth.ts` (shared between `app/actions/auth.ts` and `app/api/auth/register/route.ts`)

Importers to update:
- `features/auth-users/hooks/useLoginForm.ts` — `@/lib/validations/auth-users`
- `features/auth-users/hooks/useRegisterForm.ts` — `@/lib/validations/auth-users`
- `features/auth-dashboard/hooks/useAdminRegisterForm.ts` — `@/lib/validations/auth-dashboard`
- `features/test-drive/hooks/useTestDriveForm.ts` — `@/lib/validations/test-drive`
- `features/intercambiar/hooks/useExchangeForm.ts` — `@/lib/validations/exchange`
- `features/comprar/hooks/usePurchaseForm.ts` — `@/lib/validations/purchase`
- `features/comprar/components/transfer-form.tsx` — `@/lib/validations/purchase`
- `features/comprar/components/card-form.tsx` — `@/lib/validations/purchase`
- `features/comprar/components/payment-method-tabs.tsx` — `@/lib/validations/purchase`

- [ ] **Step 1: Create directories and move files**

```bash
mkdir -p features/auth-users/validations
mkdir -p features/auth-dashboard/validations
mkdir -p features/test-drive/validations
mkdir -p features/intercambiar/validations
mkdir -p features/comprar/validations

mv lib/validations/auth-users.ts features/auth-users/validations/auth-users.ts
mv lib/validations/auth-dashboard.ts features/auth-dashboard/validations/auth-dashboard.ts
mv lib/validations/test-drive.ts features/test-drive/validations/test-drive.ts
mv lib/validations/exchange.ts features/intercambiar/validations/exchange.ts
mv lib/validations/purchase.ts features/comprar/validations/purchase.ts
```

- [ ] **Step 2: Update auth-users imports**

In `features/auth-users/hooks/useLoginForm.ts`, change:
```tsx
} from "@/lib/validations/auth-users";
```
to:
```tsx
} from "@/features/auth-users/validations/auth-users";
```

In `features/auth-users/hooks/useRegisterForm.ts`, change the same pattern.

- [ ] **Step 3: Update auth-dashboard import**

In `features/auth-dashboard/hooks/useAdminRegisterForm.ts`, change:
```tsx
} from "@/lib/validations/auth-dashboard";
```
to:
```tsx
} from "@/features/auth-dashboard/validations/auth-dashboard";
```

- [ ] **Step 4: Update test-drive import**

In `features/test-drive/hooks/useTestDriveForm.ts`, change:
```tsx
import { testDriveSchema, type TestDriveFormData } from "@/lib/validations/test-drive";
```
to:
```tsx
import { testDriveSchema, type TestDriveFormData } from "@/features/test-drive/validations/test-drive";
```

- [ ] **Step 5: Update intercambiar imports**

In `features/intercambiar/hooks/useExchangeForm.ts`, change both lines:
```tsx
} from "@/lib/validations/exchange";
import type { ExchangeFormData } from "@/lib/validations/exchange";
```
to:
```tsx
} from "@/features/intercambiar/validations/exchange";
import type { ExchangeFormData } from "@/features/intercambiar/validations/exchange";
```

- [ ] **Step 6: Update comprar imports (3 files)**

In `features/comprar/hooks/usePurchaseForm.ts`:
```tsx
import { purchaseSchema, type PurchaseFormData } from "@/lib/validations/purchase";
```
to:
```tsx
import { purchaseSchema, type PurchaseFormData } from "@/features/comprar/validations/purchase";
```

In `features/comprar/components/transfer-form.tsx`:
```tsx
import type { PurchaseFormData } from "@/lib/validations/purchase";
```
to:
```tsx
import type { PurchaseFormData } from "@/features/comprar/validations/purchase";
```

Same change in `features/comprar/components/card-form.tsx` and `features/comprar/components/payment-method-tabs.tsx`.

- [ ] **Step 7: Verify build**

```bash
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add features/auth-users/validations/ features/auth-dashboard/validations/ features/test-drive/validations/ features/intercambiar/validations/ features/comprar/validations/
git add features/auth-users/hooks/ features/auth-dashboard/hooks/ features/test-drive/hooks/ features/intercambiar/hooks/ features/comprar/hooks/ features/comprar/components/
git rm lib/validations/auth-users.ts lib/validations/auth-dashboard.ts lib/validations/test-drive.ts lib/validations/exchange.ts lib/validations/purchase.ts
git commit -m "move: validation schemas into their owning features"
```

---

### Task 9: Move `lib/constants/test-drive.ts` to `features/test-drive/constants/`

**Files:**
- Move: `lib/constants/test-drive.ts` -> `features/test-drive/constants/test-drive.ts`
- Modify: `features/test-drive/form.tsx:30`
- Modify: `features/test-drive/hooks/useTestDriveForm.ts:4`

- [ ] **Step 1: Create directory and move file**

```bash
mkdir -p features/test-drive/constants
mv lib/constants/test-drive.ts features/test-drive/constants/test-drive.ts
```

- [ ] **Step 2: Update import in `features/test-drive/form.tsx`**

Change:
```tsx
} from "@/lib/constants/test-drive";
```
to:
```tsx
} from "@/features/test-drive/constants/test-drive";
```

- [ ] **Step 3: Update import in `features/test-drive/hooks/useTestDriveForm.ts`**

Change:
```tsx
import { TEST_DRIVE_STEP_1_FIELDS } from "@/lib/constants/test-drive";
```
to:
```tsx
import { TEST_DRIVE_STEP_1_FIELDS } from "@/features/test-drive/constants/test-drive";
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add features/test-drive/constants/ features/test-drive/form.tsx features/test-drive/hooks/useTestDriveForm.ts
git rm lib/constants/test-drive.ts
git commit -m "move: test-drive constants into feature directory"
```

---

### Task 10: Clean up empty directories

**Files:**
- Delete: `lib/hooks/` (empty directory)

- [ ] **Step 1: Remove empty directory**

```bash
rmdir lib/hooks
```

- [ ] **Step 2: Verify no remaining empty dirs**

```bash
find features/ lib/ components/ -type d -empty
```

Expected: No empty directories.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "cleanup: remove empty lib/hooks/ directory"
```

Note: `rmdir` of an empty directory may not register as a git change. If `git status` shows nothing, skip the commit.
