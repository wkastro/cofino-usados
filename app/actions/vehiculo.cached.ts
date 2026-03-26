import { cacheLife, cacheTag } from "next/cache";
import { getVehicleBySlug, getVehiculos } from "./vehiculo";
import { getCategories, getBrands } from "./filters";
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

export async function getCachedCategories() {
  "use cache";
  cacheLife("weeks");
  cacheTag("categories");

  return getCategories();
}

export async function getCachedBrands() {
  "use cache";
  cacheLife("weeks");
  cacheTag("brands");

  return getBrands();
}
