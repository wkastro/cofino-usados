import type { ReactNode } from "react";

import DashboardShellLayout from "@/features/dashboard/shell/layout";

import "@/features/dashboard/styles/dashboard.css";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <DashboardShellLayout>{children}</DashboardShellLayout>;
}
