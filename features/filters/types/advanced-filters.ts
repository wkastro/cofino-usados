export interface PriceRange {
  min: number;
  max: number;
}

export interface CheckboxOption {
  value: string;
  label: string;
}

export interface AdvancedFiltersState {
  etiqueta: string;
  combustible: string;
  precioMin: number;
  precioMax: number;
  anioMin: number;
}

export interface UseAdvancedFiltersReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  state: AdvancedFiltersState;
  activeFilterCount: number;
  isPriceModified: boolean;
  isYearModified: boolean;
  setEtiqueta: (value: string) => void;
  setCombustible: (value: string) => void;
  setPrecioMin: (value: number) => void;
  setPrecioMax: (value: number) => void;
  setAnioMin: (value: number) => void;
  handleSliderChange: (values: number[]) => void;
  handleMinInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleYearSliderChange: (values: number[]) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}
