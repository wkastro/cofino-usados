"use client";

import { SearchFilterBar } from "./search-filter-bar";
import { useSearchFilters } from "../hooks/useSearchFilters";
import type { Brand, Category, Transmission } from "@/types/filters/filters";

interface HomeSearchBarProps {
  brands: Brand[];
  categories: Category[];
  transmissions: Transmission[];
}

export function HomeSearchBar({ brands, categories, transmissions }: HomeSearchBarProps) {
  const { values, onFilterChange, handleSearch, handleFiltersClick } = useSearchFilters();

  return (
    <SearchFilterBar
      brands={brands}
      categories={categories}
      transmissions={transmissions}
      values={values}
      onFilterChange={onFilterChange}
      onFiltersClick={handleFiltersClick}
      onSearch={handleSearch}
      className="absolute bottom-6 left-0 right-0 z-30"
    />
  );
}
