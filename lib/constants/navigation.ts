import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
} from "@/components/layout/footer-icons";

interface NavLink {
  readonly label: string;
  readonly href: string;
}

interface SocialLink extends NavLink {
  readonly icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const navLinks = [
  { label: "Comprar", href: "/comprar" },
  { label: "Intercambiar", href: "/intercambiar" },
  { label: "Próximamente", href: "/proximamente" },
  { label: "Certificados", href: "/certificados" },
] as const satisfies readonly NavLink[];

export const footerMenuLinks = [
  { label: "Comprar", href: "/comprar" },
  { label: "Intercambiar auto", href: "/intercambiar" },
  { label: "Próximamente", href: "/proximamente" },
  { label: "Certificados", href: "/certificados" },
  { label: "Consignación", href: "/consignacion" },
] as const satisfies readonly NavLink[];

export const footerBranches = [
  "Agencia Calzada Roosevelt",
  "Agencia Yurrita",
  "Agencia Arrazola",
] as const;

export const footerSocialLinks: readonly SocialLink[] = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "TikTok", href: "#", icon: TikTokIcon },
];
