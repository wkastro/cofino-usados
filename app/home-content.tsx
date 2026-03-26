import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import { getCachedVehiculos, getCachedCategories, getCachedBrands } from "./actions/vehiculo.cached";
import { getTransmissions } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import type { VehicleFilters } from "@/types/filters/filters";

interface HomeContentProps {
  searchParams: Promise<{ marca?: string; categoria?: string; transmision?: string }>;
}

export async function HomeSearchBarContent({ searchParams }: HomeContentProps) {
  const { marca, categoria, transmision } = await searchParams;

  const [categories, brands, transmissions] = await Promise.all([
    getCachedCategories(),
    getCachedBrands(),
    getTransmissions(),
  ]);

  return (
    <HomeSearchBar brands={brands} categories={categories} transmissions={transmissions} />
  );
}

export async function HomeVehicleGrid({ searchParams }: HomeContentProps) {
  const { marca, categoria, transmision } = await searchParams;

  const filters: VehicleFilters = {
    ...(marca && { marca }),
    ...(categoria && { categoria }),
    ...(transmision && { transmision }),
  };

  const vehicles = await getCachedVehiculos(1, filters);

  return <VehicleGrid vehicles={vehicles} />;
}
