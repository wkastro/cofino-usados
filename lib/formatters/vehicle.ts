// js-cache-function-results: hoist Intl.NumberFormat instances to module level
const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number): string {
  return `Q${currencyFormatter.format(value)}`;
}

export function formatKilometers(value: number): string {
  return `${numberFormatter.format(value)} km`;
}

export function formatMotor(motor: string | null): string {
  // js-early-exit: return early for null case
  if (!motor) return "N/A";
  return `${(parseFloat(motor) / 1000).toFixed(1)}L`;
}

export function formatBlindaje(blindaje: string | boolean): string {
  if (typeof blindaje === "boolean") {
    return blindaje ? "Blindado" : "Sin blindaje";
  }
  return blindaje;
}
