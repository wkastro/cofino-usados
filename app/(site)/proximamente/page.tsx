import { Suspense } from "react";
import type { Metadata } from "next";
import { VehicleListingGrid } from "@/features/filters/components/vehicle-listing-grid";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { PROXIMAMENTE_SLUG } from "@/lib/constants/etiqueta-comercial";
import type { SearchParams } from "@/types/filters/filters";

export const metadata: Metadata = {
  title: "Próximamente",
  description:
    "Descubre los vehículos que pronto estarán disponibles en Cofiño Usados. Mantente al tanto de los nuevos ingresos.",
  openGraph: {
    title: "Próximamente | Cofiño Usados",
    description:
      "Descubre los vehículos que pronto estarán disponibles en Cofiño Usados.",
  },
};

const PAGE_TITLE = "Próximamente";

interface ProximamentePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProximamentePage({ searchParams }: ProximamentePageProps) {
  return (
    <Suspense fallback={<VehicleCardSkeletonGrid count={9} title={PAGE_TITLE} />}>
      <VehicleListingGrid
        searchParams={searchParams}
        lockedFilters={{ etiqueta: PROXIMAMENTE_SLUG }}
        title={PAGE_TITLE}
        showFilters={false}
      />
    </Suspense>
  );
}
