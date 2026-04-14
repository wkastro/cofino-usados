"use client";

import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
import Link from "next/link";

interface VehicleGridProps {
  vehicles: VehicleResponse;
  actions?: React.ReactNode;
}

export function VehicleGrid({
  vehicles,
  actions,
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
          {actions}
        </div>

        {vehicles.vehiculos.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div
              aria-label="Vehículos disponibles"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-8 md:mb-16"
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
            <div className="text-center">
              <Link href="/comprar" className="bg-btn-black inline-block">
                Ver más vehículos
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
