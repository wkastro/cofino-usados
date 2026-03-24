export interface Category {
  id: string;
  nombre: string;
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

export interface VehicleFilters {
  marca?: string;
  categoria?: string;
  transmision?: string;
}
