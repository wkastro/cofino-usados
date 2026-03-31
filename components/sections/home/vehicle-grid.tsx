"use client";

import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import { AdvancedFiltersButton } from "@/components/global/advanced-filters-button";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { EtiquetaComercial } from "@/types/filters/filters";

interface VehicleGridProps {
  vehicles: VehicleResponse;
  showAdvancedFiltersButton?: boolean;
  etiquetas?: EtiquetaComercial[];
}

export function VehicleGrid({
  vehicles,
  showAdvancedFiltersButton = false,
  etiquetas = [],
}: VehicleGridProps): React.ReactElement {
  const { isPending } = useFilterLoading();

  if (isPending) {
    return <VehicleCardSkeletonGrid />;
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-[#111111] tracking-tight">
            Autos recomendados
          </h2>
          {showAdvancedFiltersButton ? (
            <AdvancedFiltersButton etiquetas={etiquetas} />
          ) : null}
        </div>

        {vehicles.vehiculos.length === 0 ? (
          <NoResults />
        ) : (
          <div
            aria-label="Vehículos disponibles"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          >
            {vehicles.vehiculos.map((vehicle) => (
              <div
                key={vehicle.id}
                className="vehicle-card-item w-full flex justify-center"
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
