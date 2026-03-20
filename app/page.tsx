import Hero from "@/features/sections/home/hero";
import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { getVehiculos } from "./actions/vehiculo";
import { getCategorias, getMarcas } from "./actions/filters";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";


export default async function Home() {
  const vehicles = await getVehiculos();
  const categories = await getCategorias();
  const brands = await getMarcas();
  
  return (
    <>
      <Hero />
      <VehicleGrid vehicles={vehicles} />
      <WrapperMarquee />
      <AnnouncementGrid />
    </>
  );
}
