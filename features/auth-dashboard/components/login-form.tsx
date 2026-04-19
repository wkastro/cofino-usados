"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLoginForm } from "@/features/auth-dashboard/hooks/useAdminLoginForm";

export function LoginForm() {
  const { state, formAction, isPending } = useAdminLoginForm();
  const hasError = Boolean(state.error);

  return (
    <div className="w-full space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Iniciar sesión
        </h1>
        <p className="text-sm text-neutral-500">
          Ingresa tus credenciales de administrador
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-neutral-700"
          >
            Correo electrónico
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@cofino.cl"
            required
            aria-invalid={hasError ? true : undefined}
            aria-describedby={hasError ? "login-error" : undefined}
            className="h-11 border-neutral-200 focus-visible:ring-neutral-900 focus-visible:border-neutral-900"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-neutral-700"
          >
            Contraseña
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            aria-invalid={hasError ? true : undefined}
            aria-describedby={hasError ? "login-error" : undefined}
            className="h-11 border-neutral-200 focus-visible:ring-neutral-900 focus-visible:border-neutral-900"
          />
        </div>

        {hasError && (
          <p id="login-error" role="alert" className="text-sm text-red-500">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full h-11 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 active:bg-neutral-950 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Iniciando sesión..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
