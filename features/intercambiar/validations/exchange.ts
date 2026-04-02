import { z } from "zod";

export const exchangeSchema = z.object({
  // Step 1 — Vehicle info
  placa: z.string().min(1, "La placa es requerida"),
  anio: z.string().min(1, "El año es requerido"),
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  kilometraje: z.string().min(1, "El kilometraje es requerido"),
  color: z.string().min(1, "El color es requerido"),
  wantsExchange: z.boolean(),
  exchangeVehicle: z.string().optional(),

  // Step 2 — Contact info
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phoneCode: z.string(),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[\d\s+()-]{7,15}$/, "Ingresa un número de teléfono válido"),
  expectedPrice: z.string().min(1, "El precio de expectativa es requerido"),
});

export type ExchangeFormData = z.infer<typeof exchangeSchema>;

export const EXCHANGE_STEP_1_FIELDS = [
  "placa",
  "anio",
  "marca",
  "modelo",
  "kilometraje",
  "color",
] as const;
