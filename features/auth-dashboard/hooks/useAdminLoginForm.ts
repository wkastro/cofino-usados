import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAdminLoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = (formData: FormData) => {
    setError("");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      try {
        const result = await signIn("admin-login", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Credenciales inválidas");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } catch {
        setError("Ocurrió un error inesperado");
      }
    });
  };

  return { handleAction, error, isPending };
}
