import type { DefaultSession } from "next-auth"

type Role = "USER" | "ADMIN"

declare module "next-auth" {
  interface User {
    fullName?: string
    phone?: string | null
    role?: Role
  }

  interface Session {
    user: {
      id: string
      fullName: string
      phone: string
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    fullName: string
    phone?: string
    role: Role
  }
}
