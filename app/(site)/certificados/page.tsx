import { Suspense } from "react";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

interface CertificadosPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CertificadosPage({
  searchParams,
}: CertificadosPageProps) {
  return (
    <FilterLoadingProvider>
      <Suspense>
        <HomeSearchBarContent searchParams={searchParams} className="mt-4" />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
        <VehicleListingGrid
          searchParams={searchParams}
          lockedFilters={{ etiqueta: "autos-certificados" }}
          title="Autos Certificados"
        />
      </Suspense>
    </FilterLoadingProvider>
  );
}
