"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

interface RoleGuardProps {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession();

  if (session?.user?.role !== role) return <>{fallback}</>;

  return <>{children}</>;
}
