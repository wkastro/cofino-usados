export interface PageContentRecord {
  id: string
  pageSlug: string
  blockKey: string
  value: Record<string, unknown>
  updatedAt: Date
}

export type PageContentMap = Record<string, Record<string, unknown>>

export function toContentMap(records: PageContentRecord[]): PageContentMap {
  return Object.fromEntries(records.map((r) => [r.blockKey, r.value]))
}
