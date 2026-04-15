import { z } from "zod"

export const especificacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
})

export type EspecificacionInput = z.infer<typeof especificacionSchema>
