"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import type { Role } from "@/types/auth";

interface RoleGuardProps {
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ role, children, fallback = null }: RoleGuardProps): React.ReactElement {
  const { data: session } = useSession();

  if (session?.user?.role !== role) return <>{fallback}</>;

  return <>{children}</>;
}
