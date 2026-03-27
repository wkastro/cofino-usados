export function formatCurrency(value: number): string {
  return `Q${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatKilometers(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} km`;
}

export function formatMotor(motor: string | null): string {
  if (!motor) return "N/A";
  return `${(parseFloat(motor) / 1000).toFixed(1)}L`;
}

export function formatBlindaje(blindaje: string | boolean): string {
  if (typeof blindaje === "boolean") {
    return blindaje ? "Blindado" : "Sin blindaje";
  }
  return blindaje;
}
