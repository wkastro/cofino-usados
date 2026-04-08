// features/recommendations/actions/recommendations.cached.ts
import { cacheLife, cacheTag } from "next/cache";
import { getHomeRecommendations, getSimilarVehicles } from "./recommendations";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

export async function getCachedHomeRecommendations(
  filters: VehicleFilters = {},
): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("home-recommendations");

  return getHomeRecommendations(filters);
}

export async function getCachedSimilarVehicles(slug: string): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`similar-vehicles-${slug}`);

  return getSimilarVehicles(slug);
}
