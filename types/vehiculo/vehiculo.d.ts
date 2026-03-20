
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
  motor: number;
  anio: number;
  traccion: string;
  color_exterior: string;
  transmision: string;
  combustible: string;
  sucursal: Categoria;
  marca: Categoria;
  categoria: Categoria;
  etiquetas: EtiquetaElement[];
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface EtiquetaElement {
  etiqueta: EtiquetaEtiqueta;
}

export interface EtiquetaEtiqueta {
  nombre: string;
  slug: string;
}

export interface Galeria {
  url: string;
  orden: number;
}
