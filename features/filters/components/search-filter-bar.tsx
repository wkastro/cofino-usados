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
import { FilterHorizontalIcon, Car05Icon } from "@hugeicons/core-free-icons";
import type { Brands, Category } from "@/types/filters/filters";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilterValues {
  marca: string;
  modelo: string;
  transmision: string;
}

export interface SearchFilterBarProps {
  brands: Brands[];
  categories: Category[];
  transmisionOptions: FilterOption[];
  values: SearchFilterValues;
  onFilterChange: (field: keyof SearchFilterValues, value: string) => void;
  onFiltersClick?: () => void;
  onSearch: () => void;
  className?: string;
}

export function SearchFilterBar({
  brands,
  categories,
  transmisionOptions,
  values,
  onFilterChange,
  onFiltersClick,
  onSearch,
  className,
}: SearchFilterBarProps) {
  return (
    <section className={cn("relative z-30", className)}>
      <Container>
        <div className="rounded-2xl bg-card p-6 lg:px-8 lg:py-12 border border-border/50">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
            {/* Selects */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
              {/* Marca */}
              <div className="flex flex-col gap-2">
                <Label className="text-fs-base font-semibold font-clash-display">Marca</Label>
                <Select
                  value={values.marca}
                  onValueChange={(v) => onFilterChange("marca", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la marca" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <Label className="text-fs-base font-semibold font-clash-display">Tipo de auto</Label>
                <Select
                  value={values.modelo}
                  onValueChange={(v) => onFilterChange("modelo", v)}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmision */}
              <div className="flex flex-col gap-2">
                <Label className="text-fs-base font-semibold font-clash-display">
                  Transmisi&oacute;n
                </Label>
                <Select
                  value={values.transmision}
                  onValueChange={(v) => onFilterChange("transmision", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la transmisi&oacute;n" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {transmisionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {onFiltersClick && (
                <Button variant="outline" onClick={onFiltersClick}
                className="rounded-lg"
                >
                  <HugeiconsIcon
                    icon={FilterHorizontalIcon}
                    data-icon="inline-start"
                    strokeWidth={2}
                    className="size-4"
                  />
                  Filtros
                </Button>
              )}

              <Button
                variant="dark"
                onClick={onSearch}
                className="flex-1 lg:flex-none rounded-lg"
              >
                <HugeiconsIcon
                  icon={Car05Icon}
                  data-icon="inline-start"
                  strokeWidth={2}
                  className="size-4"
                />
                &iexcl;Encontrar mi auto!
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
