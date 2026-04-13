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
  const sanitizedParams = { ...resolvedParams };
  if (lockedFilters) {
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
    />
  );
}
