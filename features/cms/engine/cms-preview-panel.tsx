"use client"

import Hero             from "@/components/sections/home/hero"
import WrapperMarquee   from "@/components/sections/home/wrapper-marquee"
import AnnouncementGrid from "@/components/sections/home/announcement-grid"
import type { HeroContent }          from "@/features/cms/blocks/inicio/hero.block"
import type { MarqueeContent }       from "@/features/cms/blocks/inicio/marquee.block"
import type { AnnouncementsContent } from "@/features/cms/blocks/inicio/announcements.block"

type PreviewComponentProps = { content: unknown }

const PREVIEW_MAP: Record<string, React.ComponentType<PreviewComponentProps>> = {
  hero:          ({ content }) => <Hero content={content as HeroContent} />,
  marquee:       ({ content }) => <WrapperMarquee content={content as MarqueeContent} />,
  announcements: ({ content }) => <AnnouncementGrid content={content as AnnouncementsContent} />,
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
