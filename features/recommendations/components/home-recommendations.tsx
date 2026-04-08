// features/recommendations/components/home-recommendations.tsx
import type React from "react";
import { getCachedHomeRecommendations } from "../actions/recommendations.cached";
import { VehicleCard } from "@/components/global/vehicle-card";
import { Container } from "@/components/layout/container";

export async function HomeRecommendations(): Promise<React.ReactElement | null> {
  const vehicles = await getCachedHomeRecommendations();

  if (vehicles.length === 0) return null;

  return (
    <section className="w-full py-12">
      <Container>
        <h2 className="font-semibold text-[#111111] mb-10 tracking-tight">
          Vehículos destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="w-full flex justify-center">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
