# Proximamente Etiqueta Exclusion — Design Spec

**Date:** 2026-04-13  
**Status:** Approved

## Problem

Vehicles tagged with the commercial label `proximamente` must be exclusive to the `/proximamente` page. They currently appear in all listings (comprar, home recommendations, similar vehicles) because the query layer has no exclusion logic for this tag.

## Goal

- Exclude `proximamente` vehicles from every listing and recommendation query by default.
- Show only `proximamente` vehicles on `/proximamente/page.tsx`, with no filter UI.
- Detail page (`/catalogo/[slug]`) remains unaffected — direct URL access still works.

## Scope

**In scope:**
- `getVehiculos` listing query
- `getHomeRecommendations` and `getSimilarVehicles` recommendation queries
- `VehicleListingGrid` and `InfiniteVehicleGrid` (add `showFilters` prop)
- `/proximamente/page.tsx`

**Out of scope:**
- `/catalogo/[slug]` detail page — intentionally excluded; direct URL access must keep working.
- Dashboard admin views — admin sees all vehicles regardless of etiqueta.

## Architecture

### Constant

Add `PROXIMAMENTE_SLUG = "proximamente"` to `lib/constants/etiqueta-comercial.ts`. Single source of truth for the slug string.

### Query Exclusion

**`app/actions/vehiculo.ts` — `getVehiculos`**

The `where` object gains a conditional exclusion:

```ts
// Exclude proximamente vehicles unless they are explicitly requested
...(filters.etiqueta !== PROXIMAMENTE_SLUG && {
  etiquetaComercial: { slug: { not: PROXIMAMENTE_SLUG } },
}),
```

When `filters.etiqueta === PROXIMAMENTE_SLUG`, the normal filter `{ etiquetaComercial: { slug: PROXIMAMENTE_SLUG } }` already applies, so no exclusion is needed.

**`features/recommendations/actions/recommendations.ts`**

- `buildFilterWhere`: same conditional exclusion added to the returned object.
- `getSimilarVehicles`: add `etiquetaComercial: { slug: { not: PROXIMAMENTE_SLUG } }` to the static `where` inside `runQuery`, unconditionally — similar vehicles should never be "proximamente" regardless of the current vehicle's tag.

### UI — `showFilters` prop

`InfiniteVehicleGrid` (`features/comprar/components/infinite-vehicle-grid.tsx`):
- Add `showFilters?: boolean` prop (default `true`).
- Wrap `AdvancedFiltersButton` in `{showFilters && ...}`.

`VehicleListingGrid` (`features/filters/components/vehicle-listing-grid.tsx`):
- Add `showFilters?: boolean` prop (default `true`).
- Pass it through to `InfiniteVehicleGrid`.

### `/proximamente/page.tsx`

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

No `FilterLoadingProvider` — the context has a safe default (`isPending: false`) so `InfiniteVehicleGrid` won't crash. No `HomeSearchBarContent` — no search bar on this page.

## Files Changed

| File | Change |
|---|---|
| `lib/constants/etiqueta-comercial.ts` | Add `PROXIMAMENTE_SLUG` constant |
| `app/actions/vehiculo.ts` | Exclude `proximamente` in `getVehiculos` where clause |
| `features/recommendations/actions/recommendations.ts` | Exclude in `buildFilterWhere`; exclude unconditionally in `getSimilarVehicles` |
| `features/comprar/components/infinite-vehicle-grid.tsx` | Add `showFilters` prop |
| `features/filters/components/vehicle-listing-grid.tsx` | Add `showFilters` prop |
| `app/(site)/proximamente/page.tsx` | Implement real page |

## Edge Cases

- **`etiqueta` filter in URL on `/proximamente`**: Because `lockedFilters` overrides and sanitizes search params, a user cannot inject a different etiqueta via URL on this page.
- **Vehicles with no etiqueta**: Unaffected — the exclusion only targets the specific slug.
- **`proximamente` vehicles in dashboard**: No change. Admin queries are independent of `getVehiculos`.
