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
