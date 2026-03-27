import { cacheLife, cacheTag } from "next/cache";
import { getVehicleBySlug, getVehiculos } from "./vehiculo";
import { getCategories, getBrands } from "./filters";
import type { VehicleFilters } from "@/types/filters/filters";
import type { VehicleDetail, VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { CategoriesResult, BrandsResult } from "./filters";

export async function getCachedVehicleBySlug(slug: string): Promise<VehicleDetail | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`vehicle-${slug}`);

  return getVehicleBySlug(slug);
}

export async function getCachedVehiculos(
  page = 1,
  filters: VehicleFilters = {},
): Promise<VehicleResponse> {
  "use cache";
  cacheLife("hours");
  cacheTag("vehicle-list");

  return getVehiculos(page, filters);
}

export async function getCachedCategories(): Promise<CategoriesResult> {
  "use cache";
  cacheLife("weeks");
  cacheTag("categories");

  return getCategories();
}

export async function getCachedBrands(): Promise<BrandsResult> {
  "use cache";
  cacheLife("weeks");
  cacheTag("brands");

  return getBrands();
}
