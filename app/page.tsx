import Hero from "@/features/sections/home/hero";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import { VehicleGrid } from "@/components/sections/home/vehicle-grid";
import { VehicleCardProps } from "@/components/global/vehicle-card";

import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import demoCarsData from "@/lib/data/cars.json";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";


export default function Home() {
  const vehicles: VehicleCardProps[] = demoCarsData as VehicleCardProps[];
  const list = vehicles.slice(0, 6);

  return (
    <>
      <Hero>
        <HomeSearchBar vehicles={list} />
      </Hero>
      <VehicleGrid vehicles={list} />
      <WrapperMarquee/>
      <AnnouncementGrid />
    </>
  );
}
