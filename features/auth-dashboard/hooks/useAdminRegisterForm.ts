import { useState, useTransition } from "react";
import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  authDashboardRegisterSchema,
  type AuthDashboardRegisterData,
} from "@/features/auth-dashboard/validations/auth-dashboard";
import { registerAdmin } from "@/app/actions/auth";

interface UseAdminRegisterFormReturn {
  register: UseFormRegister<AuthDashboardRegisterData>;
  control: Control<AuthDashboardRegisterData>;
  handleSubmit: UseFormHandleSubmit<AuthDashboardRegisterData>;
  errors: FieldErrors<AuthDashboardRegisterData>;
  onSubmit: (data: AuthDashboardRegisterData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}

export function useAdminRegisterForm(): UseAdminRegisterFormReturn {
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
