# Vehicle Listing Grid Refactor — Design Spec

**Date:** 2026-04-13  
**Status:** Approved

---

## Problem

Every filtered listing page (`/comprar`, `/certificados`, and future pages like `/pickups`, `/suvs`) requires a near-identical server component just to lock a filter and adjust a title. This creates copy-paste duplication that grows with each new page.

Current duplicated pattern:
- `features/comprar/components/comprar-vehicle-grid.tsx`
- `features/certificados/components/certificados-vehicle-grid.tsx`

Additionally, `features/filters/components/home-vehicle-grid.tsx` is dead code — imported nowhere in the app.

---

## Goal

Replace all per-page server grid components with a single configurable `VehicleListingGrid` server component. New filtered listing pages require only a page file — no new components.

---

## Design

### New component: `features/filters/components/vehicle-listing-grid.tsx`

```tsx
interface VehicleListingGridProps {
  searchParams: Promise<SearchParams>;
  lockedFilters?: Partial<VehicleFilters>; // merged after URL params, cannot be overridden
  title?: string;                          // defaults to "Autos recomendados"
  pageSize?: number;                       // defaults to 9
}
```

**Internal logic:**

1. Resolve `searchParams` and parse to `VehicleFilters`
2. Merge `lockedFilters` on top: `{ ...parsed, ...lockedFilters }`
3. If `lockedFilters.etiqueta` is set → skip `getCachedEtiquetas()` (Estado filter auto-hides via existing `etiquetaOptions.length > 0` guard in `AdvancedFiltersButton`)
4. Fetch `getCachedVehiculos`, `getCachedPriceRange`, `getCachedMinYear`, `getCachedKilometrajeRange` in parallel
5. Render `InfiniteVehicleGrid` with the resolved data

### Pages after refactor

```tsx
// comprar/page.tsx
<VehicleListingGrid searchParams={searchParams} title="Autos recomendados" />

// certificados/page.tsx
<VehicleListingGrid
  searchParams={searchParams}
  lockedFilters={{ etiqueta: "autos-certificados" }}
  title="Autos Certificados"
/>

// future: pickups/page.tsx (example)
<VehicleListingGrid
  searchParams={searchParams}
  lockedFilters={{ categoria: "pickup" }}
  title="Pickups"
/>
```

The `FilterLoadingProvider` + `HomeSearchBarContent` + `Suspense` wrappers remain at the page level — they are not abstracted — because the home page places the search bar inside the Hero, not above the grid.

---

## Files Changed

| Action | File |
|---|---|
| Create | `features/filters/components/vehicle-listing-grid.tsx` |
| Update | `app/(site)/comprar/page.tsx` — use `VehicleListingGrid` |
| Update | `app/(site)/certificados/page.tsx` — use `VehicleListingGrid` |
| Delete | `features/comprar/components/comprar-vehicle-grid.tsx` |
| Delete | `features/certificados/components/certificados-vehicle-grid.tsx` |
| Delete | `features/filters/components/home-vehicle-grid.tsx` (dead code) |
| Delete | `features/certificados/` directory if empty after cleanup |

---

## What Does NOT Change

- `InfiniteVehicleGrid` (client component) — stays as-is
- `HomeRecommendations` — uses a different data source (recommendations action), not affected
- `VehicleGrid` (home non-infinite grid) — not affected
- `FilterLoadingProvider`, `HomeSearchBarContent`, `AdvancedFiltersButton` — not affected
- Page-level structure (provider + search bar + grid) — not abstracted

---

## Constraints

- `lockedFilters` values always win over URL params — prevents URL manipulation bypassing the page intent
- `pageSize` defaults to 9 to match current behavior on both comprar and certificados
