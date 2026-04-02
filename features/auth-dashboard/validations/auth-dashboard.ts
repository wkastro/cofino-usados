import * as z from "zod";

export const authDashboardRegisterSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phoneCode: z.string(),
  phone: z.string().min(8, "Ingresa un número de teléfono válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type AuthDashboardRegisterData = z.infer<typeof authDashboardRegisterSchema>;
