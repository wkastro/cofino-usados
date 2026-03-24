
export interface VehicleResponse {
  vehiculos: Vehiculo[];
  total: number;
  pages: number;
  page: number;
}

export interface Vehiculo {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  preciosiniva: number;
  kilometraje: number;
  motor: string | null;
  anio: number;
  traccion: string;
  color_exterior: string;
  transmision: string;
  combustible: string;
  sucursal: VehicleRelation;
  marca: VehicleRelation;
  categoria: VehicleRelation;
  etiquetas: VehicleTag[];
}

export interface VehicleRelation {
  id: string;
  nombre: string;
}

export interface VehicleTag {
  etiqueta: TagDetail;
}

export interface TagDetail {
  nombre: string;
  slug: string;
}

export interface VehicleImage {
  id: string;
  url: string;
  orden: number;
}

export interface VehicleDetail extends Vehiculo {
  color_interior: string;
  galeria: VehicleImage[];
}
