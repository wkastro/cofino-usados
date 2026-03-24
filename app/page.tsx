import Hero from "@/features/sections/home/hero";
import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { getVehiculos } from "./actions/vehiculo";
import { getCategorias, getMarcas, getTransmisiones } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";


export default async function Home() {
  const [vehicles, categories, brands, transmitions] = await Promise.all([
    getVehiculos(),
    getCategorias(),
    getMarcas(),
    getTransmisiones(),
  ]);
  return (
    <>
      <Hero>
        <HomeSearchBar brands={brands} categories={categories} transmisions={transmitions} />
      </Hero>
      <VehicleGrid vehicles={vehicles} />
      <WrapperMarquee />
      <AnnouncementGrid />
    </>
  );
}
