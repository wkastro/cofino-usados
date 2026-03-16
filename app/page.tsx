import Hero from "@/features/sections/home/hero";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import { VehicleGrid } from "@/components/sections/VehicleGrid";
import { VehicleCardProps } from "@/components/global/vehicle-card";
import demoCarsData from "@/lib/data/cars.json";

export default function Home() {
  const vehicles: VehicleCardProps[] = demoCarsData as VehicleCardProps[];

  return (
    <>
      <Hero />
      <HomeSearchBar vehicles={vehicles} />
      <VehicleGrid vehicles={vehicles} />
    </>
  );
}
