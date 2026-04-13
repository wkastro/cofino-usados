import type { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/enums"

export interface SelectOption {
  id: string
  nombre: string
}

export interface VehiculoRelationOptions {
  marcas: SelectOption[]
  categorias: SelectOption[]
  sucursales: SelectOption[]
  etiquetas: SelectOption[]
}

export interface VehiculoRow {
  id: string
  nombre: string
  slug: string
  placa: string
  codigo: string | null
  precio: number
  kilometraje: number
  anio: number
  estado: EstadoVenta
  transmision: Transmision
  combustible: Combustible
  marca: string
  categoria: string
  sucursal: string
  createdAt: Date
}

export interface VehiculoAdmin {
  id: string
  nombre: string
  slug: string
  codigo: string | null
  placa: string
  precio: number
  preciodescuento: number | null
  kilometraje: number
  motor: string | null
  anio: number
  estado: EstadoVenta
  transmision: Transmision
  combustible: Combustible
  traccion: Traccion
  color_interior: string | null
  color_exterior: string | null
  descripcion: string | null
  marcaId: string
  sucursalId: string
  categoriaId: string
  etiquetaComercialId: string | null
  galeria: GaleriaItem[]
  createdAt: Date
  updatedAt: Date
}

export interface GaleriaItem {
  id: string
  url: string
  orden: number
}

export interface VehiculosAdminResponse {
  vehiculos: VehiculoRow[]
  total: number
  pages: number
  page: number
}

export type ActionSuccess<T = undefined> = {
  ok: true
  message: string
  data?: T
}

export type ActionError = {
  ok: false
  message: string
  fieldErrors?: Record<string, string[]>
}

export type ActionResult<T = undefined> = ActionSuccess<T> | ActionError
