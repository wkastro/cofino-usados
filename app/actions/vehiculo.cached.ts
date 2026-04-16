import { cacheLife, cacheTag } from "next/cache";
import { getVehicleBySlug, getVehiculos } from "./vehiculo";
import { getCategories, getBrands, getEtiquetas, getPriceRange, getMinYear, getKilometrajeRange, getTransmissions, getCombustibles } from "@/features/filters/actions/filters";
import type { VehicleFilters } from "@/types/filters/filters";
import type { VehicleDetail, VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { CategoriesResult, BrandsResult, EtiquetasResult, PriceRangeResult, MinYearResult, KilometrajeRangeResult, TransmissionsResult, CombustiblesResult } from "@/features/filters/actions/filters";

export async function getCachedVehicleBySlug(slug: string): Promise<VehicleDetail | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`vehicle-${slug}`);

  return getVehicleBySlug(slug);
}

export async function getCachedVehiculos(
  page = 1,
  filters: VehicleFilters = {},
  pageSize?: number,
): Promise<VehicleResponse> {
  "use cache";
  cacheLife("hours");
  cacheTag("vehicle-list");

  return getVehiculos(page, filters, pageSize);
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

export async function getCachedEtiquetas(): Promise<EtiquetasResult> {
  "use cache";
  cacheLife("weeks");
  cacheTag("etiquetas");

  return getEtiquetas();
}

export async function getCachedPriceRange(): Promise<PriceRangeResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("price-range");

  return getPriceRange();
}

export async function getCachedMinYear(): Promise<MinYearResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("min-year");

  return getMinYear();
}

export async function getCachedKilometrajeRange(): Promise<KilometrajeRangeResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("kilometraje-range");

  return getKilometrajeRange();
}

export async function getCachedTransmissions(): Promise<TransmissionsResult> {
  "use cache";
  cacheLife("weeks");
  cacheTag("transmissions");

  return getTransmissions();
}

export async function getCachedCombustibles(): Promise<CombustiblesResult> {
  "use cache";
  cacheLife("weeks");
  cacheTag("combustibles");

  return getCombustibles();
}
