import * as z from "zod"

export const registerSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .min(8, "Ingresa un número de teléfono válido")
    .regex(/^\+?\d{8,15}$/, "Formato de teléfono inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/\d/, "Debe contener al menos un número"),
})

export type RegisterInput = z.infer<typeof registerSchema>
