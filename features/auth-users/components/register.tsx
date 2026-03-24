"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/field-error";
import { PasswordField } from "@/components/forms/password-field";
import { PhoneField } from "@/components/forms/phone-field";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { AUTH_PHONE_CODES_EXTENDED } from "@/lib/constants/auth";
import { useRegisterForm } from "@/features/auth-users/hooks/useRegisterForm";

export default function RegisterForm() {
  const {
    register,
    control,
    handleSubmit,
    errors,
    onSubmit,
    error,
    isPending,
    showPassword,
    togglePassword,
  } = useRegisterForm();

  return (
    <div className="w-full max-w-100 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-semibold tracking-tight text-foreground">
          Bienvenido a Cofiño usados
        </h1>
        <p className="text-muted-foreground text-sm">
          Crea tu usuario y disfruta de nuestros servicios.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm font-bold text-foreground">
            Nombre completo
          </Label>
          <Input
            id="fullName"
            placeholder="Juan Roberto Torres"
            className="rounded-full border-foreground h-12 px-5"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-bold text-foreground">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu correo electronico"
            className="rounded-full border-foreground h-12 px-5"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Phone */}
        <PhoneField
          control={control}
          register={register}
          phoneCodeName="phoneCode"
          phoneName="phone"
          phoneCodeOptions={AUTH_PHONE_CODES_EXTENDED}
          label="Teléfono"
          labelClassName="text-sm font-bold text-foreground"
          selectTriggerClassName="w-24 rounded-full border-foreground h-12 shrink-0"
          inputClassName="rounded-full border-foreground h-12 px-5"
          inputPlaceholder="5987 - 2409"
          errorMessage={errors.phone?.message}
        />

        {/* Password */}
        <PasswordField
          id="password"
          label="Contraseña"
          placeholder="••••••••••••"
          showPassword={showPassword}
          onToggle={togglePassword}
          inputProps={register("password")}
          inputClassName="rounded-full border-foreground h-12 px-5 pr-12"
          labelClassName="text-sm font-bold text-foreground"
          errorMessage={errors.password?.message}
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-btn-black"
        >
          {isPending ? "Registrando..." : "Registrarme"}
        </button>
      </form>

      {/* Social Register */}
      <div className="space-y-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted/50"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-muted-foreground font-medium">
              O continua con
            </span>
          </div>
        </div>

        <SocialAuthButtons />

        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold text-foreground hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
