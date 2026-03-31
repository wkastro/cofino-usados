"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatters/vehicle";
import type { PriceRange } from "@/features/filters/types/advanced-filters";

interface PriceRangeFilterProps {
  priceRange: PriceRange;
  precioMin: number;
  precioMax: number;
  onSliderChange: (values: number[]) => void;
  onMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PriceRangeFilter({
  priceRange,
  precioMin,
  precioMax,
  onSliderChange,
  onMinChange,
  onMaxChange,
}: PriceRangeFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatCurrency(precioMin)}</span>
        <span>{formatCurrency(precioMax)}</span>
      </div>

      <Slider
        min={priceRange.min}
        max={priceRange.max}
        step={1000}
        value={[precioMin, precioMax]}
        onValueChange={onSliderChange}
      />

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <span className="text-xs font-semibold">Min</span>
          <Input
            type="text"
            inputMode="numeric"
            value={`Q${precioMin.toLocaleString("es-GT")}`}
            onChange={onMinChange}
          />
        </div>
        <span className="mt-4 text-lg font-bold">—</span>
        <div className="flex-1">
          <span className="text-xs font-semibold">Max</span>
          <Input
            type="text"
            inputMode="numeric"
            value={`Q${precioMax.toLocaleString("es-GT")}`}
            onChange={onMaxChange}
          />
        </div>
      </div>
    </>
  );
}
