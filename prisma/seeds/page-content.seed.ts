import type { PrismaClient } from "../../generated/prisma/client"
import { heroBlock }          from "../../features/cms/blocks/inicio/hero.block"
import { marqueeBlock }       from "../../features/cms/blocks/inicio/marquee.block"
import { announcementsBlock } from "../../features/cms/blocks/inicio/announcements.block"

const INICIO_BLOCKS = [
  { blockKey: heroBlock.key,          value: heroBlock.defaultValue          },
  { blockKey: marqueeBlock.key,       value: marqueeBlock.defaultValue       },
  { blockKey: announcementsBlock.key, value: announcementsBlock.defaultValue },
  {
    blockKey: "_seo",
    value: {
      title:         "Cofiño Usados | Autos de calidad con respaldo",
      description:   "Encuentra tu próximo auto usado con la confianza y respaldo de Cofiño Stahl Usados.",
      ogTitle:       "Cofiño Usados | Autos de calidad con respaldo",
      ogDescription: "Encuentra tu próximo auto usado con la confianza y respaldo de Cofiño Stahl Usados.",
      ogImage:       "",
      canonical:     "",
    },
  },
]

export async function seedPageContent(prisma: PrismaClient) {
  for (const block of INICIO_BLOCKS) {
    await prisma.pageContent.upsert({
      where:  { pageSlug_blockKey: { pageSlug: "inicio", blockKey: block.blockKey } },
      create: { pageSlug: "inicio", blockKey: block.blockKey, value: block.value as any },
      update: {},
    })
  }
  console.log("  ✓ PageContent (inicio) seeded")
}
