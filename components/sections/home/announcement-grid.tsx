import { AnnouncementCard }          from "@/components/global/announcement-card"
import type { AnnouncementsContent } from "@/features/cms/blocks/inicio/announcements.block"
import { announcementsBlock }        from "@/features/cms/blocks/inicio/announcements.block"

interface AnnouncementGridProps {
  content?: AnnouncementsContent
}

export default function AnnouncementGrid({ content = announcementsBlock.defaultValue }: AnnouncementGridProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
      {content.items.map((item, i) => (
        <AnnouncementCard
          key={i}
          image={item.imagen}
          alt={item.alt}
          title={item.titulo}
          description={item.descripcion}
          buttonText={item.botonTexto}
          href={item.enlace}
        />
      ))}
    </section>
  )
}
