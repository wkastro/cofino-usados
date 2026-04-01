import type { CheckboxOption } from "@/features/filters/types/advanced-filters";

export const COMBUSTIBLE_OPTIONS = [
  { value: "gasolina", label: "Gasolina" },
  { value: "diesel", label: "Diésel" },
  { value: "hibrido", label: "Híbrido" },
  { value: "electrico", label: "Eléctrico" },
] as const satisfies readonly CheckboxOption[];

export type CombustibleValue = (typeof COMBUSTIBLE_OPTIONS)[number]["value"];
