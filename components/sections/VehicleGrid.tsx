"use client";

import { useState } from "react";
import { VehicleCard, VehicleCardProps } from "@/components/global/vehicle-card";

interface VehicleGridProps {
  vehicles: VehicleCardProps[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  // Inicializamos el estado local de favoritos a partir de los datos recibidos
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>(() => {
    const initialState: Record<string | number, boolean> = {};
    vehicles.forEach((vehicle) => {
      if (vehicle.isFavorito !== undefined) {
        initialState[vehicle.id] = vehicle.isFavorito;
      }
    });
    return initialState;
  });

  const handleFavoritoToggle = (id: string | number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="w-full bg-[#F9F9F9] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[1.75rem] md:text-3xl font-bold text-[#111111] mb-10 tracking-tight">
          Vehículos Destacados
        </h2>
        
        <div 
          aria-label="Vehículos disponibles" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center"
        >
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="w-full flex justify-center">
              <VehicleCard
                {...vehicle}
                isFavorito={!!favorites[vehicle.id]}
                onFavoritoToggle={handleFavoritoToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
