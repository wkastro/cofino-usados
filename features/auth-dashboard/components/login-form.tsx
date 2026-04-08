"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/global/logo";
import { adminLogin } from "@/app/auth/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, {
    error: "",
    success: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="w-full max-w-md p-8 space-y-6 text-card-foreground rounded-lg shadow-md flex flex-col items-center">
      <Logo className="text-foreground h-10 w-auto" />
      <h2 className="font-bold text-center w-full">Panel de Administración</h2>
      <form action={formAction} className="space-y-4 w-full">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            required
          />
        </div>
        {state.error && (
          <p className="text-xs text-red-500 ml-4">{state.error}</p>
        )}
        <button type="submit" className="bg-btn-lime" disabled={isPending}>
          {isPending ? "Iniciando sesión..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
