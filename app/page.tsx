import { Suspense } from "react";
import Hero from "@/features/sections/home/hero";
import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { getVehiculos } from "./actions/vehiculo";
import { getCategories, getBrands, getTransmissions } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import type { VehicleFilters } from "@/types/filters/filters";

interface HomeProps {
  searchParams: Promise<{ marca?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { marca } = await searchParams;

  const filters: VehicleFilters = {
    ...(marca && { marca }),
  };

  const [vehicles, categories, brands, transmissions] = await Promise.all([
    getVehiculos(1, filters),
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
      <WrapperMarquee />
      <AnnouncementGrid />
    </>
  );
}
