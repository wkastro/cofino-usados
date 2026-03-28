"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  UserIcon,
  Menu02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/constants/navigation";
import { useNavbar } from "@/components/layout/hooks/useNavbar";

export default function Navbar() {
  const {
    mobileMenuOpen,
    isHome,
    isScrolled,
    toggleMobileMenu,
    closeMobileMenu,
    isActiveLink,
  } = useNavbar();

  // En home sin scroll: estilo transparente con texto blanco
  // En home con scroll o en cualquier otra página: estilo sólido con fondo blanco
  const transparent = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "top-0 w-full z-50 transition-all duration-300",
        isHome ? "fixed" : "sticky",
        transparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-sm border-b border-border",
      )}
    >
      <nav aria-label="Navegación principal">
        <Container>
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="shrink-0" onClick={closeMobileMenu}>
              <Image
                src="/logo-cofino.svg"
                alt="Cofiño"
                width={200}
                height={60}
                className={cn(
                  "transition-all duration-300",
                  transparent ? "brightness-0 invert" : "brightness-0 dark:invert",
                )}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      transparent
                        ? [
                            isActive
                              ? "text-white font-semibold"
                              : "text-white/80 hover:text-white hover:bg-white/10",
                          ]
                        : [
                            isActive
                              ? "text-foreground font-semibold bg-muted"
                              : "text-foreground/80 hover:text-foreground hover:bg-muted",
                          ],
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-2 lg:flex">
              <Button
                variant="ghost"
                size="icon"
                asChild
                aria-label="Ver favoritos"
                className={cn(
                  transparent ? "text-white hover:bg-white/10 hover:text-white" : "",
                )}
              >
                <Link href="/favoritos">
                  <HugeiconsIcon
                    icon={FavouriteIcon}
                    style={{ width: 20, height: 20 }}
                  />
                </Link>
              </Button>
              <Button
                variant={transparent ? "default" : "dark"}
                asChild
                className={cn(
                  transparent
                    ? "bg-black text-white hover:bg-black/90 rounded-full box-border"
                    : "",
                )}
              >
                <Link href="/login" aria-label="Iniciar sesión en Cofiño">
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="size-4"
                    style={{ width: 18, height: 18 }}
                    data-icon="inline-start"
                  />
                  Iniciar sesión
                </Link>
              </Button>
            </div>

            {/* Mobile Actions / Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              {isHome && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  aria-label="Ver favoritos"
                  className={cn(
                    transparent
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : "",
                  )}
                >
                  <Link href="/favoritos">
                    <HugeiconsIcon icon={FavouriteIcon} className="size-5.5" />
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                onClick={toggleMobileMenu}
                className={cn(
                  transparent ? "text-white hover:bg-white/10 hover:text-white" : "",
                )}
              >
                <HugeiconsIcon
                  icon={mobileMenuOpen ? Cancel01Icon : Menu02Icon}
                  className="size-5.5"
                />
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className={cn(
              "absolute top-full left-0 w-full lg:hidden border-t",
              transparent
                ? "bg-black/95 backdrop-blur-md border-white/10"
                : "bg-background border-border",
            )}
          >
            <Container>
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => {
                  const isActive = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-lg px-4 py-3.5 text-base font-medium transition-colors",
                        transparent
                          ? [
                              isActive
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:bg-white/5 hover:text-white",
                            ]
                          : [
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-foreground/80 hover:bg-muted hover:text-foreground",
                            ],
                      )}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div
                  className={cn(
                    "flex flex-col gap-3 mt-4 pt-4 border-t",
                    transparent ? "border-white/10" : "border-border",
                  )}
                >
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    aria-label="Favoritos"
                    className={cn(
                      "w-full flex justify-start gap-2",
                      transparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "",
                    )}
                  >
                    <Link href="/favoritos" onClick={closeMobileMenu}>
                      <HugeiconsIcon icon={FavouriteIcon} />
                      Favoritos
                    </Link>
                  </Button>
                  <Button
                    variant={transparent ? "default" : "dark"}
                    asChild
                    className={cn(
                      "w-full h-12 flex-1",
                      transparent ? "bg-white text-black hover:bg-neutral-200" : "",
                    )}
                  >
                    <Link
                      href="/login"
                      aria-label="Iniciar sesión en Cofiño"
                      onClick={closeMobileMenu}
                    >
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={16}
                        data-icon="inline-start"
                      />
                      Iniciar sesión
                    </Link>
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </nav>
    </header>
  );
}
