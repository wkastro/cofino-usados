"use client";

import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { LoadMoreIndicator } from "./load-more-indicator";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import { useInfiniteVehicles } from "@/features/comprar/hooks/useInfiniteVehicles";
import { useIntersectionObserver } from "@/features/comprar/hooks/useIntersectionObserver";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

interface InfiniteVehicleGridProps {
  initialData: VehicleResponse;
  pageSize: number;
  filters: VehicleFilters;
  title?: string;
  actions?: React.ReactNode;
}

export function InfiniteVehicleGrid({
  initialData,
  pageSize,
  filters,
  title = "Autos recomendados",
  actions,
}: InfiniteVehicleGridProps) {
  const { isPending } = useFilterLoading();
  const { vehicles, isLoading, hasMore, loadMore } = useInfiniteVehicles({
    initialData,
    pageSize,
    filters,
  });

  const sentinelRef = useIntersectionObserver(loadMore, hasMore && !isLoading);

  if (isPending) {
    return <VehicleCardSkeletonGrid count={pageSize} />;
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-[#111111] tracking-tight">
            {title}
          </h2>
          {actions}
        </div>

        {vehicles.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div
              aria-label="Vehículos disponibles"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
            >
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="vehicle-card-item w-full flex justify-center"
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>

            {isLoading && <LoadMoreIndicator />}

            <div ref={sentinelRef} aria-hidden="true" />
          </>
        )}
      </div>
    </section>
  );
}
