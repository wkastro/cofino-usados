import type { Sucursal } from "./sucursal"

export type ClasificacionTipo = "marca" | "categoria" | "etiquetaComercial"

export interface Clasificacion {
  id: string
  nombre: string
  slug: string
  estado: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AllClasificaciones {
  marcas: Clasificacion[]
  categorias: Clasificacion[]
  etiquetas: Clasificacion[]
  sucursales: Sucursal[]
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

export type ClasificacionActionResult<T = undefined> = ActionSuccess<T> | ActionError
