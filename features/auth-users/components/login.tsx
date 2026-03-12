"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, HelpCircleIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await signIn("user-login", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Credenciales inválidas");
        } else {
          router.push("/");
          router.refresh();
        }
      } catch {
        setError("Ocurrió un error inesperado");
      }
    });
  };

  return (
    <main className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 md:p-12 lg:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-bold text-foreground">
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
          <Button
            type="submit"
            variant="dark"
            size="lg"
            className="w-full h-12 text-base"
            disabled={isPending}
          >
            {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        {/* Social login */}
        <div className="space-y-5">
          <p className="text-center text-sm text-gray-500">O continua con</p>
          <div className="flex items-center justify-center gap-4">
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
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          ¿Aún no tienes una cuenta{" "}
          <Link
            href="/registro"
            className="font-bold text-gray-900 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
