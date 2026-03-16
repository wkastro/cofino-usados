"use client";

import {
  VehicleCard,
  VehicleCardProps,
} from "@/components/global/vehicle-card";
import { useVehicleFavorites } from "@/lib/hooks/useVehicleFavorites";

interface VehicleGridProps {
  vehicles: VehicleCardProps[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  const { favorites, toggleFavorite } = useVehicleFavorites(vehicles);

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-[#111111] mb-10 tracking-tight">
          Autos recomendados
        </h2>

        <div
          aria-label="Vehículos disponibles"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        >
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="w-full flex justify-center">
              <VehicleCard
                {...vehicle}
                isFavorito={!!favorites[vehicle.id]}
                onFavoritoToggle={toggleFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
