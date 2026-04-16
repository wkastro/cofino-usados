import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { LoginForm } from "@/features/auth-dashboard/components/login-form";
import { Logo } from "@/components/global/logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — form panel */}
      <div className="relative flex flex-1 flex-col bg-white lg:max-w-[52%]">
        <div className="px-8 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver al sitio
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginFormGate />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Right — brand panel */}
      <div
        className="relative hidden lg:flex flex-1 flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Corner accent squares, like the reference */}
        <div className="absolute top-6 right-6 size-6 border border-white/10" />
        <div className="absolute top-6 right-14 size-6 border border-white/10" />
        <div className="absolute bottom-6 left-6 size-6 border border-white/10" />
        <div className="absolute bottom-6 left-14 size-6 border border-white/10" />

        <div className="relative flex flex-col items-center gap-6 px-12 text-center">
          <Logo className="h-9 w-auto text-white" />
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Panel de Administración
          </p>
        </div>
      </div>
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
    <div className="w-full space-y-6" aria-hidden>
      <div className="h-8 w-32 bg-neutral-100 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
        <div className="h-11 bg-neutral-100 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
        <div className="h-11 bg-neutral-100 rounded animate-pulse" />
      </div>
      <div className="h-11 bg-neutral-900 rounded animate-pulse" />
    </div>
  );
}
