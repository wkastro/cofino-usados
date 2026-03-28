import Image from "next/image";
import { EffectMarquee } from "@/components/global/effect-marquee";

const BRANDS = [
  { name: "Toyota",     src: "/brands/toyota.svg" },
  { name: "Audi",       src: "/brands/audi.svg" },
  { name: "BYD",        src: "/brands/byd.svg" },
  { name: "Land Rover", src: "/brands/landrover.svg" },
  { name: "Lexus",      src: "/brands/lexus.svg" },
  { name: "Renault",    src: "/brands/renault.svg" },
];

export default function WrapperMarquee() {
  return (
    <section className="py-10">
      <h2 className="text-center font-semibold mb-8">Marcas aliadas</h2>
      <EffectMarquee speed={24} gap={64}>
        {BRANDS.map((brand) => (
          <div key={brand.name} className="relative w-28 h-10 shrink-0">
            <Image
              src={brand.src}
              alt={brand.name}
              fill
              sizes="112px"
              className="object-contain opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </EffectMarquee>
    </section>
  );
}