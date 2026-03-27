export type Role = "USER" | "ADMIN"

export interface SessionUser {
  id: string
  fullName: string
  email: string
  phone: string
  role: Role
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface ActionResult {
  success: boolean
  message: string
}
