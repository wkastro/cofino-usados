import type { VehicleFilters, SearchParams } from "@/types/filters/filters";

export function parseSearchParamsToFilters(params: SearchParams): VehicleFilters {
  const precioMin = params["precio-min"];
  const precioMax = params["precio-max"];
  const anioMin = params.anio;

  return {
    ...(params.marca && { marca: params.marca }),
    ...(params.categoria && { categoria: params.categoria }),
    ...(params.transmision && { transmision: params.transmision }),
    ...(params.etiqueta && { etiqueta: params.etiqueta }),
    ...(params.combustible && { combustible: params.combustible }),
    ...(precioMin && { precioMin: Number(precioMin) }),
    ...(precioMax && { precioMax: Number(precioMax) }),
    ...(anioMin && { anio: Number(anioMin) }),
    ...(params.kmin && { kmin: Number(params.kmin) }),
    ...(params.kmax && { kmax: Number(params.kmax) }),
  };
}
