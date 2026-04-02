import { useState, useTransition } from "react";
import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  authUserLoginSchema,
  type AuthUserLoginData,
} from "@/features/auth-users/validations/auth-users";

interface UseLoginFormReturn {
  register: UseFormRegister<AuthUserLoginData>;
  handleSubmit: UseFormHandleSubmit<AuthUserLoginData>;
  errors: FieldErrors<AuthUserLoginData>;
  onSubmit: (data: AuthUserLoginData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}

export function useLoginForm(): UseLoginFormReturn {
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
