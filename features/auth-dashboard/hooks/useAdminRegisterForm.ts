import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  authDashboardRegisterSchema,
  type AuthDashboardRegisterData,
} from "@/lib/validations/auth-dashboard";

export function useAdminRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

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
      console.log("Registering:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
