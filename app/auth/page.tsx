import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/features/auth-dashboard/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginFormGate />
      </Suspense>
    </div>
  );
}

async function LoginFormGate() {
  const session = await auth();
  if (session?.user?.role === "ADMIN") {
    redirect("/dashboard");
  }
  return <LoginForm />;
}

function LoginFormSkeleton() {
  return (
    <div
      className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md"
      aria-hidden
    >
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-300 rounded animate-pulse" />
    </div>
  );
}
