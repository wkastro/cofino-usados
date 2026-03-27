import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import type { SearchFilterValues } from "@/types/filters/filters";

interface UseSearchFiltersReturn {
  values: SearchFilterValues;
  hasActiveFilters: boolean;
  onFilterChange: (field: keyof SearchFilterValues, value: string) => void;
  clearFilters: () => void;
  handleFiltersClick: () => void;
}

export function useSearchFilters(): UseSearchFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition } = useFilterLoading();

  const values: SearchFilterValues = {
    marca: searchParams.get("marca") ?? "",
    categoria: searchParams.get("categoria") ?? "",
    transmision: searchParams.get("transmision") ?? "",
  };

  const hasActiveFilters = Boolean(
    values.marca || values.categoria || values.transmision,
  );

  const onFilterChange = useCallback(
    (field: keyof SearchFilterValues, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(field, value);
      } else {
        params.delete(field);
      }

      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push("/", { scroll: false });
    });
  }, [router, startTransition]);

  const handleFiltersClick = useCallback(() => {
    // TODO: abrir panel de filtros avanzados
  }, []);

  return {
    values,
    hasActiveFilters,
    onFilterChange,
    clearFilters,
    handleFiltersClick,
  };
}
