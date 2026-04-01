interface BaseEntity {
  id: string;
  nombre: string;
}

interface SlugEntity extends BaseEntity {
  slug: string;
}

export type Category = SlugEntity;
export type Brand = SlugEntity;
export type Transmission = BaseEntity;
export type EtiquetaComercial = SlugEntity;

export interface VehicleFilters {
  marca?: string;
  categoria?: string;
  transmision?: string;
  etiqueta?: string;
  combustible?: string;
  precioMin?: number;
  precioMax?: number;
  anio?: number;
  kmin?: number;
  kmax?: number;
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
  combustible?: string;
  "precio-min"?: string;
  "precio-max"?: string;
  anio?: string;
  kmin?: string;
  kmax?: string;
}
