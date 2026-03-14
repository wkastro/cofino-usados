import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  authUserLoginSchema,
  type AuthUserLoginData,
} from "@/lib/validations/auth-users";

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthUserLoginData>({
    resolver: zodResolver(authUserLoginSchema),
  });

  const onSubmit = (data: AuthUserLoginData) => {
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

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    error,
    isPending,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
}
