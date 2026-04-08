"use server"

import { signIn } from "@/auth"

export async function adminLogin(_prevState: { error: string; success: boolean }, formData: FormData) {
  try {
    await signIn("admin-login", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
      redirectTo: "/dashboard",
    })
  } catch {
    return { error: "Credenciales inválidas", success: false }
  }

  return { error: "", success: true }
}
