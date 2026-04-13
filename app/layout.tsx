import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});
const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cofiño Usados | Vehículos Seminuevos Certificados",
    template: "%s | Cofiño Usados",
  },
  description:
    "Encuentra tu vehículo seminuevo certificado en Cofiño Usados. Amplio catálogo, financiamiento y entrega inmediata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("font-sans", workSans.variable, clashDisplay.variable)}
    >
      <body className="antialiased bg-secondary">{children}</body>
    </html>
  );
}
