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
  showFilters?: boolean;
}

export async function VehicleListingGrid({
  searchParams,
  lockedFilters,
  title,
  pageSize = DEFAULT_PAGE_SIZE,
  showFilters = true,
}: VehicleListingGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const sanitizedParams = { ...resolvedParams };
  if (lockedFilters) {
    // NOTE: VehicleFilters uses camelCase numeric keys (e.g. precioMin) while
    // SearchParams uses hyphenated string keys (e.g. "precio-min"). This loop
    // only correctly sanitizes keys that exist verbatim in both types (etiqueta,
    // marca, categoria, transmision, combustible). If a numeric filter is ever
    // locked, add explicit URL param key mapping here.
    for (const key of Object.keys(lockedFilters) as (keyof typeof sanitizedParams)[]) {
      delete sanitizedParams[key];
    }
  }
  const filters: VehicleFilters = {
    ...parseSearchParamsToFilters(sanitizedParams),
    ...lockedFilters,
  };

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] =
    await Promise.all([
      getCachedVehiculos(1, filters, pageSize),
      lockedFilters != null && "etiqueta" in lockedFilters
        ? Promise.resolve([])
        : getCachedEtiquetas(),
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
      showFilters={showFilters}
    />
  );
}
