"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/global/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phoneCode: z.string(),
  phone: z.string().min(8, "Ingresa un número de teléfono válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneCode: "+502",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");
    startTransition(async () => {
      console.log("Registering:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // For demo purposes, we'll just log
    });
  };

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
                {/* Replace with actual icons from assets if available, for now using text placeholders in a style match */}
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
                {errors.fullName && (
                  <p className="text-xs text-red-500 ml-4">
                    {errors.fullName.message}
                  </p>
                )}
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
                {errors.email && (
                  <p className="text-xs text-red-500 ml-4">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-700"
                >
                  Teléfono
                </Label>
                <div className="flex gap-3">
                  <Controller
                    control={control}
                    name="phoneCode"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-24 rounded-full border-gray-200 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+502">🇬🇹 +502</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+52">🇲🇽 +52</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    id="phone"
                    placeholder="5987 - 2409"
                    className="flex-1 rounded-full border-gray-200 h-12"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 ml-4">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="rounded-full border-gray-200 h-12 pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 ml-4">
                    {errors.password.message}
                  </p>
                )}
              </div>

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

              <div className="flex justify-center gap-6">
                {/* Social Icons - Using SVGs for accuracy from common patterns */}
                <button className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm bg-white">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </button>
                <button className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm bg-black text-white">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702z" />
                  </svg>
                </button>
                <button className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm bg-[#1877F2] text-white">
                  <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>

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
