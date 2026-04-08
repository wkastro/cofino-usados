// features/recommendations/components/similar-vehicles.tsx
import type React from "react";
import { getCachedSimilarVehicles } from "../actions/recommendations.cached";
import { VehicleCard } from "@/components/global/vehicle-card";

interface SimilarVehiclesProps {
  slug: string;
}

export async function SimilarVehicles({
  slug,
}: SimilarVehiclesProps): Promise<React.ReactElement | null> {
  const vehicles = await getCachedSimilarVehicles(slug);

  if (vehicles.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-semibold text-[#111111] mb-10 tracking-tight">
        Vehículos similares
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="w-full flex justify-center">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </section>
  );
}
