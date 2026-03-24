import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SearchFilterValues } from "../components/search-filter-bar";

export function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const values: SearchFilterValues = {
    marca: searchParams.get("marca") ?? "",
    modelo: searchParams.get("modelo") ?? "",
    transmision: searchParams.get("transmision") ?? "",
  };

  const onFilterChange = useCallback(
    (field: keyof SearchFilterValues, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(field, value);
      } else {
        params.delete(field);
      }

      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearch = useCallback(() => {
    // Filters are already applied via URL params on change
    // This can be used for explicit search navigation in the future
  }, []);

  const handleFiltersClick = useCallback(() => {
    // TODO: abrir panel de filtros avanzados
  }, []);

  return {
    values,
    onFilterChange,
    handleSearch,
    handleFiltersClick,
  };
}
