import Image from "next/image"
import { EffectMarquee }       from "@/components/global/effect-marquee"
import type { MarqueeContent } from "@/features/cms/blocks/inicio/marquee.block"
import { marqueeBlock }        from "@/features/cms/blocks/inicio/marquee.block"

interface WrapperMarqueeProps {
  content?: MarqueeContent
}

export default function WrapperMarquee({ content = marqueeBlock.defaultValue }: WrapperMarqueeProps) {
  return (
    <section className="py-10">
      <h2 className="text-center font-semibold mb-8">{content.titulo}</h2>
      <EffectMarquee speed={24} gap={64}>
        {content.items.map((brand) => (
          <div key={brand.nombre} className="relative w-28 h-10 shrink-0">
            <Image
              src={brand.logoUrl}
              alt={brand.nombre}
              fill
              sizes="112px"
              className="object-contain opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </EffectMarquee>
    </section>
  )
}
