import { Suspense } from "react";
import Hero from "@/features/sections/home/hero";
import AnnouncementGrid from "@/components/sections/home/announcement-grid";
import WrapperMarquee from "@/components/sections/home/wrapper-marquee";
import { HomeSearchBarContent, HomeVehicleGrid } from "./home-content";
import type { SearchParams } from "@/types/filters/filters";

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: HomeProps): Promise<React.ReactElement> {
  return (
    <>
      {/* Hero is static — renders instantly */}
      <Hero>
        <Suspense>
          <HomeSearchBarContent searchParams={searchParams} />
        </Suspense>
      </Hero>

      {/* Vehicle grid streams in */}
      <Suspense>
        <HomeVehicleGrid searchParams={searchParams} />
      </Suspense>

      {/* Static sections */}
      <WrapperMarquee />
      <AnnouncementGrid />
    </>
  );
}
