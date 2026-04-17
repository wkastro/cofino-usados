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
        { key: "imagen",      label: "Imagen",          type: "s3-image", s3Path: "inicio/announcements" },
        { key: "alt",         label: "Alt (imagen)",    type: "text"      },
        { key: "titulo",      label: "Título",          type: "text",     required: true },
        { key: "descripcion", label: "Descripción",     type: "textarea"  },
        { key: "botonTexto",  label: "Texto del botón", type: "text"      },
        { key: "enlace",      label: "Enlace",          type: "url"       },
      ],
    },
  ],
  defaultValue: {
    items: [
      {
        imagen:      "/anuncio_toyota.jpg",
        alt:         "Toyota SUV en campo abierto",
        titulo:      "Historias que mueven",
        descripcion: "Conoce a quienes ya confiaron en Cofiño Usados y encontraron su vehículo ideal.",
        botonTexto:  "Testimonios",
        enlace:      "/testimonios",
      },
      {
        imagen:      "/anuncio_vende.jpg",
        alt:         "Vende tu vehículo con Cofiño Usados",
        titulo:      "¿Querés vender tu vehículo?",
        descripcion: "Te ayudamos a publicar, negociar y cerrar la venta de forma rápida y segura.",
        botonTexto:  "Más información",
        enlace:      "/intercambiar",
      },
    ],
  },
}
