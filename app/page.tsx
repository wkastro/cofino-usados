import { Suspense } from "react";
import Hero from "@/components/sections/home/hero";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { HomeVehicleGrid } from "@/features/filters/components/home-vehicle-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: HomeProps): Promise<React.ReactElement> {
  return (
    <FilterLoadingProvider>
      {/* Hero is static — renders instantly */}
      <Hero>
        <Suspense>
          <HomeSearchBarContent searchParams={searchParams} className="absolute bottom-6 left-0 right-0 z-30 hola" />
        </Suspense>
      </Hero>

      {/* Vehicle grid streams in */}
      <Suspense fallback={<VehicleCardSkeletonGrid />}>
        <HomeVehicleGrid searchParams={searchParams} />
      </Suspense>

      {/* Static sections */}
      <WrapperMarquee />
      <AnnouncementGrid />
    </FilterLoadingProvider>
  );
}
