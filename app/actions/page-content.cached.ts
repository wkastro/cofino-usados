"use cache"

import { cacheTag, cacheLife } from "next/cache"
import { getPageContentRaw } from "@/features/cms/queries/page-content.queries"
import { toContentMap } from "@/features/cms/types/page-content"
import type { PageContentMap } from "@/features/cms/types/page-content"

export async function getPageContent(pageSlug: string): Promise<PageContentMap> {
  cacheTag(`cms-${pageSlug}`)
  cacheLife("days")
  const records = await getPageContentRaw(pageSlug)
  return toContentMap(records)
}
