import type { Vehiculo, VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

export interface UseInfiniteVehiclesParams {
  initialData: VehicleResponse;
  pageSize: number;
  filters: VehicleFilters;
}

export interface InfiniteVehiclesState {
  vehicles: Vehiculo[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}
