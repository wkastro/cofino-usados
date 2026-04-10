
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
  preciodescuento: number | null;
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
  etiquetaComercial: EtiquetaComercialDetail | null;
}

export interface VehicleRelation {
  id: string;
  nombre: string;
}

export interface EtiquetaComercialDetail {
  nombre: string;
  slug: string;
}

export interface VehicleImage {
  id: string;
  url: string;
  orden: number;
}

export interface VehicleDetail extends Vehiculo {
  descripcion: string | null;
  color_interior: string;
  galeria: VehicleImage[];
}
