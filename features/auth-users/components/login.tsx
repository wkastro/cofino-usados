"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircleIcon } from "lucide-react";
import { FieldError } from "@/components/forms/field-error";
import { PasswordField } from "@/components/forms/password-field";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { useLoginForm } from "@/features/auth-users/hooks/useLoginForm";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    error,
    isPending,
    showPassword,
    togglePassword,
  } = useLoginForm();

  return (
    <main className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 md:p-12 lg:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-semibold text-foreground">
            ¡Hola de nuevo! <br /> Inicia sesión aquí
          </h1>
          <p className="text-gray-500">
            Escribe tus datos y continúa disfrutando
            <br />
            de todos nuestros servicios.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu correo electronico"
              className="rounded-full border-gray-200 h-12"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Password */}
          <PasswordField
            id="password"
            label="Contraseña"
            placeholder="••••••••••••"
            showPassword={showPassword}
            onToggle={togglePassword}
            inputProps={register("password")}
            inputClassName="rounded-full border-gray-200 h-12 pr-12"
            labelClassName="text-sm font-semibold text-gray-700"
            toggleClassName="text-gray-400 hover:text-gray-600"
            errorMessage={errors.password?.message}
          />

          {/* Forgot password */}
          <div className="flex items-center gap-1.5">
            <HelpCircleIcon className="h-4 w-4 text-gray-400" />
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>

          {error && <p className="text-xs text-red-500 ml-4">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="bg-btn-black"
            disabled={isPending}
          >
            {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Social login */}
        <div className="space-y-5">
          <p className="text-center text-sm text-gray-500">O continua con</p>
          <SocialAuthButtons />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          ¿Aún no tienes una cuenta{" "}
          <Link href="/registro" className="font-bold text-gray-900 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
