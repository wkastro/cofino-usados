import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  authDashboardRegisterSchema,
  type AuthDashboardRegisterData,
} from "@/lib/validations/auth-dashboard";
import { registerAdmin } from "@/app/actions/auth";

export function useAdminRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthDashboardRegisterData>({
    resolver: zodResolver(authDashboardRegisterSchema),
    defaultValues: {
      phoneCode: "+502",
    },
  });

  const onSubmit = (data: AuthDashboardRegisterData) => {
    setError("");
    startTransition(async () => {
      try {
        const phone = `${data.phoneCode}${data.phone.replace(/\D/g, "")}`;
        const result = await registerAdmin({
          fullName: data.fullName,
          email: data.email,
          phone,
          password: data.password,
        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        router.push("/auth?registered=true");
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
