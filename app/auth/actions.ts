"use server"

import { AuthError } from "next-auth"
import { signIn, signOut } from "@/auth"
import { unstable_rethrow } from "next/navigation"

export async function adminLogin(
  _prevState: { error: string; success: boolean },
  formData: FormData,
) {
  try {
    await signIn("admin-login", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    })
  } catch (error) {
    unstable_rethrow(error)
    if (error instanceof AuthError) {
      return { error: "Credenciales inválidas", success: false }
    }
    throw error
  }

  return { error: "", success: true }
}

export async function adminSignOut() {
  await signOut({ redirectTo: "/auth" })
}
