import { useState, useTransition } from "react";
import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  authUserRegisterSchema,
  type AuthUserRegisterData,
} from "@/features/auth-users/validations/auth-users";
import { registerUser } from "@/app/actions/auth";

interface UseRegisterFormReturn {
  register: UseFormRegister<AuthUserRegisterData>;
  control: Control<AuthUserRegisterData>;
  handleSubmit: UseFormHandleSubmit<AuthUserRegisterData>;
  errors: FieldErrors<AuthUserRegisterData>;
  onSubmit: (data: AuthUserRegisterData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}

export function useRegisterForm(): UseRegisterFormReturn {
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
        const result = await registerUser({
          fullName: data.fullName,
          email: data.email,
          phone,
          password: data.password,
        });

        if (!result.success) {
          setError(result.message);
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
