import { z } from "zod"
import type { FieldDefinition } from "@/features/cms/types/block"

function fieldToZod(field: FieldDefinition): z.ZodTypeAny {
  const base = ((): z.ZodTypeAny => {
    switch (field.type) {
      case "number":  return z.number()
      case "boolean": return z.boolean()
      case "list":    return z.array(z.record(z.string(), z.unknown()))
      default:        return z.string()
    }
  })()
  return field.required ? base : base.optional()
}

export function buildBlockSchema(
  fields: FieldDefinition[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of fields) {
    shape[field.key] = fieldToZod(field)
  }
  return z.object(shape)
}

export const seoSchema = z.object({
  title:         z.string().min(1),
  description:   z.string(),
  ogTitle:       z.string(),
  ogDescription: z.string(),
  ogImage:       z.string(),
  canonical:     z.string(),
})

export type SeoInput = z.infer<typeof seoSchema>
