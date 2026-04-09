"use server"

import { AuthError } from "next-auth"
import { signIn, signOut } from "@/auth"

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
    if (error instanceof AuthError) {
      return { error: "Credenciales inválidas", success: false }
    }
    // Re-lanzar NEXT_REDIRECT y errores inesperados para que Next los maneje.
    throw error
  }

  return { error: "", success: true }
}

export async function adminSignOut() {
  await signOut({ redirectTo: "/auth" })
}
