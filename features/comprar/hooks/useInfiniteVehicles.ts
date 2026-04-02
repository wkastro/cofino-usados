"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getVehiculos } from "@/app/actions/vehiculo";
import type { UseInfiniteVehiclesParams } from "@/features/comprar/types/infinite-scroll";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export function useInfiniteVehicles({
  initialData,
  pageSize,
  filters,
}: UseInfiniteVehiclesParams) {
  const [vehicles, setVehicles] = useState<Vehiculo[]>(initialData.vehiculos);
  const [hasMore, setHasMore] = useState(initialData.page < initialData.pages);
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef(initialData.page);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    setVehicles(initialData.vehiculos);
    setHasMore(initialData.page < initialData.pages);
    pageRef.current = initialData.page;
  }, [initialData]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const response = await getVehiculos(nextPage, filters, pageSize);

      setVehicles((prev) => [...prev, ...response.vehiculos]);
      pageRef.current = nextPage;
      setHasMore(nextPage < response.pages);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, pageSize, filters]);

  return { vehicles, isLoading, hasMore, loadMore };
}
