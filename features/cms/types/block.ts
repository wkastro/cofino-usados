export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "url"
  | "date"
  | "s3-image"
  | "s3-video"
  | "s3-document"
  | "list"

export interface FieldDefinition {
  key: string
  label: string
  type: FieldType
  required?: boolean
  s3Path?: string
  options?: string[]
  itemFields?: FieldDefinition[]
}

export interface BlockDefinition<T = Record<string, unknown>> {
  key: string
  label: string
  fields: FieldDefinition[]
  defaultValue: T
}

export const SEO_BLOCK_KEY = "_seo"

export interface SeoContent {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonical: string
}
