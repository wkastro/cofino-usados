"use server";

import { getVehiculos } from "./vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";

export async function fetchMoreVehicles(
  page: number,
  pageSize: number,
  filters: VehicleFilters = {},
): Promise<VehicleResponse> {
  return getVehiculos(page, filters, pageSize);
}
