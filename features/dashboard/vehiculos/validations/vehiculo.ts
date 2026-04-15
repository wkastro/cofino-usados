import * as z from "zod"

export const vehiculoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  codigo: z.string().optional().default("").transform(v => v?.trim() || null),
  placa: z.string().min(2, "La placa es requerida").max(20, "Placa muy larga"),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0"),
  preciodescuento: z.coerce.number().positive("El precio con descuento debe ser mayor a 0").optional().nullable(),
  kilometraje: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo"),
  motor: z.string().optional().default("").transform(v => v?.trim() || null),
  anio: z.coerce
    .number()
    .int()
    .min(1900, "Año inválido")
    .max(new Date().getFullYear() + 2, "Año inválido"),
  estadoId: z.string().uuid("Selecciona un estado"),
  transmisionId: z.string().uuid("Selecciona una transmisión"),
  combustibleId: z.string().uuid("Selecciona un combustible"),
  traccionId: z.string().uuid("Selecciona una tracción"),
  color_interior: z.string().optional().default("").transform(v => v?.trim() || null),
  color_exterior: z.string().optional().default("").transform(v => v?.trim() || null),
  descripcion: z.string().optional().default("").transform(v => v?.trim() || null),
  marcaId: z.string().uuid("Selecciona una marca"),
  sucursalId: z.string().uuid("Selecciona una sucursal"),
  categoriaId: z.string().uuid("Selecciona una categoría"),
  etiquetaComercialId: z.string().uuid().optional().nullable(),
})

export type VehiculoInput = z.infer<typeof vehiculoSchema>

export const galeriaImageSchema = z.object({
  url: z.string().url("Ingresa una URL válida de imagen"),
  orden: z.coerce.number().int().min(0).default(0),
})

export type GaleriaImageInput = z.infer<typeof galeriaImageSchema>
