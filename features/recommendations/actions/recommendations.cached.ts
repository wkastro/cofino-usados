// features/recommendations/actions/recommendations.cached.ts
import { cacheLife, cacheTag } from "next/cache";
import { getHomeRecommendations, getSimilarVehicles } from "./recommendations";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export async function getCachedHomeRecommendations(): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("home-recommendations");

  return getHomeRecommendations();
}

export async function getCachedSimilarVehicles(slug: string): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`similar-vehicles-${slug}`);

  return getSimilarVehicles(slug);
}
