import type { BlockDefinition } from "@/features/cms/types/block"

export interface MarqueeItem {
  nombre: string
  logoUrl: string
}

export interface MarqueeContent {
  titulo: string
  items: MarqueeItem[]
}

export const marqueeBlock: BlockDefinition<MarqueeContent> = {
  key: "marquee",
  label: "Marcas Aliadas",
  fields: [
    { key: "titulo", label: "Título de sección", type: "text" },
    {
      key: "items",
      label: "Marcas",
      type: "list",
      itemFields: [
        { key: "nombre",  label: "Nombre",  type: "text"      },
        { key: "logoUrl", label: "Logo",    type: "s3-image",  s3Path: "inicio/marquee" },
      ],
    },
  ],
  defaultValue: {
    titulo: "Marcas aliadas",
    items: [
      { nombre: "Toyota",     logoUrl: "/brands/toyota.svg"    },
      { nombre: "Audi",       logoUrl: "/brands/audi.svg"      },
      { nombre: "BYD",        logoUrl: "/brands/byd.svg"       },
      { nombre: "Land Rover", logoUrl: "/brands/landrover.svg" },
      { nombre: "Lexus",      logoUrl: "/brands/lexus.svg"     },
      { nombre: "Renault",    logoUrl: "/brands/renault.svg"   },
    ],
  },
}
