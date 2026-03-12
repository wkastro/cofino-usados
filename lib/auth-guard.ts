import { redirect } from "next/navigation"
import { auth } from "@/auth"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect("/auth")
  if (session.user.role !== "ADMIN") redirect("/")
  return session
}
