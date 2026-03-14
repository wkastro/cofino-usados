export function formatCurrency(value: number) {
  return `Q${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatKilometers(value: number) {
  return `${new Intl.NumberFormat("en-US").format(value)} km`;
}

export function formatBlindaje(blindaje: string | boolean) {
  if (typeof blindaje === "boolean") {
    return blindaje ? "Blindado" : "Sin blindaje";
  }
  return blindaje;
}
