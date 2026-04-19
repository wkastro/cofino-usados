import { Suspense } from "react";
import type { Metadata } from "next";
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import {
  VehicleCardSkeletonGrid,
  SearchBarSkeleton,
} from "@/components/global/vehicle-card-skeleton";
import { FilterLoadingProvider } from "@/features/filters/context/filter-loading-context";
import type { SearchParams } from "@/types/filters/filters";

export const metadata: Metadata = {
  title: "Autos Certificados",
  description:
    "Descubre nuestra selección de autos certificados. Vehículos seminuevos inspeccionados y garantizados. Filtra por marca, precio y más.",
  openGraph: {
    title: "Autos Certificados | Cofiño Usados",
    description:
      "Descubre nuestra selección de autos certificados. Vehículos seminuevos inspeccionados y garantizados.",
  },
};

const LISTING_TITLE = "Autos Certificados";

interface CertificadosPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CertificadosPage({
  searchParams,
}: CertificadosPageProps) {
  return (
    <FilterLoadingProvider>
      <Suspense fallback={<SearchBarSkeleton />}>
        <HomeSearchBarContent searchParams={searchParams} className="mt-4" />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={9} title={LISTING_TITLE} />}>
        <VehicleListingGrid
          searchParams={searchParams}
          lockedFilters={{ etiqueta: "autos-certificados" }}
          title={LISTING_TITLE}
        />
      </Suspense>
    </FilterLoadingProvider>
  );
}
