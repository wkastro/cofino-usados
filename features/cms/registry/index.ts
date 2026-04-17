import type { BlockDefinition } from "@/features/cms/types/block"
import { heroBlock }          from "@/features/cms/blocks/inicio/hero.block"
import { marqueeBlock }       from "@/features/cms/blocks/inicio/marquee.block"
import { announcementsBlock } from "@/features/cms/blocks/inicio/announcements.block"

export const cmsRegistry: Record<string, BlockDefinition<any>> = {
  [heroBlock.key]:           heroBlock,
  [marqueeBlock.key]:        marqueeBlock,
  [announcementsBlock.key]:  announcementsBlock,
}

export function getBlock(key: string): BlockDefinition<any> | undefined {
  return cmsRegistry[key]
}

export function getPageBlocks(pageSlug: string): BlockDefinition<any>[] {
  const pageBlockMap: Record<string, string[]> = {
    inicio: [heroBlock.key, marqueeBlock.key, announcementsBlock.key],
  }
  return (pageBlockMap[pageSlug] ?? []).map((k) => cmsRegistry[k]).filter(Boolean)
}
