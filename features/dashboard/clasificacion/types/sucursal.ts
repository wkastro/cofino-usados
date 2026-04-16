export interface Sucursal {
  id: string
  nombre: string
  direccion: string
  latitud: number
  longitud: number
  maps: string | null
  waze: string | null
  estado: boolean
  createdAt: Date
  updatedAt: Date
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

export type SucursalActionResult<T = undefined> = ActionSuccess<T> | ActionError
