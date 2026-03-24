import Hero from "@/features/sections/home/hero";
import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { getVehiculos } from "./actions/vehiculo";
import { getCategories, getBrands, getTransmissions } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";


export default async function Home() {
  const [vehicles, categories, brands, transmissions] = await Promise.all([
    getVehiculos(),
    getCategories(),
    getBrands(),
    getTransmissions(),
  ]);
  return (
    <>
      <Hero>
        <HomeSearchBar brands={brands} categories={categories} transmissions={transmissions} />
      </Hero>
      <VehicleGrid vehicles={vehicles} />
      <WrapperMarquee />
      <AnnouncementGrid />
    </>
  );
}
