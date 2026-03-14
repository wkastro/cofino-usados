import * as z from "zod";

export const authUserRegisterSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phoneCode: z.string().min(1, "Selecciona un código"),
  phone: z.string().min(8, "Ingresa un número de teléfono válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/\d/, "Debe contener al menos un número"),
});

export const authUserLoginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type AuthUserRegisterData = z.infer<typeof authUserRegisterSchema>;
export type AuthUserLoginData = z.infer<typeof authUserLoginSchema>;
