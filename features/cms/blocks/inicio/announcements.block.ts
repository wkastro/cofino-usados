import type { BlockDefinition } from "@/features/cms/types/block"

export interface AnnouncementItem {
  imagen:      string
  alt:         string
  titulo:      string
  descripcion: string
  botonTexto:  string
  enlace:      string
}

export interface AnnouncementsContent {
  items: AnnouncementItem[]
}

export const announcementsBlock: BlockDefinition<AnnouncementsContent> = {
  key: "announcements",
  label: "Grilla de Anuncios",
  fields: [
    {
      key: "items",
      label: "Anuncios",
      type: "list",
      itemFields: [
        { key: "imagen",      label: "Imagen",          type: "s3-image", s3Path: "inicio/announcements", imageHint: "1200×675 px (16:9)" },
        { key: "alt",         label: "Alt (imagen)",    type: "text"      },
        { key: "titulo",      label: "Título",          type: "text",     required: true },
        { key: "descripcion", label: "Descripción",     type: "textarea"  },
        { key: "botonTexto",  label: "Texto del botón", type: "text"      },
        { key: "enlace",      label: "Enlace",          type: "url"       },
      ],
    },
  ],
  defaultValue: {
    items: [],
  },
}
