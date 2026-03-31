import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import { getCachedVehiculos, getCachedCategories, getCachedBrands, getCachedEtiquetas, getCachedPriceRange } from "./actions/vehiculo.cached";
import { getTransmissions } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import type { VehicleFilters } from "@/types/filters/filters";
import type { SearchParams } from "@/types/filters/filters";

interface HomeContentProps {
  searchParams: Promise<SearchParams>;
  className?: string;
  showAdvancedFiltersButton?: boolean;
}

export async function HomeSearchBarContent({ searchParams, className }: HomeContentProps): Promise<React.ReactElement> {
  // async-parallel: start filter fetches immediately, don't wait for searchParams
  const [categories, brands, transmissions] = await Promise.all([
    getCachedCategories(),
    getCachedBrands(),
    getTransmissions(),
  ]);

  return (
    <HomeSearchBar brands={brands} categories={categories} transmissions={transmissions} className={className} />
  );
}

export async function HomeVehicleGrid({
  searchParams,
  showAdvancedFiltersButton = true,
}: HomeContentProps): Promise<React.ReactElement> {
  const { marca, categoria, transmision, etiqueta, combustible, precioMin, precioMax } = await searchParams;

  const filters: VehicleFilters = {
    ...(marca && { marca }),
    ...(categoria && { categoria }),
    ...(transmision && { transmision }),
    ...(etiqueta && { etiqueta }),
    ...(combustible && { combustible }),
    ...(precioMin && { precioMin: Number(precioMin) }),
    ...(precioMax && { precioMax: Number(precioMax) }),
  };

  const [vehicles, etiquetaOptions, priceRange] = await Promise.all([
    getCachedVehiculos(1, filters),
    getCachedEtiquetas(),
    getCachedPriceRange(),
  ]);

  return (
    <VehicleGrid
      vehicles={vehicles}
      showAdvancedFiltersButton={showAdvancedFiltersButton}
      etiquetas={etiquetaOptions}
      priceRange={priceRange}
    />
  );
}
