import type React from "react";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth-dashboard/components/login-form"

export default function LoginPage(): React.ReactElement {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 px-4">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    )
}
