import { Suspense } from "react";
import Hero from "@/features/sections/home/hero";
import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import { getCachedVehiculos } from "./actions/vehiculo.cached";
import { getCategories, getBrands, getTransmissions } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import type { VehicleFilters } from "@/types/filters/filters";

interface HomeContentProps {
  searchParams: Promise<{ marca?: string; categoria?: string; transmision?: string }>;
}

export async function HomeContent({ searchParams }: HomeContentProps) {
  const { marca, categoria, transmision } = await searchParams;

  const filters: VehicleFilters = {
    ...(marca && { marca }),
    ...(categoria && { categoria }),
    ...(transmision && { transmision }),
  };

  const [vehicles, categories, brands, transmissions] = await Promise.all([
    getCachedVehiculos(1, filters),
    getCategories(),
    getBrands(),
    getTransmissions(),
  ]);

  return (
    <>
      <Hero>
        <Suspense>
          <HomeSearchBar brands={brands} categories={categories} transmissions={transmissions} />
        </Suspense>
      </Hero>
      <VehicleGrid vehicles={vehicles} />
    </>
  );
}
