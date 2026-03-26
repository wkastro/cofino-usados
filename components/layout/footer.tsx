import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CurrentYear } from "@/components/layout/current-year";
import {
  footerBranches,
  footerMenuLinks,
  footerSocialLinks,
} from "@/lib/constants/navigation";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <Container className="py-12 lg:py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto_auto] lg:gap-20">
          {/* Newsletter column */}
          <div className="max-w-md space-y-6">
            {/* Logo */}
            <Image
              src="/logo-cofino.svg"
              alt="Cofiño"
              width={260}
              height={58}
              className="brightness-0 invert"
            />

            <div className="space-y-2">
              <h3 className="text-2xl font-bold leading-tight sm:text-3xl">
                Mantente al día con
                <br />
                Cofiño Usados
              </h3>
              <p className="text-sm text-white/60">
                Suscríbete a nuestro boletín y recibe información exclusiva
                sobre nuevos modelos, beneficios especiales y novedades.
              </p>
            </div>

            {/* Email subscription */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Correo electrónico</p>
              <div className="flex items-center gap-0 rounded-4xl border border-white/20 bg-white/10 pl-4">
                <input
                  type="email"
                  placeholder="Ingresa tu correo electronico"
                  className="h-11 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
                <Button variant="lime" size="sm" className="mr-1 px-5">
                  Suscribirme
                </Button>
              </div>
            </div>
          </div>

          {/* Menu column */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Menú</h4>
            <nav className="flex flex-col gap-2.5">
              {footerMenuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sucursales + Social column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Sucursales</h4>
              <ul className="flex flex-col gap-2.5">
                {footerBranches.map((name) => (
                  <li key={name} className="text-sm text-white/80">
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {footerSocialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white hover:text-brand-lime"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-center gap-2 py-5 text-sm text-white/50 sm:flex-row sm:gap-8">
          <span>
            Powered by <span className="font-bold text-white">Aumenta</span>
          </span>
          <Suspense>
            <CurrentYear />
          </Suspense>
        </Container>
      </div>
    </footer>
  );
}
