import type { Metadata } from "next";
import DefaultDashboardPage from "@/features/dashboard/shell/default/page";

export const metadata: Metadata = { title: "Panel Principal" };

export default function Page() {
  return <DefaultDashboardPage />;
}
