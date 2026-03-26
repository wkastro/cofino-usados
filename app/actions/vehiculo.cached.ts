import { cacheLife, cacheTag } from "next/cache";
import { getVehicleBySlug, getVehiculos } from "./vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

export async function getCachedVehicleBySlug(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`vehicle-${slug}`);

  return getVehicleBySlug(slug);
}

export async function getCachedVehiculos(
  page = 1,
  filters: VehicleFilters = {},
) {
  "use cache";
  cacheLife("hours");
  cacheTag("vehicle-list");

  return getVehiculos(page, filters);
}
