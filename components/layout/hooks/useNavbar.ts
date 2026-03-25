"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export function useNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const isActiveLink = useCallback(
    (href: string) => pathname === href,
    [pathname],
  );

  return {
    mobileMenuOpen,
    isHome,
    toggleMobileMenu,
    closeMobileMenu,
    isActiveLink,
  };
}
