import { redirect } from "next/navigation"
import type { Session } from "next-auth"
import { auth } from "@/auth"

export async function requireAuth(): Promise<Session> {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session
}

export async function requireAdmin(): Promise<Session> {
  const session = await auth()
  if (!session?.user) redirect("/auth")
  if (session.user.role !== "ADMIN") redirect("/")
  return session
}
