import { z } from "zod/v4";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const purchaseSchema = z
  .object({
    paymentMethod: z.enum(["card", "transfer"]),
    // Card fields
    cardNumber: z.string(),
    cardName: z.string(),
    expMonth: z.string(),
    expYear: z.string(),
    cvv: z.string(),
    nit: z.string(),
    // Transfer fields
    bankName: z.string(),
    accountNumber: z.string(),
    authNumber: z.string(),
    receipt: z
      .union([z.instanceof(File), z.undefined()])
      .optional(),
    // Shared
    acceptTerms: z.literal(true, { message: "Debes aceptar los terminos" }),
    acceptNoRefund: z.literal(true, {
      message: "Debes aceptar esta condicion",
    }),
  })
  .superRefine((data, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ path: [path], code: "custom", message });

    if (data.paymentMethod === "card") {
      if (data.cardNumber.length < 16) issue("cardNumber", "Ingresa un numero de tarjeta valido");
      if (data.cardName.length < 3) issue("cardName", "Ingresa el nombre en la tarjeta");
      if (!data.expMonth) issue("expMonth", "Requerido");
      if (!data.expYear) issue("expYear", "Requerido");
      if (data.cvv.length < 3 || data.cvv.length > 4) issue("cvv", "CVV invalido");
      if (!data.nit) issue("nit", "Ingresa el NIT o CF");
    }

    if (data.paymentMethod === "transfer") {
      if (data.bankName.length < 2) issue("bankName", "Ingresa el nombre del banco");
      if (data.accountNumber.length < 5) issue("accountNumber", "Ingresa el numero de cuenta");
      if (data.authNumber.length < 3) issue("authNumber", "Ingresa el numero de autorizacion");
      if (!data.receipt) {
        issue("receipt", "Sube tu recibo de transferencia");
      } else {
        if (data.receipt.size > MAX_FILE_SIZE) issue("receipt", "El archivo no debe superar 5MB");
        if (!ACCEPTED_FILE_TYPES.includes(data.receipt.type)) issue("receipt", "Solo se aceptan archivos JPG, PNG o PDF");
      }
    }
  });

export type PurchaseFormData = z.infer<typeof purchaseSchema>;

export const CARD_FIELDS = [
  "cardNumber",
  "cardName",
  "expMonth",
  "expYear",
  "cvv",
] as const;

export const TRANSFER_FIELDS = [
  "bankName",
  "accountNumber",
  "authNumber",
  "receipt",
] as const;
