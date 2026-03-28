"use client";

import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";

interface VehicleGridProps {
  vehicles: VehicleResponse;
}

export function VehicleGrid({ vehicles }: VehicleGridProps): React.ReactElement {
  const { isPending } = useFilterLoading();

  if (isPending) {
    return <VehicleCardSkeletonGrid />;
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-[#111111] mb-10 tracking-tight">
          Autos recomendados
        </h2>

        {vehicles.vehiculos.length === 0 ? (
          <NoResults />
        ) : (
          <div
            aria-label="Vehículos disponibles"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          >
            {vehicles.vehiculos.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card-item w-full flex justify-center">
                <VehicleCard vehicle={vehicle}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
