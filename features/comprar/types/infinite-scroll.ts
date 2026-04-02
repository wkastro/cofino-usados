import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

export interface UseInfiniteVehiclesParams {
  initialData: VehicleResponse;
  pageSize: number;
  filters: VehicleFilters;
}
