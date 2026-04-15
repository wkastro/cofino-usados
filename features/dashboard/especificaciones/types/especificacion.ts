export type EspecificacionTipo = "transmision" | "combustible" | "traccion" | "estado"

export interface Especificacion {
  id: string
  nombre: string
  slug: string
  estado: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AllEspecificaciones {
  transmisiones: Especificacion[]
  combustibles: Especificacion[]
  tracciones: Especificacion[]
  estados: Especificacion[]
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

export type EspecificacionActionResult<T = undefined> = ActionSuccess<T> | ActionError
