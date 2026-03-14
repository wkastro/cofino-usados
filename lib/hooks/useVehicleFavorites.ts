import { useMemo, useState } from "react";
import type { VehicleCardProps } from "@/components/global/vehicle-card";

export function useVehicleFavorites(vehicles: VehicleCardProps[]) {
  const baseFavorites = useMemo(() => {
    const initialState: Record<string | number, boolean> = {};
    vehicles.forEach((vehicle) => {
      if (vehicle.isFavorito !== undefined) {
        initialState[vehicle.id] = vehicle.isFavorito;
      }
    });
    return initialState;
  }, [vehicles]);

  const [overrides, setOverrides] = useState<Record<string | number, boolean>>({});

  const favorites = useMemo(
    () => ({ ...baseFavorites, ...overrides }),
    [baseFavorites, overrides]
  );

  const toggleFavorite = (id: string | number) => {
    setOverrides((prev) => ({
      ...prev,
      [id]: !favorites[id],
    }));
  };

  return { favorites, toggleFavorite };
}
