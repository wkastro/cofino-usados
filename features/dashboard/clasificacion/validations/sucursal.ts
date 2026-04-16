import { z } from "zod"

export const sucursalSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  latitud: z
    .number({ message: "Debe ser un número" })
    .min(-90, "Latitud entre -90 y 90")
    .max(90, "Latitud entre -90 y 90"),
  longitud: z
    .number({ message: "Debe ser un número" })
    .min(-180, "Longitud entre -180 y 180")
    .max(180, "Longitud entre -180 y 180"),
  maps: z.string().optional(),
  waze: z.string().optional(),
})

export type SucursalInput = z.infer<typeof sucursalSchema>
