"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/global/logo";
import { FieldError } from "@/components/forms/field-error";
import { PasswordField } from "@/components/forms/password-field";
import { PhoneField } from "@/components/forms/phone-field";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { AUTH_PHONE_CODES_DEFAULT } from "@/lib/constants/auth";
import { useAdminRegisterForm } from "@/features/auth-dashboard/hooks/useAdminRegisterForm";

export function RegisterForm() {
  const {
    register,
    control,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    showPassword,
    togglePassword,
  } = useAdminRegisterForm();

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden p-4 md:p-6 lg:p-8">
      <div className="flex w-full overflow-hidden rounded-[40px] shadow-2xl bg-white border border-gray-100">
        {/* Left Side: Image/Info Column */}
        <div className="relative hidden w-1/2 lg:block">
          <Image
            src="/registro.jpg"
            alt="Cofiño Usados Registration"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 bg-black/10">
            <div>
              <Logo className="text-white h-10 w-auto mb-8" />
              <h1 className="font-bold text-white max-w-md leading-tight">
                Calidad y confianza en cada vehículo
              </h1>
            </div>

            {/* Partner Logos Area - Bottom */}
            <div className="mt-auto">
              <p className="text-white/80 text-sm mb-4 font-medium uppercase tracking-wider">
                Marcas aliadas
              </p>
              <div className="flex flex-wrap items-center gap-8 grayscale brightness-200 opacity-80">
                <span className="text-white font-bold text-xl">LEXUS</span>
                <span className="text-white font-bold text-lg">LAND ROVER</span>
                <span className="text-white font-bold text-xl">AUDI</span>
                <span className="text-white font-bold text-xl">RENAULT</span>
                <span className="text-white font-bold text-xl">BYD</span>
                <span className="text-white font-bold text-xl">TOYOTA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Column */}
        <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 md:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="font-bold tracking-tight text-gray-900">
                Bienvenido 👋 <br /> a Cofiño usados
              </h2>
              <p className="text-sm text-gray-500">
                Crea tu usuario y disfruta de nuestros servicios.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Nombre completo
                </Label>
                <Input
                  id="fullName"
                  placeholder="Juan Roberto Torres"
                  className="rounded-full border-gray-200 focus:border-brand-lime focus:ring-brand-lime/20 h-12"
                  {...register("fullName")}
                />
                <FieldError message={errors.fullName?.message} />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
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

              {/* Phone */}
              <PhoneField
                control={control}
                register={register}
                phoneCodeName="phoneCode"
                phoneName="phone"
                phoneCodeOptions={AUTH_PHONE_CODES_DEFAULT}
                label="Teléfono"
                labelClassName="text-sm font-semibold text-gray-700"
                selectTriggerClassName="w-24 rounded-full border-gray-200 h-12"
                inputClassName="flex-1 rounded-full border-gray-200 h-12"
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
                inputClassName="rounded-full border-gray-200 h-12 pr-12"
                labelClassName="text-sm font-semibold text-gray-700"
                toggleClassName="text-gray-400 hover:text-gray-600"
                errorMessage={errors.password?.message}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-md shadow-lg transform transition active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending ? "Registrando..." : "Registrarme"}
              </Button>
            </form>

            {/* Social Login */}
            <div className="space-y-6 text-center pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-medium">
                    O continua con
                  </span>
                </div>
              </div>

              <SocialAuthButtons variant="dashboard" />

              <p className="text-sm text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="font-bold text-gray-900 hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
