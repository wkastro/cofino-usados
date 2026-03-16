"use client";

import { useState, useMemo, useCallback } from "react";
import {
  SearchFilterBar,
  type SearchFilterValues,
  type FilterOption,
} from "./search-filter-bar";
import type { VehicleCardProps } from "@/components/global/vehicle-card";

const MARCA_OPTIONS: FilterOption[] = [
  { value: "honda", label: "Honda" },
  { value: "toyota", label: "Toyota" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "ford", label: "Ford" },
  { value: "nissan", label: "Nissan" },
  { value: "kia", label: "Kia" },
  { value: "hyundai", label: "Hyundai" },
  { value: "bmw", label: "BMW" },
  { value: "mercedes-benz", label: "Mercedes-Benz" },
  { value: "volkswagen", label: "Volkswagen" },
  { value: "mazda", label: "Mazda" },
  { value: "audi", label: "Audi" },
  { value: "jeep", label: "Jeep" },
  { value: "peugeot", label: "Peugeot" },
  { value: "renault", label: "Renault" },
  { value: "suzuki", label: "Suzuki" },
  { value: "mitsubishi", label: "Mitsubishi" },
];

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
  vehicles: VehicleCardProps[];
}

export function HomeSearchBar({ vehicles }: HomeSearchBarProps) {
  const [values, setValues] = useState<SearchFilterValues>(INITIAL_VALUES);

  const onFilterChange = useCallback(
    (field: keyof SearchFilterValues, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "marca") {
          next.modelo = "";
        }
        return next;
      });
    },
    [],
  );

  const modeloOptions: FilterOption[] = useMemo(() => {
    if (!values.marca) return [];
    const modelos = new Set<string>();
    vehicles
      .filter((v) => v.marca.toLowerCase() === values.marca)
      .forEach((v) => modelos.add(v.modelo));
    return Array.from(modelos).map((m) => ({
      value: m.toLowerCase().replace(/\s+/g, "-"),
      label: m,
    }));
  }, [values.marca, vehicles]);

  const handleSearch = () => {
    // TODO: conectar con navegacion o filtrado
    console.log("Search with filters:", values);
  };

  return (
    <SearchFilterBar
      marcaOptions={MARCA_OPTIONS}
      modeloOptions={modeloOptions}
      transmisionOptions={TRANSMISION_OPTIONS}
      values={values}
      onFilterChange={onFilterChange}
      onFiltersClick={() => {}}
      onSearch={handleSearch}
      className="-mt-12 md:-mt-8"
    />
  );
}
