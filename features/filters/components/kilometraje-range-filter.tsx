"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatKilometers } from "@/lib/formatters/vehicle";
import type { RangeValues } from "@/features/filters/types/advanced-filters";

interface KilometrajeRangeFilterProps {
  kilometrajeRange: RangeValues;
  kmin: number;
  kmax: number;
  onSliderChange: (values: number[]) => void;
  onMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function KilometrajeRangeFilter({
  kilometrajeRange,
  kmin,
  kmax,
  onSliderChange,
  onMinChange,
  onMaxChange,
}: KilometrajeRangeFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatKilometers(kmin)}</span>
        <span>{formatKilometers(kmax)}</span>
      </div>

      <Slider
        min={kilometrajeRange.min}
        max={kilometrajeRange.max}
        step={1000}
        value={[kmin, kmax]}
        onValueChange={onSliderChange}
      />

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <span className="text-xs font-semibold">Min</span>
          <Input
            type="text"
            inputMode="numeric"
            value={kmin.toLocaleString("es-GT")}
            onChange={onMinChange}
          />
        </div>
        <span className="mt-4 text-lg font-bold">—</span>
        <div className="flex-1">
          <span className="text-xs font-semibold">Max</span>
          <Input
            type="text"
            inputMode="numeric"
            value={kmax.toLocaleString("es-GT")}
            onChange={onMaxChange}
          />
        </div>
      </div>
    </>
  );
}
