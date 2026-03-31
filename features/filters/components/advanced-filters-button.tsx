"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  useAdvancedFilters,
  CURRENT_YEAR,
} from "@/features/filters/hooks/useAdvancedFilters";
import { COMBUSTIBLE_OPTIONS } from "@/features/filters/constants/advanced-filters";
import { FilterSection } from "@/features/filters/components/filter-section";
import { CheckboxFilter } from "@/features/filters/components/checkbox-filter";
import { PriceRangeFilter } from "@/features/filters/components/price-range-filter";
import { YearFilter } from "@/features/filters/components/year-filter";
import type { EtiquetaComercial } from "@/types/filters/filters";
import type { PriceRange } from "@/features/filters/types/advanced-filters";

interface AdvancedFiltersButtonProps {
  className?: string;
  label?: string;
  etiquetas?: EtiquetaComercial[];
  priceRange?: PriceRange;
  minYear?: number;
}

export function AdvancedFiltersButton({
  className,
  label = "Filtros avanzados",
  etiquetas = [],
  priceRange = { min: 0, max: 1000000 },
  minYear = 2000,
}: AdvancedFiltersButtonProps) {
  const {
    open,
    setOpen,
    state,
    activeFilterCount,
    setEtiqueta,
    setCombustible,
    handleSliderChange,
    handleMinInputChange,
    handleMaxInputChange,
    handleYearSliderChange,
    applyFilters,
    clearFilters,
  } = useAdvancedFilters(priceRange, minYear);

  const etiquetaOptions = etiquetas.map((e) => ({
    value: e.slug,
    label: e.nombre,
  }));

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right" handleOnly>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-full font-semibold", className)}
        >
          {label}
          {activeFilterCount > 0 && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            data-icon="inline-start"
            strokeWidth={2}
            className="size-4"
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtros avanzados</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <FilterSection title="Estado">
            <CheckboxFilter
              options={etiquetaOptions}
              selected={state.etiqueta}
              onChange={setEtiqueta}
            />
          </FilterSection>

          <FilterSection title="Combustible">
            <CheckboxFilter
              options={COMBUSTIBLE_OPTIONS}
              selected={state.combustible}
              onChange={setCombustible}
            />
          </FilterSection>

          <FilterSection title="Precio">
            <PriceRangeFilter
              priceRange={priceRange}
              precioMin={state.precioMin}
              precioMax={state.precioMax}
              onSliderChange={handleSliderChange}
              onMinChange={handleMinInputChange}
              onMaxChange={handleMaxInputChange}
            />
          </FilterSection>

          <FilterSection title="Año">
            <YearFilter
              minYear={minYear}
              maxYear={CURRENT_YEAR}
              value={state.anioMin}
              onSliderChange={handleYearSliderChange}
            />
          </FilterSection>
        </div>

        <DrawerFooter className="flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={clearFilters}
          >
            Limpiar
          </Button>
          <Button className="flex-1" onClick={applyFilters}>
            Aplicar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
