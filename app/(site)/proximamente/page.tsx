import { Suspense } from "react";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { PROXIMAMENTE_SLUG } from "@/lib/constants/etiqueta-comercial";
import type { SearchParams } from "@/types/filters/filters";

interface ProximamentePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProximamentePage({ searchParams }: ProximamentePageProps) {
  return (
    <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
      <VehicleListingGrid
        searchParams={searchParams}
        lockedFilters={{ etiqueta: PROXIMAMENTE_SLUG }}
        title="Próximamente"
        showFilters={false}
      />
    </Suspense>
  );
}
