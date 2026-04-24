"use client"

import Hero             from "@/components/sections/home/hero"
import WrapperMarquee   from "@/components/sections/home/wrapper-marquee"
import AnnouncementGrid from "@/components/sections/home/announcement-grid"
import { VideoShowcase } from "@/features/vehicle-detail/components/video-showcase"
import { LoanCalculator } from "@/features/vehicle-detail/components/loan-calculator"
import type { HeroContent }           from "@/features/cms/blocks/inicio/hero.block"
import type { MarqueeContent }        from "@/features/cms/blocks/inicio/marquee.block"
import type { AnnouncementsContent }  from "@/features/cms/blocks/inicio/announcements.block"
import type { VideoShowcaseContent }  from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block"
import type { CalculadoraContent }    from "@/features/cms/blocks/detalle-vehiculo/calculadora.block"
import { videoShowcaseBlock }         from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block"

type PreviewComponentProps = { content: unknown }

const PREVIEW_MAP: Record<string, React.ComponentType<PreviewComponentProps>> = {
  hero:              ({ content }) => <Hero content={content as HeroContent} />,
  marquee:           ({ content }) => <WrapperMarquee content={content as MarqueeContent} />,
  announcements:     ({ content }) => <AnnouncementGrid content={content as AnnouncementsContent} />,
  "video-showcase":  ({ content }) => {
    const c = content as VideoShowcaseContent
    const videoUrl = c.videoArchivoUrl || c.videoUrl || videoShowcaseBlock.defaultValue.videoUrl
    return (
      <div className="p-4">
        <VideoShowcase
          videoUrl={videoUrl}
          coverImage={c.coverImage || videoShowcaseBlock.defaultValue.coverImage}
          title={c.titulo || videoShowcaseBlock.defaultValue.titulo}
          subtitle={c.subtitulo || videoShowcaseBlock.defaultValue.subtitulo}
        />
      </div>
    )
  },
  calculadora: ({ content }) => {
    const c = content as CalculadoraContent
    return (
      <div className="p-4 bg-muted/30">
        <LoanCalculator
          vehiclePrice={25000}
          titulo={c.titulo}
          descripcion={c.descripcion}
          bancos={c.bancos}
          cuotas={c.cuotas}
        />
      </div>
    )
  },
}

interface CmsPreviewPanelProps {
  blockKey: string
  values:   Record<string, unknown>
}

export function CmsPreviewPanel({ blockKey, values }: CmsPreviewPanelProps) {
  const PreviewComponent = PREVIEW_MAP[blockKey]

  if (!PreviewComponent) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-sm border rounded-lg">
        Vista previa no disponible para este bloque.
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-white">
      <div
        className="pointer-events-none origin-top-left"
        style={{
          transform: "scale(0.45)",
          width: "222%",
          transformOrigin: "top left",
        }}
      >
        <PreviewComponent content={values} />
      </div>
    </div>
  )
}
