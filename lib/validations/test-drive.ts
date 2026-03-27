import { z } from "zod";

export const testDriveSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phoneCode: z.string().min(1, "Selecciona un código"),
  phone: z
    .string()
    .min(8, "Ingresa un número de teléfono válido")
    .regex(/^[\d\s+()-]{7,15}$/, "Formato de teléfono inválido"),
  contactMethod: z.string().min(1, "Selecciona un método de contacto"),
  testDriveType: z.string().min(1, "Selecciona el tipo de prueba"),
  testDate: z.date({ message: "Selecciona una fecha" }),
  startTime: z.string().min(1, "Selecciona hora de inicio"),
  endTime: z.string().min(1, "Selecciona hora de fin"),
  branch: z.string().min(1, "Selecciona una sucursal"),
  acceptContact: z.literal(true, {
    message: "Debes aceptar ser contactado",
  }),
});

export type TestDriveFormData = z.infer<typeof testDriveSchema>;
