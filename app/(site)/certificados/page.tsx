import { Suspense } from "react";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { CertificadosVehicleGrid } from "@/features/certificados/components/certificados-vehicle-grid";
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
        <CertificadosVehicleGrid searchParams={searchParams} />
      </Suspense>
    </FilterLoadingProvider>
  );
}
