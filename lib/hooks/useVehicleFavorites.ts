import { useMemo, useState } from "react";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export function useVehicleFavorites(vehicles: Vehiculo[]) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return { favorites, toggleFavorite };
}
