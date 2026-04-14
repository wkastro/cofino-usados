import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import {
  getCachedVehiculos,
  getCachedPriceRange,
  getCachedMinYear,
  getCachedKilometrajeRange,
} from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

const CERTIFICADOS_PAGE_SIZE = 9;
const CERTIFICADOS_ETIQUETA_SLUG = "autos-certificados";

interface CertificadosVehicleGridProps {
  searchParams: Promise<SearchParams>;
}

export async function CertificadosVehicleGrid({
  searchParams,
}: CertificadosVehicleGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = {
    ...parseSearchParamsToFilters(resolvedParams),
    etiqueta: CERTIFICADOS_ETIQUETA_SLUG,
  };

  const [vehicles, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedVehiculos(1, filters, CERTIFICADOS_PAGE_SIZE),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <InfiniteVehicleGrid
      initialData={vehicles}
      pageSize={CERTIFICADOS_PAGE_SIZE}
      filters={filters}
      title="Autos Certificados"
      actions={
        <AdvancedFiltersButton
          priceRange={priceRange}
          minYear={minYear}
          kilometrajeRange={kilometrajeRange}
        />
      }
    />
  );
}
