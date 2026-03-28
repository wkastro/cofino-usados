"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_THRESHOLD = 100;

interface UseNavbarReturn {
  mobileMenuOpen: boolean;
  isHome: boolean;
  isScrolled: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isActiveLink: (href: string) => boolean;
}

export function useNavbar(): UseNavbarReturn {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

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
    isScrolled,
    toggleMobileMenu,
    closeMobileMenu,
    isActiveLink,
  };
}
