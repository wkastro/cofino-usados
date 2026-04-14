import { VehicleGrid } from "@/features/filters/components/vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import { getCachedVehiculos, getCachedEtiquetas, getCachedPriceRange, getCachedMinYear, getCachedKilometrajeRange } from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

interface HomeVehicleGridProps {
  searchParams: Promise<SearchParams>;
}

export async function HomeVehicleGrid({
  searchParams,
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
