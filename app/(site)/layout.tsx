import { Suspense, type ReactNode } from "react";

import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FavoritesProvider } from "@/features/favoritos/context/favorites-context";

export default function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <FavoritesProvider>
      <Suspense
        fallback={
          <header className="sticky top-0 w-full z-50 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="h-16" />
          </header>
        }
      >
        <Header />
      </Suspense>
      <Suspense fallback={<div className="min-h-dvh" />}>{children}</Suspense>
      <Footer />
    </FavoritesProvider>
  );
}
