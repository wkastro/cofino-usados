"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminLogin } from "@/app/auth/actions"

export function useAdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, {
    error: "",
    success: false,
  })
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard")
      router.refresh()
    }
  }, [state.success, router])

  return { state, formAction, isPending }
}
