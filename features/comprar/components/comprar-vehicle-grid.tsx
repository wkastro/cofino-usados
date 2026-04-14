import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
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
      actions={
        <AdvancedFiltersButton
          etiquetas={etiquetaOptions}
          priceRange={priceRange}
          minYear={minYear}
          kilometrajeRange={kilometrajeRange}
        />
      }
    />
  );
}
