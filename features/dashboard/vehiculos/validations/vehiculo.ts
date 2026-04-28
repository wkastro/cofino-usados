import * as z from "zod"

const currentYear = new Date().getFullYear()

export const vehiculoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede exceder 120 caracteres"),
  codigo: z.string().nullable().optional().default("").transform(v => v?.trim() || null),
  placa: z
    .string()
    .min(1, "La placa es requerida")
    .max(20, "La placa no puede exceder 20 caracteres"),
  precio: z.coerce
    .number({ error: "Ingresa un precio válido" })
    .positive("El precio debe ser mayor a 0"),
  preciodescuento: z.preprocess(
    (v) => (v === "" ? null : v),
    z.coerce
      .number({ error: "Ingresa un precio válido" })
      .positive("El precio con descuento debe ser mayor a 0")
      .optional()
      .nullable()
  ),
  kilometraje: z.coerce
    .number({ error: "Ingresa un kilometraje válido" })
    .int("El kilometraje debe ser un número entero")
    .min(1, "El kilometraje debe ser mayor a 0"),
  motor: z.string().min(1, "El motor es requerido").max(50, "El motor no puede exceder 50 caracteres"),
  anio: z.coerce
    .number({ error: "Ingresa un año válido" })
    .int("El año debe ser un número entero")
    .min(1900, "El año mínimo permitido es 1900")
    .max(currentYear + 2, `El año no puede ser mayor a ${currentYear + 2}`),
  estadoId: z.string().min(1, "Debes seleccionar un estado").uuid("Debes seleccionar un estado"),
  transmisionId: z.string().min(1, "Debes seleccionar una transmisión").uuid("Debes seleccionar una transmisión"),
  combustibleId: z.string().min(1, "Debes seleccionar un tipo de combustible").uuid("Debes seleccionar un tipo de combustible"),
  traccionId: z.string().min(1, "Debes seleccionar un tipo de tracción").uuid("Debes seleccionar un tipo de tracción"),
  color_interior: z.string().min(1, "El color interior es requerido").max(50, "El color interior no puede exceder 50 caracteres"),
  color_exterior: z.string().min(1, "El color exterior es requerido").max(50, "El color exterior no puede exceder 50 caracteres"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  marcaId: z.string().min(1, "Debes seleccionar una marca").uuid("Debes seleccionar una marca"),
  sucursalId: z.string().min(1, "Debes seleccionar una sucursal").uuid("Debes seleccionar una sucursal"),
  categoriaId: z.string().min(1, "Debes seleccionar una categoría").uuid("Debes seleccionar una categoría"),
  etiquetaComercialId: z.string().min(1, "Debes seleccionar una etiqueta comercial").uuid("Debes seleccionar una etiqueta comercial"),
})

export type VehiculoInput = z.infer<typeof vehiculoSchema>

export const galeriaImageSchema = z.object({
  url: z.string().url("Ingresa una URL válida de imagen"),
  orden: z.coerce.number().int().min(0).default(0),
})
