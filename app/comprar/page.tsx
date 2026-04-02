import { Suspense } from "react";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { ComprarVehicleGrid } from "@/features/comprar/components/comprar-vehicle-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

interface BuyPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  return (
    <FilterLoadingProvider>
      <Suspense>
        <HomeSearchBarContent searchParams={searchParams} className="mt-4" />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
        <ComprarVehicleGrid searchParams={searchParams} />
      </Suspense>
    </FilterLoadingProvider>
  );
}
