import type { BlockDefinition } from "@/features/cms/types/block"
import { heroBlock }            from "@/features/cms/blocks/inicio/hero.block"
import { marqueeBlock }         from "@/features/cms/blocks/inicio/marquee.block"
import { announcementsBlock }   from "@/features/cms/blocks/inicio/announcements.block"
import { videoShowcaseBlock }   from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block"
import { calculadoraBlock }     from "@/features/cms/blocks/detalle-vehiculo/calculadora.block"

export const cmsRegistry: Record<string, BlockDefinition<any>> = {
  [heroBlock.key]:           heroBlock,
  [marqueeBlock.key]:        marqueeBlock,
  [announcementsBlock.key]:  announcementsBlock,
  [videoShowcaseBlock.key]:  videoShowcaseBlock,
  [calculadoraBlock.key]:    calculadoraBlock,
}

export function getBlock(key: string): BlockDefinition<any> | undefined {
  return cmsRegistry[key]
}

export function getPageBlocks(pageSlug: string): BlockDefinition<any>[] {
  const pageBlockMap: Record<string, string[]> = {
    inicio:            [heroBlock.key, marqueeBlock.key, announcementsBlock.key],
    "detalle-vehiculo": [videoShowcaseBlock.key, calculadoraBlock.key],
  }
  return (pageBlockMap[pageSlug] ?? []).map((k) => cmsRegistry[k]).filter(Boolean)
}
