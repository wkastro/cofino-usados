"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    phoneCode: z.string().min(1, "Selecciona un código"),
    phone: z.string().min(8, "Ingresa un número de teléfono válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/\d/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 ml-4">{message}</p>;
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneCode: "+502",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");
    startTransition(async () => {
      try {
        const phone = `${data.phoneCode}${data.phone.replace(/\D/g, "")}`;
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            phone,
            password: data.password,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          setError(result.message || "Error al crear la cuenta");
          return;
        }

        router.push("/login?registered=true");
      } catch {
        setError("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    });
  };

  return (
    <div className="w-full max-w-100 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-bold tracking-tight text-foreground">
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
          <Label
            htmlFor="fullName"
            className="text-sm font-bold text-foreground"
          >
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
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-bold text-foreground">
            Teléfono
          </Label>
          <div className="flex gap-3">
            <Controller
              control={control}
              name="phoneCode"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-24 rounded-full border-foreground h-12 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+502">🇬🇹 +502</SelectItem>
                    <SelectItem value="+503">🇸🇻 +503</SelectItem>
                    <SelectItem value="+504">🇭🇳 +504</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              id="phone"
              placeholder="5987 - 2409"
              className="rounded-full border-foreground h-12 px-5"
              {...register("phone")}
            />
          </div>
          <FieldError message={errors.phone?.message} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-sm font-bold text-foreground"
          >
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="rounded-full border-foreground h-12 px-5 pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOffIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-bold text-foreground"
          >
            Confirmar contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="rounded-full border-foreground h-12 px-5 pr-12"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-black text-white hover:bg-black/90 rounded-full font-bold text-base shadow-sm mt-2"
        >
          {isPending ? "Registrando..." : "Registrarme"}
        </Button>
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

        <div className="flex justify-center gap-4">
          <button className="h-12 w-12 flex items-center justify-center rounded-full border border-muted hover:bg-muted/10 transition-colors shadow-xs">
            <svg
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="23.2824" cy="23.2824" r="23.2824" fill="black" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.512 23.5006C32.512 22.8189 32.4508 22.1634 32.3372 21.5341H23.2822V25.2531H28.4565C28.2336 26.4548 27.5562 27.4731 26.538 28.1548V30.5672H29.6452C31.4631 28.8934 32.512 26.4286 32.512 23.5006Z"
                fill="#B4B4B4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.2821 32.8964C25.878 32.8964 28.0543 32.0354 29.6451 30.5671L26.5379 28.1548C25.677 28.7316 24.5757 29.0725 23.2821 29.0725C20.778 29.0725 18.6585 27.3812 17.9025 25.1088H14.6904V27.5997C16.2724 30.7419 19.5238 32.8964 23.2821 32.8964Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.9026 25.109C17.7104 24.5322 17.6011 23.916 17.6011 23.2823C17.6011 22.6486 17.7104 22.0324 17.9026 21.4556V18.9646H14.6906C14.0394 20.2625 13.668 21.7309 13.668 23.2823C13.668 24.8337 14.0394 26.3021 14.6906 27.6L17.9026 25.109Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.2821 17.4917C24.6937 17.4917 25.961 17.9768 26.9574 18.9295L29.715 16.1719C28.05 14.6205 25.8736 13.6678 23.2821 13.6678C19.5238 13.6678 16.2724 15.8223 14.6904 18.9645L17.9025 21.4554C18.6585 19.183 20.778 17.4917 23.2821 17.4917Z"
                fill="#CACACA"
              />
            </svg>
          </button>
          <button className="h-12 w-12 flex items-center justify-center rounded-full border border-muted hover:bg-muted/10 transition-colors shadow-xs bg-black text-white">
            <svg
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="23.2824" cy="23.2824" r="23.2824" fill="black" />
              <path
                d="M31.3328 26.8547C31.0311 27.5517 30.674 28.1933 30.2602 28.7832C29.6962 29.5873 29.2344 30.1439 28.8785 30.453C28.3268 30.9604 27.7357 31.2202 27.1027 31.235C26.6483 31.235 26.1003 31.1057 25.4624 30.8434C24.8224 30.5823 24.2342 30.453 23.6965 30.453C23.1324 30.453 22.5276 30.5823 21.8805 30.8434C21.2325 31.1057 20.7105 31.2424 20.3114 31.2559C19.7044 31.2818 19.0994 31.0146 18.4955 30.453C18.11 30.1168 17.6279 29.5405 17.0503 28.724C16.4307 27.8522 15.9212 26.8411 15.5221 25.6885C15.0946 24.4435 14.8804 23.2378 14.8804 22.0707C14.8804 20.7337 15.1693 19.5805 15.7479 18.6142C16.2027 17.838 16.8077 17.2257 17.565 16.7762C18.3222 16.3267 19.1404 16.0977 20.0215 16.083C20.5036 16.083 21.1359 16.2321 21.9215 16.5252C22.705 16.8193 23.2081 16.9684 23.4286 16.9684C23.5935 16.9684 24.1524 16.7941 25.0997 16.4464C25.9956 16.124 26.7517 15.9905 27.3712 16.0431C29.0497 16.1786 30.3107 16.8402 31.1493 18.0323C29.6482 18.9419 28.9056 20.2158 28.9204 21.8501C28.9339 23.1231 29.3957 24.1824 30.3033 25.0235C30.7146 25.4139 31.1739 25.7156 31.685 25.9298C31.5742 26.2513 31.4572 26.5591 31.3328 26.8547ZM27.4832 11.7064C27.4832 12.7041 27.1187 13.6357 26.3921 14.498C25.5153 15.5231 24.4548 16.1154 23.3047 16.0219C23.2901 15.9022 23.2816 15.7763 23.2816 15.6439C23.2816 14.686 23.6986 13.661 24.439 12.8228C24.8087 12.3985 25.2789 12.0456 25.8491 11.7641C26.418 11.4869 26.9562 11.3335 27.4623 11.3073C27.4771 11.4406 27.4832 11.574 27.4832 11.7064V11.7064Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-bold text-foreground hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
