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
  title: "Comprar Vehículos",
  description:
    "Explora nuestro catálogo de vehículos seminuevos certificados. Filtra por marca, categoría, transmisión y precio. Financiamiento disponible.",
  openGraph: {
    title: "Comprar Vehículos | Cofiño Usados",
    description:
      "Explora nuestro catálogo de vehículos seminuevos certificados. Filtra por marca, categoría, transmisión y precio.",
  },
};

const LISTING_TITLE = "Autos recomendados";

interface BuyPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  return (
    <FilterLoadingProvider>
      <Suspense fallback={<SearchBarSkeleton />}>
        <HomeSearchBarContent searchParams={searchParams} className="mt-4" />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={9} title={LISTING_TITLE} />}>
        <VehicleListingGrid searchParams={searchParams} title={LISTING_TITLE} />
      </Suspense>
    </FilterLoadingProvider>
  );
}
