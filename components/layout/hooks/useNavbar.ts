"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";

interface UseNavbarReturn {
  mobileMenuOpen: boolean;
  isHome: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isActiveLink: (href: string) => boolean;
}

export function useNavbar(): UseNavbarReturn {
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
