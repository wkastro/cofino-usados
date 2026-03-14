import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  authUserRegisterSchema,
  type AuthUserRegisterData,
} from "@/lib/validations/auth-users";

export function useRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthUserRegisterData>({
    resolver: zodResolver(authUserRegisterSchema),
    defaultValues: {
      phoneCode: "+502",
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: AuthUserRegisterData) => {
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

  return {
    register,
    control,
    handleSubmit,
    errors,
    onSubmit,
    error,
    isPending,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
}
