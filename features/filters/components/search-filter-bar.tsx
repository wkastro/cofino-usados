"use client";

import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterRemoveIcon } from "@hugeicons/core-free-icons";
import type {
  Brand,
  Category,
  Transmission,
  SearchFilterValues,
} from "@/types/filters/filters";

export interface SearchFilterBarProps {
  brands: Brand[];
  categories: Category[];
  transmissions: Transmission[];
  values: SearchFilterValues;
  hasActiveFilters: boolean;
  onFilterChange: (field: keyof SearchFilterValues, value: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export function SearchFilterBar({
  brands,
  categories,
  transmissions,
  values,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
  className,
}: SearchFilterBarProps) {
  return (
    <div className={cn("relative z-30", className)}>
      <Container>
        <div className="rounded-2xl bg-card p-6 lg:px-8 lg:py-12 border border-border/50">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
            {/* Selects */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
              {/* Categoría */}
              <div className="flex flex-col gap-2">
                <Label className="text-fs-base font-semibold font-clash-display">
                  Tipo de auto
                </Label>
                <Select
                  value={values.categoria}
                  onValueChange={(value) => onFilterChange("categoria", value)}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Marca */}
              <div className="flex flex-col gap-2">
                <Label className="text-fs-base font-semibold font-clash-display">
                  Marca
                </Label>
                <Select
                  value={values.marca}
                  onValueChange={(value) => onFilterChange("marca", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la marca" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {brands.map((brand) => (
                      <SelectItem key={brand.slug} value={brand.slug}>
                        {brand.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmisión */}
              <div className="flex flex-col gap-2">
                <Label className="text-fs-base font-semibold font-clash-display">
                  Transmisión
                </Label>
                <Select
                  value={values.transmision}
                  onValueChange={(value) =>
                    onFilterChange("transmision", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la transmisión" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {transmissions.map((transmission) => (
                      <SelectItem key={transmission.id} value={transmission.id}>
                        {transmission.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 shrink-0">

              <Button
                variant="dark"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className="flex-1 lg:flex-none rounded-full font-semibold"
              >
                <HugeiconsIcon
                  icon={FilterRemoveIcon}
                  data-icon="inline-start"
                  strokeWidth={2}
                  className="size-4"
                />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
