import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const menuLinks = [
  { label: "Comprar", href: "/comprar" },
  { label: "Intercambiar auto", href: "/intercambiar" },
  { label: "Próximamente", href: "/proximamente" },
  { label: "Certificados", href: "/certificados" },
  { label: "Consignación", href: "/consignacion" },
];

const sucursales = [
  "Agencia Calzada Roosevelt",
  "Agencia Yurrita",
  "Agencia Arrazola",
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "TikTok", href: "#", icon: TikTokIcon },
];

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
              {menuLinks.map((link) => (
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
                {sucursales.map((name) => (
                  <li key={name} className="text-sm text-white/80">
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
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
          <span>
            {new Date().getFullYear()}{" "}
            <span className="font-bold text-white">Cofiño Usados</span>
          </span>
        </Container>
      </div>
    </footer>
  );
}

/* ---- Inline SVG icons ---- */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
    </svg>
  );
}
