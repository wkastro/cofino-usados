export interface Category {
  id: string;
  nombre: string;
  slug: string;
}
export interface Brand {
  id: string;
  nombre: string;
  slug: string;
}
export interface Transmission {
  id: string;
  nombre: string;
}

export interface EtiquetaComercial {
  id: string;
  nombre: string;
  slug: string;
}

export interface VehicleFilters {
  marca?: string;
  categoria?: string;
  transmision?: string;
  etiqueta?: string;
}

export interface SearchFilterValues {
  marca: string;
  categoria: string;
  transmision: string;
}

export interface SearchParams {
  marca?: string;
  categoria?: string;
  transmision?: string;
  etiqueta?: string;
}
