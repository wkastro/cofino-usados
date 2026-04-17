"use server"

import { updateTag }                              from "next/cache"
import { Prisma }                                 from "@/generated/prisma/client"
import { requireAdmin }                           from "@/lib/auth-guard"
import { upsertPageContent }                      from "@/features/cms/queries/page-content.queries"
import { getBlock }                               from "@/features/cms/registry"
import { buildBlockSchema, seoSchema }            from "@/features/cms/validations/page-content"
import { SEO_BLOCK_KEY }                          from "@/features/cms/types/block"
import { deleteS3Object }                         from "@/features/s3/delete"

type ActionResult = { ok: boolean; message: string }

export async function saveBlockContent(
  pageSlug: string,
  blockKey: string,
  value: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin()

  const block = getBlock(blockKey)
  if (!block) return { ok: false, message: "Bloque no encontrado." }

  const schema = buildBlockSchema(block.fields)
  const parsed = schema.safeParse(value)
  if (!parsed.success) return { ok: false, message: "Datos inválidos." }

  try {
    await upsertPageContent(pageSlug, blockKey, parsed.data as Prisma.InputJsonValue)
    updateTag(`cms-${pageSlug}`)
    return { ok: true, message: "Bloque guardado." }
  } catch (error) {
    console.error(`[saveBlockContent:${pageSlug}/${blockKey}]`, error)
    return { ok: false, message: "Error al guardar." }
  }
}

export async function saveSeoContent(
  pageSlug: string,
  value: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = seoSchema.safeParse(value)
  if (!parsed.success) return { ok: false, message: "Datos SEO inválidos." }

  try {
    await upsertPageContent(pageSlug, SEO_BLOCK_KEY, parsed.data as Prisma.InputJsonValue)
    updateTag(`cms-${pageSlug}`)
    return { ok: true, message: "SEO guardado." }
  } catch (error) {
    console.error(`[saveSeoContent:${pageSlug}]`, error)
    return { ok: false, message: "Error al guardar SEO." }
  }
}

export async function deleteMediaFromBlock(
  pageSlug: string,
  blockKey: string,
  fieldKey: string,
  currentValue: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin()

  const block = getBlock(blockKey)
  if (!block) return { ok: false, message: "Bloque no encontrado." }

  const validField = block.fields.find((f) => f.key === fieldKey)
  if (!validField) return { ok: false, message: "Campo no válido." }

  const url = currentValue[fieldKey]
  if (typeof url === "string" && url.startsWith("http")) {
    await deleteS3Object(url)
  }

  const updated = { ...currentValue, [fieldKey]: "" }
  return saveBlockContent(pageSlug, blockKey, updated)
}
