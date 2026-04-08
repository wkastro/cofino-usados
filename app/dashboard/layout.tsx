import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth-guard";
import DashboardShellLayout from "@/features/dashboard/shell/layout";

import "@/features/dashboard/styles/dashboard.css";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await requireAdmin();
  return <DashboardShellLayout>{children}</DashboardShellLayout>;
}
