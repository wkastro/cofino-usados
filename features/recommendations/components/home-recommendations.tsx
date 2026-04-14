import type React from "react";
import { getCachedHomeRecommendations } from "../actions/recommendations.cached";
import { VehicleGrid } from "@/features/filters/components/vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import {
  getCachedEtiquetas,
  getCachedPriceRange,
  getCachedMinYear,
  getCachedKilometrajeRange,
} from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

interface HomeRecommendationsProps {
  searchParams: Promise<SearchParams>;
}

export async function HomeRecommendations({
  searchParams,
}: HomeRecommendationsProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = parseSearchParamsToFilters(resolvedParams);

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedHomeRecommendations(filters),
    getCachedEtiquetas(),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <VehicleGrid
      vehicles={{
        vehiculos: vehicles,
        total: vehicles.length,
        pages: 1,
        page: 1,
      }}
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
