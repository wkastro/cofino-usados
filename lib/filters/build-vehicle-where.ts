import type { VehicleFilters } from "@/types/filters/filters";

export const NOT_FACTURADO = { estadoVenta: { slug: { not: "facturado" } } } as const;

export function buildFilterWhere(filters: VehicleFilters) {
  return {
    estadoVenta: { slug: { not: "facturado" } },
    ...(filters.etiqueta && { etiquetaComercial: { slug: filters.etiqueta } }),
    ...(filters.marca && { marca: { slug: filters.marca } }),
    ...(filters.categoria && { categoria: { slug: filters.categoria } }),
    ...(filters.transmision && { transmision: { slug: filters.transmision } }),
    ...(filters.combustible && { combustible: { slug: filters.combustible } }),
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
