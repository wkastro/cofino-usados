export interface PriceRange {
  min: number;
  max: number;
}

export interface CheckboxOption {
  value: string;
  label: string;
}

export interface RangeValues {
  min: number;
  max: number;
}

export interface AdvancedFiltersState {
  etiqueta: string;
  combustible: string;
  precioMin: number;
  precioMax: number;
  anioMin: number;
  kmin: number;
  kmax: number;
}

export interface UseAdvancedFiltersReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  state: AdvancedFiltersState;
  activeFilterCount: number;
  isPriceModified: boolean;
  isYearModified: boolean;
  isKilometrajeModified: boolean;
  setEtiqueta: (value: string) => void;
  setCombustible: (value: string) => void;
  setPrecioMin: (value: number) => void;
  setPrecioMax: (value: number) => void;
  setAnioMin: (value: number) => void;
  handleSliderChange: (values: number[]) => void;
  handleMinInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleYearSliderChange: (values: number[]) => void;
  handleKilometrajeSliderChange: (values: number[]) => void;
  handleKminInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKmaxInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}
