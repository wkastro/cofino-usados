import { EstadoVenta, Transmision, Combustible } from "@/generated/prisma/client";
import type { VehicleFilters } from "@/types/filters/filters";

export const NOT_FACTURADO = { not: EstadoVenta.Facturado } as const;

const TRANSMISION_MAP: Record<string, Transmision> = {
  automatico: Transmision.Automatico,
  manual: Transmision.Manual,
};

const COMBUSTIBLE_MAP: Record<string, Combustible> = {
  gasolina: Combustible.Gasolina,
  diesel: Combustible.Diesel,
  hibrido: Combustible.Hibrido,
  electrico: Combustible.Electrico,
};

export function buildFilterWhere(filters: VehicleFilters) {
  const transmision = filters.transmision ? TRANSMISION_MAP[filters.transmision] : undefined;
  const combustible = filters.combustible ? COMBUSTIBLE_MAP[filters.combustible] : undefined;

  return {
    estado: NOT_FACTURADO,
    ...(filters.etiqueta && { etiquetaComercial: { slug: filters.etiqueta } }),
    ...(filters.marca && { marca: { slug: filters.marca } }),
    ...(filters.categoria && { categoria: { slug: filters.categoria } }),
    ...(transmision && { transmision }),
    ...(combustible && { combustible }),
    ...(filters.anio != null && { anio: { gte: filters.anio } }),
    ...((filters.kmin != null || filters.kmax != null) && {
      kilometraje: {
        ...(filters.kmin != null && { gte: filters.kmin }),
        ...(filters.kmax != null && { lte: filters.kmax }),
      },
    }),
    ...((filters.precioMin != null || filters.precioMax != null) && {
      precio: {
        ...(filters.precioMin != null && { gte: filters.precioMin }),
        ...(filters.precioMax != null && { lte: filters.precioMax }),
      },
    }),
  };
}
