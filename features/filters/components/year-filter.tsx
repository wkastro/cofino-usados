"use client";

import { Slider } from "@/components/ui/slider";

interface YearFilterProps {
  minYear: number;
  maxYear: number;
  value: number;
  onSliderChange: (values: number[]) => void;
}

export function YearFilter({
  minYear,
  maxYear,
  value,
  onSliderChange,
}: YearFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{value}</span>
        <span>{maxYear}</span>
      </div>

      <Slider
        min={minYear}
        max={maxYear}
        step={1}
        value={[value]}
        onValueChange={onSliderChange}
      />
    </>
  );
}
