"use client";

import { useState, useCallback } from "react";
import { SearchFilterBar, type SearchFilterValues, type FilterOption } from "./search-filter-bar";

import type { Brands, Category } from "@/types/filters/filters";

const TRANSMISION_OPTIONS: FilterOption[] = [
  { value: "manual", label: "Manual" },
  { value: "automatica", label: "Autom\u00e1tica" },
  { value: "cvt", label: "CVT" },
];

const INITIAL_VALUES: SearchFilterValues = {
  marca: "",
  modelo: "",
  transmision: "",
};

interface HomeSearchBarProps {
  brands: Brands[];
  categories: Category[];
}

export function HomeSearchBar({ brands, categories }: HomeSearchBarProps) {
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

  return (
    <SearchFilterBar
      brands={brands}
      categories={categories}
      transmisionOptions={TRANSMISION_OPTIONS}
      values={values}
      onFilterChange={onFilterChange}
      onFiltersClick={() => {}}
      onSearch={handleSearch}
      className="absolute bottom-6 left-0 right-0 z-30"
    />
  );
}
