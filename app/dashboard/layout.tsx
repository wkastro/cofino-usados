import type { Metadata } from "next";
import type { ReactNode } from "react";

import DashboardShellLayout from "@/features/dashboard/shell/layout";

import "@/features/dashboard/styles/dashboard.css";

export const metadata: Metadata = {
  title: {
    template: "Dashboard Cofiño | %s",
    default: "Dashboard Cofiño | Panel Principal",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <DashboardShellLayout>{children}</DashboardShellLayout>;
}
