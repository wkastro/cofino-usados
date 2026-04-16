import { z } from "zod"

export const clasificacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
})

export type ClasificacionInput = z.infer<typeof clasificacionSchema>
