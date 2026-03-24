"use client";

import { SearchFilterBar } from "./search-filter-bar";
import { useHomeSearchBar } from "../hooks/useHomeSearchBar";
import type { Brands, Category, Transmision } from "@/types/filters/filters";

interface HomeSearchBarProps {
  brands: Brands[];
  categories: Category[];
  transmisions: Transmision[];
}

export function HomeSearchBar({ brands, categories, transmisions }: HomeSearchBarProps) {
  const { values, onFilterChange, handleSearch, handleFiltersClick } = useHomeSearchBar();

  return (
    <SearchFilterBar
      brands={brands}
      categories={categories}
      transmisions={transmisions}
      values={values}
      onFilterChange={onFilterChange}
      onFiltersClick={handleFiltersClick}
      onSearch={handleSearch}
      className="absolute bottom-6 left-0 right-0 z-30"
    />
  );
}
