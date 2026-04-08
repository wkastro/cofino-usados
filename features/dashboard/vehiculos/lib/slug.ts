export function generateVehiculoSlug(
  nombre: string,
  marcaNombre: string,
  anio: number,
  placa: string,
): string {
  return `${marcaNombre}-${nombre}-${anio}-${placa}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
