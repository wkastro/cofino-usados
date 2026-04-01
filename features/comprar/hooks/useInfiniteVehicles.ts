"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchMoreVehicles } from "@/app/actions/comprar";
import type { UseInfiniteVehiclesParams } from "@/features/comprar/types/infinite-scroll";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export function useInfiniteVehicles({
  initialData,
  pageSize,
  filters,
}: UseInfiniteVehiclesParams) {
  const [vehicles, setVehicles] = useState<Vehiculo[]>(initialData.vehiculos);
  const [page, setPage] = useState(initialData.page);
  const [hasMore, setHasMore] = useState(initialData.page < initialData.pages);
  const [isLoading, setIsLoading] = useState(false);

  // Reset when server re-renders with new initial data (filter change)
  useEffect(() => {
    setVehicles(initialData.vehiculos);
    setPage(initialData.page);
    setHasMore(initialData.page < initialData.pages);
  }, [initialData]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetchMoreVehicles(nextPage, pageSize, filters);

      setVehicles((prev) => [...prev, ...response.vehiculos]);
      setPage(nextPage);
      setHasMore(nextPage < response.pages);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, pageSize, filters]);

  return { vehicles, isLoading, hasMore, loadMore };
}
