import { z } from "zod/v4";

export const purchaseSchema = z.object({
  paymentMethod: z.enum(["card", "transfer"]),
  cardNumber: z.string().min(16, "Ingresa un numero de tarjeta valido"),
  cardName: z.string().min(3, "Ingresa el nombre en la tarjeta"),
  expMonth: z.string().min(1, "Requerido"),
  expYear: z.string().min(4, "Requerido"),
  cvv: z.string().min(3, "CVV invalido").max(4),
  nit: z.string().min(1, "Ingresa el NIT o CF"),
  acceptTerms: z.literal(true, { message: "Debes aceptar los terminos" }),
  acceptNoRefund: z.literal(true, { message: "Debes aceptar esta condicion" }),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;

export const CARD_FIELDS = [
  "cardNumber",
  "cardName",
  "expMonth",
  "expYear",
  "cvv",
] as const;
