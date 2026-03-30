"use client";

import { SearchFilterBar } from "./search-filter-bar";
import { useSearchFilters } from "../hooks/useSearchFilters";
import type { Brand, Category, Transmission } from "@/types/filters/filters";

interface HomeSearchBarProps {
  brands: Brand[];
  categories: Category[];
  transmissions: Transmission[];
  className?: string;
}

export function HomeSearchBar({ brands, categories, transmissions, className }: HomeSearchBarProps) {
  const { values, hasActiveFilters, onFilterChange, clearFilters, handleFiltersClick } = useSearchFilters();

  return (
    <SearchFilterBar
      brands={brands}
      categories={categories}
      transmissions={transmissions}
      values={values}
      hasActiveFilters={hasActiveFilters}
      onFilterChange={onFilterChange}
      onFiltersClick={handleFiltersClick}
      onClearFilters={clearFilters}
      className={className}
    />
  );
}
