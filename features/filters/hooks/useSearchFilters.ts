import { useState, useCallback } from "react";
import type { SearchFilterValues } from "../components/search-filter-bar";

const INITIAL_VALUES: SearchFilterValues = {
  marca: "",
  modelo: "",
  transmision: "",
};

export function useSearchFilters() {
  const [values, setValues] = useState<SearchFilterValues>(INITIAL_VALUES);

  const onFilterChange = useCallback(
    (field: keyof SearchFilterValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSearch = () => {
    // TODO: conectar con navegacion o filtrado
    console.log("Search with filters:", values);
  };

  const handleFiltersClick = () => {
    // TODO: abrir panel de filtros avanzados
  };

  return {
    values,
    onFilterChange,
    handleSearch,
    handleFiltersClick,
  };
}
