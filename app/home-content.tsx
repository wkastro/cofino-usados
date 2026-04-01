import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { getCachedVehiculos, getCachedCategories, getCachedBrands, getCachedEtiquetas, getCachedPriceRange, getCachedMinYear, getCachedKilometrajeRange } from "./actions/vehiculo.cached";
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
  const resolvedParams = await searchParams;
  const precioMin = resolvedParams["precio-min"];
  const precioMax = resolvedParams["precio-max"];
  const anioMin = resolvedParams.anio;

  const filters: VehicleFilters = {
    ...(resolvedParams.marca && { marca: resolvedParams.marca }),
    ...(resolvedParams.categoria && { categoria: resolvedParams.categoria }),
    ...(resolvedParams.transmision && { transmision: resolvedParams.transmision }),
    ...(resolvedParams.etiqueta && { etiqueta: resolvedParams.etiqueta }),
    ...(resolvedParams.combustible && { combustible: resolvedParams.combustible }),
    ...(precioMin && { precioMin: Number(precioMin) }),
    ...(precioMax && { precioMax: Number(precioMax) }),
    ...(anioMin && { anio: Number(anioMin) }),
    ...(resolvedParams.kmin && { kmin: Number(resolvedParams.kmin) }),
    ...(resolvedParams.kmax && { kmax: Number(resolvedParams.kmax) }),
  };

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

const COMPRAR_PAGE_SIZE = 9;

export async function ComprarVehicleGrid({
  searchParams,
}: HomeContentProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const precioMin = resolvedParams["precio-min"];
  const precioMax = resolvedParams["precio-max"];
  const anioMin = resolvedParams.anio;

  const filters: VehicleFilters = {
    ...(resolvedParams.marca && { marca: resolvedParams.marca }),
    ...(resolvedParams.categoria && { categoria: resolvedParams.categoria }),
    ...(resolvedParams.transmision && { transmision: resolvedParams.transmision }),
    ...(resolvedParams.etiqueta && { etiqueta: resolvedParams.etiqueta }),
    ...(resolvedParams.combustible && { combustible: resolvedParams.combustible }),
    ...(precioMin && { precioMin: Number(precioMin) }),
    ...(precioMax && { precioMax: Number(precioMax) }),
    ...(anioMin && { anio: Number(anioMin) }),
    ...(resolvedParams.kmin && { kmin: Number(resolvedParams.kmin) }),
    ...(resolvedParams.kmax && { kmax: Number(resolvedParams.kmax) }),
  };

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
      etiquetas={etiquetaOptions}
      priceRange={priceRange}
      minYear={minYear}
      kilometrajeRange={kilometrajeRange}
    />
  );
}
