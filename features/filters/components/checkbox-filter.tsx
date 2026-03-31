"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxOption } from "@/features/filters/types/advanced-filters";

interface CheckboxFilterProps {
  options: CheckboxOption[];
  selected: string;
  onChange: (value: string) => void;
}

export function CheckboxFilter({
  options,
  selected,
  onChange,
}: CheckboxFilterProps) {
  return (
    <>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Checkbox
            checked={selected === option.value}
            onCheckedChange={(checked) =>
              onChange(checked ? option.value : "")
            }
          />
          <span className="text-sm text-muted-foreground">{option.label}</span>
        </label>
      ))}
    </>
  );
}
