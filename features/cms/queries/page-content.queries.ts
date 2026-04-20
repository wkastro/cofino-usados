import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import type { PageContentRecord } from "@/features/cms/types/page-content"

export async function getPageContentRaw(pageSlug: string): Promise<PageContentRecord[]> {
  const rows = await prisma.pageContent.findMany({ where: { pageSlug } })
  return rows as PageContentRecord[]
}

export async function getBlockContentRaw(
  pageSlug: string,
  blockKey: string,
): Promise<Prisma.JsonValue | null> {
  const row = await prisma.pageContent.findUnique({
    where: { pageSlug_blockKey: { pageSlug, blockKey } },
    select: { value: true },
  })
  return row?.value ?? null
}

export async function upsertPageContent(
  pageSlug: string,
  blockKey: string,
  value: Prisma.InputJsonValue,
): Promise<void> {
  await prisma.pageContent.upsert({
    where: { pageSlug_blockKey: { pageSlug, blockKey } },
    create: { pageSlug, blockKey, value },
    update: { value },
  })
}
