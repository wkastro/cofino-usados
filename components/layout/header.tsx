"use client";

import { useState } from "react";
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

const navLinks = [
  { label: "Comprar", href: "/comprar" },
  { label: "Intercambiar", href: "/intercambiar" },
  { label: "Próximamente", href: "/proximamente" },
  { label: "Certificados", href: "/certificados" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-cofino.svg"
              alt="Cofiño"
              width={180}
              height={40}
              className="brightness-0 dark:invert"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="icon" aria-label="Favoritos">
              <HugeiconsIcon
                icon={FavouriteIcon}
                style={{ width: 20, height: 20 }}
              />
            </Button>
            <Button variant="dark" asChild>
              <Link href="/login">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={16}
                  style={{ width: 18, height: 18 }}
                  data-icon="inline-start"
                />
                Iniciar sesión
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <HugeiconsIcon
              icon={mobileMenuOpen ? Cancel01Icon : Menu02Icon}
              size={22}
            />
          </Button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 border-t border-border py-4">
              <Button variant="ghost" size="lg" aria-label="Favoritos">
                <HugeiconsIcon icon={FavouriteIcon} />
              </Button>
              <Button variant="dark" className="flex-1" asChild>
                <Link href="/login">
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={16}
                    data-icon="inline-start"
                  />
                  Iniciar sesión
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
