# CMS Página Inicio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar un sistema CMS basado en bloques registrados que permite al admin editar el contenido de la página Inicio (`/`) desde `/dashboard/inicio`, con formularios estructurados, previsualización en tiempo real con los componentes reales, y gestión de metadatos SEO.

**Architecture:** Modelo genérico `PageContent` en BD (pageSlug + blockKey + value JSON). Cada bloque se define en `features/cms/blocks/inicio/` como un `BlockDefinition` con campos tipados. El motor CMS en `features/cms/engine/` lee el registro y renderiza el formulario y preview correctos. Los componentes públicos se refactorizan para aceptar props de contenido.

**Tech Stack:** Next.js 16 App Router, React 19, Prisma 7 + MariaDB, React Hook Form + Zod v4, Tailwind CSS v4, shadcn/ui, @dnd-kit (ya instalado), `use cache` + `cacheTag` + `updateTag`, Server Actions, aws4fetch (S3).

**Spec:** `docs/superpowers/specs/2026-04-17-cms-design.md`

---

## Mapa de archivos

### Crear
| Archivo | Responsabilidad |
|---|---|
| `features/cms/types/block.ts` | Interfaces `BlockDefinition`, `FieldDefinition` |
| `features/cms/types/page-content.ts` | Tipo `PageContentRecord` (fila de BD) |
| `features/cms/blocks/inicio/hero.block.ts` | Definición del bloque Hero |
| `features/cms/blocks/inicio/marquee.block.ts` | Definición del bloque Marquee |
| `features/cms/blocks/inicio/announcements.block.ts` | Definición del bloque Announcements |
| `features/cms/registry/index.ts` | Registro central de bloques |
| `features/cms/queries/page-content.queries.ts` | Query Prisma sin caché |
| `app/actions/page-content.cached.ts` | `getPageContent` con `use cache` |
| `features/cms/validations/page-content.ts` | Zod schema derivado de `BlockDefinition.fields` |
| `features/cms/actions/page-content.actions.ts` | `saveBlockContent`, `saveSeoContent`, `deleteMediaFromBlock` |
| `features/cms/engine/cms-field-renderer.tsx` | Switch por `field.type` → control correcto |
| `features/cms/engine/cms-s3-field.tsx` | Control de upload S3 con progress bar |
| `features/cms/engine/cms-list-field.tsx` | Control lista con drag-to-reorder (@dnd-kit) |
| `features/cms/engine/cms-block-editor.tsx` | Formulario de un bloque (itera fields) |
| `features/cms/engine/cms-preview-panel.tsx` | Renderiza componente real escalado con valores del form |
| `features/cms/engine/cms-page-editor.tsx` | Layout principal: tabs Contenido/SEO + save |
| `app/dashboard/inicio/page.tsx` | Página del editor CMS de Inicio |
| `prisma/seeds/page-content.seed.ts` | Seed con valores actuales hardcodeados |

### Modificar
| Archivo | Cambio |
|---|---|
| `prisma/schema.prisma` | Agregar modelo `PageContent` |
| `features/s3/keys.ts` | Agregar `generateCmsKey` |
| `app/api/upload/route.ts` | Agregar rutas CMS (`cms-image`, `cms-video`, `cms-document`) |
| `components/sections/home/hero.tsx` | Aceptar `content: HeroContent` como prop |
| `components/sections/home/wrapper-marquee.tsx` | Aceptar `content: MarqueeContent` como prop |
| `components/sections/home/announcement-grid.tsx` | Aceptar `content: AnnouncementsContent` como prop |
| `app/(site)/page.tsx` | Consumir CMS + `generateMetadata` |
| `prisma/seed.ts` | Importar y ejecutar `seedPageContent` |

---

## Task 1: Modelo Prisma PageContent + migración

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Agregar modelo PageContent al schema**

Abrir `prisma/schema.prisma` y agregar al final, después de `enum Role`:

```prisma
// ─── CMS ─────────────────────────────────────────────────────────────────────

model PageContent {
  id        String   @id @default(uuid()) @db.Char(36)
  pageSlug  String
  blockKey  String
  value     Json
  updatedAt DateTime @updatedAt

  @@unique([pageSlug, blockKey])
  @@index([pageSlug])
}
```

- [ ] **Step 2: Generar migración y cliente Prisma**

```bash
npx prisma migrate dev --name add_page_content
```

Expected output: `✔ Generated Prisma Client` y `Your database is now in sync with your schema.`

- [ ] **Step 3: Verificar que el cliente generado incluye PageContent**

```bash
grep -r "pageContent" generated/prisma/
```

Expected: líneas que contengan `pageContent` en el cliente generado.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add PageContent model for CMS"
```

---

## Task 2: Tipos CMS

**Files:**
- Create: `features/cms/types/block.ts`
- Create: `features/cms/types/page-content.ts`

- [ ] **Step 1: Crear tipos de bloque**

Crear `features/cms/types/block.ts`:

```ts
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
```

- [ ] **Step 2: Crear tipo PageContentRecord**

Crear `features/cms/types/page-content.ts`:

```ts
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
```

- [ ] **Step 3: Verificar tipos con TypeScript**

```bash
npx tsc --noEmit
```

Expected: sin errores relacionados con los nuevos archivos.

- [ ] **Step 4: Commit**

```bash
git add features/cms/types/
git commit -m "feat(cms): add BlockDefinition and PageContentRecord types"
```

---

## Task 3: Definiciones de bloques — Inicio

**Files:**
- Create: `features/cms/blocks/inicio/hero.block.ts`
- Create: `features/cms/blocks/inicio/marquee.block.ts`
- Create: `features/cms/blocks/inicio/announcements.block.ts`

- [ ] **Step 1: Crear bloque Hero**

Crear `features/cms/blocks/inicio/hero.block.ts`:

```ts
import type { BlockDefinition } from "@/features/cms/types/block"

export interface HeroContent {
  titulo: string
  subtitulo: string
  videoUrl: string
  posterUrl: string
}

export const heroBlock: BlockDefinition<HeroContent> = {
  key: "hero",
  label: "Hero Principal",
  fields: [
    { key: "titulo",    label: "Título",    type: "text",      required: true },
    { key: "subtitulo", label: "Subtítulo", type: "textarea"                  },
    { key: "videoUrl",  label: "Video",     type: "s3-video",  s3Path: "inicio/hero" },
    { key: "posterUrl", label: "Poster",    type: "s3-image",  s3Path: "inicio/hero" },
  ],
  defaultValue: {
    titulo: "Tu nuevo auto con el respaldo que mereces",
    subtitulo: "Calidad seguridad y confianza en cada kilómetro",
    videoUrl: "",
    posterUrl: "",
  },
}
```

- [ ] **Step 2: Crear bloque Marquee**

Crear `features/cms/blocks/inicio/marquee.block.ts`:

```ts
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
```

- [ ] **Step 3: Crear bloque Announcements**

Crear `features/cms/blocks/inicio/announcements.block.ts`:

```ts
import type { BlockDefinition } from "@/features/cms/types/block"

export interface AnnouncementItem {
  imagen:      string
  alt:         string
  titulo:      string
  descripcion: string
  botonTexto:  string
  enlace:      string
}

export interface AnnouncementsContent {
  items: AnnouncementItem[]
}

export const announcementsBlock: BlockDefinition<AnnouncementsContent> = {
  key: "announcements",
  label: "Grilla de Anuncios",
  fields: [
    {
      key: "items",
      label: "Anuncios",
      type: "list",
      itemFields: [
        { key: "imagen",      label: "Imagen",        type: "s3-image", s3Path: "inicio/announcements" },
        { key: "alt",         label: "Alt (imagen)",  type: "text"      },
        { key: "titulo",      label: "Título",        type: "text",     required: true },
        { key: "descripcion", label: "Descripción",   type: "textarea"  },
        { key: "botonTexto",  label: "Texto del botón", type: "text"    },
        { key: "enlace",      label: "Enlace",        type: "url"       },
      ],
    },
  ],
  defaultValue: {
    items: [
      {
        imagen:      "/anuncio_toyota.jpg",
        alt:         "Toyota SUV en campo abierto",
        titulo:      "Historias que mueven",
        descripcion: "Conoce a quienes ya confiaron en Cofiño Usados y encontraron su vehículo ideal.",
        botonTexto:  "Testimonios",
        enlace:      "/testimonios",
      },
      {
        imagen:      "/anuncio_vende.jpg",
        alt:         "Vende tu vehículo con Cofiño Usados",
        titulo:      "¿Querés vender tu vehículo?",
        descripcion: "Te ayudamos a publicar, negociar y cerrar la venta de forma rápida y segura.",
        botonTexto:  "Más información",
        enlace:      "/intercambiar",
      },
    ],
  },
}
```

- [ ] **Step 4: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add features/cms/blocks/
git commit -m "feat(cms): add block definitions for Inicio page (hero, marquee, announcements)"
```

---

## Task 4: Registro central de bloques

**Files:**
- Create: `features/cms/registry/index.ts`

- [ ] **Step 1: Crear el registro**

Crear `features/cms/registry/index.ts`:

```ts
import type { BlockDefinition } from "@/features/cms/types/block"
import { heroBlock }          from "@/features/cms/blocks/inicio/hero.block"
import { marqueeBlock }       from "@/features/cms/blocks/inicio/marquee.block"
import { announcementsBlock } from "@/features/cms/blocks/inicio/announcements.block"

export const cmsRegistry: Record<string, BlockDefinition> = {
  [heroBlock.key]:           heroBlock,
  [marqueeBlock.key]:        marqueeBlock,
  [announcementsBlock.key]:  announcementsBlock,
}

export function getBlock(key: string): BlockDefinition | undefined {
  return cmsRegistry[key]
}

export function getPageBlocks(pageSlug: string): BlockDefinition[] {
  const pageBlockMap: Record<string, string[]> = {
    inicio: [heroBlock.key, marqueeBlock.key, announcementsBlock.key],
  }
  return (pageBlockMap[pageSlug] ?? []).map((k) => cmsRegistry[k]).filter(Boolean)
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add features/cms/registry/
git commit -m "feat(cms): add block registry with getBlock and getPageBlocks helpers"
```

---

## Task 5: Query y acción cacheada

**Files:**
- Create: `features/cms/queries/page-content.queries.ts`
- Create: `app/actions/page-content.cached.ts`

- [ ] **Step 1: Crear query raw (sin caché)**

Crear `features/cms/queries/page-content.queries.ts`:

```ts
import { prisma } from "@/lib/prisma"
import type { PageContentRecord } from "@/features/cms/types/page-content"

export async function getPageContentRaw(pageSlug: string): Promise<PageContentRecord[]> {
  const rows = await prisma.pageContent.findMany({ where: { pageSlug } })
  return rows as PageContentRecord[]
}

export async function upsertPageContent(
  pageSlug: string,
  blockKey: string,
  value: Record<string, unknown>,
): Promise<void> {
  await prisma.pageContent.upsert({
    where:  { pageSlug_blockKey: { pageSlug, blockKey } },
    create: { pageSlug, blockKey, value },
    update: { value },
  })
}
```

- [ ] **Step 2: Crear acción cacheada**

Crear `app/actions/page-content.cached.ts`:

```ts
"use cache"

import { cacheTag, cacheLife } from "next/cache"
import { getPageContentRaw }   from "@/features/cms/queries/page-content.queries"
import { toContentMap }        from "@/features/cms/types/page-content"
import type { PageContentMap } from "@/features/cms/types/page-content"

export async function getPageContent(pageSlug: string): Promise<PageContentMap> {
  cacheTag(`cms-${pageSlug}`)
  cacheLife("days")
  const records = await getPageContentRaw(pageSlug)
  return toContentMap(records)
}
```

- [ ] **Step 3: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add features/cms/queries/ app/actions/page-content.cached.ts
git commit -m "feat(cms): add page content query and cached action"
```

---

## Task 6: Validación y Server Actions

**Files:**
- Create: `features/cms/validations/page-content.ts`
- Create: `features/cms/actions/page-content.actions.ts`

- [ ] **Step 1: Crear utilidad de validación dinámica**

Crear `features/cms/validations/page-content.ts`:

```ts
import { z } from "zod"
import type { FieldDefinition } from "@/features/cms/types/block"
import { SEO_BLOCK_KEY }       from "@/features/cms/types/block"

function fieldToZod(field: FieldDefinition): z.ZodTypeAny {
  const base = (() => {
    switch (field.type) {
      case "number":   return z.number()
      case "boolean":  return z.boolean()
      case "list":     return z.array(z.record(z.unknown()))
      default:         return z.string()
    }
  })()
  return field.required ? base : base.optional()
}

export function buildBlockSchema(fields: FieldDefinition[]): z.ZodObject<z.ZodRawShape> {
  const shape: z.ZodRawShape = {}
  for (const field of fields) {
    shape[field.key] = fieldToZod(field)
  }
  return z.object(shape)
}

export const seoSchema = z.object({
  title:          z.string().min(1),
  description:    z.string(),
  ogTitle:        z.string(),
  ogDescription:  z.string(),
  ogImage:        z.string(),
  canonical:      z.string(),
})

export type SeoInput = z.infer<typeof seoSchema>
```

- [ ] **Step 2: Crear Server Actions**

Crear `features/cms/actions/page-content.actions.ts`:

```ts
"use server"

import { updateTag }           from "next/cache"
import { requireAdmin }        from "@/lib/auth-guard"
import { upsertPageContent }   from "@/features/cms/queries/page-content.queries"
import { getBlock }            from "@/features/cms/registry"
import { buildBlockSchema, seoSchema } from "@/features/cms/validations/page-content"
import { SEO_BLOCK_KEY }       from "@/features/cms/types/block"
import { deleteS3Object }      from "@/features/s3/delete"

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
    await upsertPageContent(pageSlug, blockKey, parsed.data as Record<string, unknown>)
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
    await upsertPageContent(pageSlug, SEO_BLOCK_KEY, parsed.data)
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

  const url = currentValue[fieldKey]
  if (typeof url === "string" && url.startsWith("http")) {
    await deleteS3Object(url)
  }

  const updated = { ...currentValue, [fieldKey]: "" }
  return saveBlockContent(pageSlug, blockKey, updated)
}
```

- [ ] **Step 3: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add features/cms/validations/ features/cms/actions/
git commit -m "feat(cms): add block validation and server actions (save, delete media)"
```

---

## Task 7: Soporte CMS en la API de upload y clave S3

**Files:**
- Modify: `features/s3/keys.ts`
- Modify: `app/api/upload/route.ts`

- [ ] **Step 1: Agregar `generateCmsKey` en keys.ts**

Abrir `features/s3/keys.ts` y agregar al final:

```ts
/**
 * Generates an S3 key for CMS content.
 * Pattern: {pageSlug}/{blockKey}/{timestamp}-{sanitizedFilename}
 * Example: inicio/hero/1714000000000-hero-video.mp4
 */
export function generateCmsKey(pageSlug: string, blockKey: string, filename: string): string {
  return `${pageSlug}/${blockKey}/${Date.now()}-${sanitize(filename)}`
}
```

- [ ] **Step 2: Agregar rutas CMS en el upload handler**

Abrir `app/api/upload/route.ts`.

Reemplazar la definición de `ROUTE_CONFIG` para agregar las rutas CMS:

```ts
const ROUTE_CONFIG = {
  "vehiculo-images": {
    category: "images" as FileCategory,
    types: ["image/"],
    maxSize: 5 * 1024 * 1024,
    maxFiles: 10,
    isCms: false,
  },
  "vehiculo-videos": {
    category: "videos" as FileCategory,
    types: ["video/"],
    maxSize: 100 * 1024 * 1024,
    maxFiles: 3,
    isCms: false,
  },
  "vehiculo-documents": {
    category: "documents" as FileCategory,
    types: ["application/pdf", "text/"],
    maxSize: 20 * 1024 * 1024,
    maxFiles: 5,
    isCms: false,
  },
  "cms-image": {
    category: "images" as FileCategory,
    types: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    isCms: true,
  },
  "cms-video": {
    category: "videos" as FileCategory,
    types: ["video/mp4", "video/webm"],
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
    isCms: true,
  },
  "cms-document": {
    category: "documents" as FileCategory,
    types: ["application/pdf"],
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    isCms: true,
  },
} as const
```

Agregar `import { generateCmsKey, generateKey, buildPublicUrl } from "@/features/s3/keys"` (reemplaza el import existente que solo tenía `generateKey`).

Reemplazar la línea donde se genera la key dentro del loop de `for (const file of files)`:

```ts
const key = config.isCms
  ? generateCmsKey(
      formData.get("pageSlug") as string ?? "cms",
      formData.get("blockKey") as string ?? "block",
      file.name,
    )
  : generateKey(config.category, "vehiculos", vehiculoId, file.name)
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add features/s3/keys.ts app/api/upload/route.ts
git commit -m "feat(s3): add generateCmsKey and cms upload routes (image/video/document)"
```

---

## Task 8: Refactorizar componente Hero

**Files:**
- Modify: `components/sections/home/hero.tsx`

- [ ] **Step 1: Actualizar Hero para aceptar content props**

Reemplazar el contenido de `components/sections/home/hero.tsx`:

```tsx
import { Container } from "@/components/layout/container"
import type { HeroContent } from "@/features/cms/blocks/inicio/hero.block"
import { heroBlock }       from "@/features/cms/blocks/inicio/hero.block"

interface HeroProps {
  content?: HeroContent
  children?: React.ReactNode
}

export default function Hero({ content = heroBlock.defaultValue, children }: HeroProps) {
  const videoSrc = content.videoUrl || "/video-bg.mp4"
  const posterSrc = content.posterUrl || "/video-bg-poster.webp"

  return (
    <main className="relative w-full h-dvh min-h-150">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 1 0 L 1 0.70 Q 0 1.2 0 0.50 Z" />
          </clipPath>
          <clipPath id="hero-clip-mobile" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 1 0 L 1 0.88 L 0 0.72 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute inset-0 overflow-hidden hero-visual-clip">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 w-full h-full bg-linear-to-t from-black/95 via-black/60 md:via-black/50 to-black/50 z-10" />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-112 sm:pb-88 md:pb-72 lg:pb-64 pt-28">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-display-1 font-medium tracking-tight text-white mb-2 sm:mb-3 leading-[1.1] sm:leading-tight drop-shadow-sm">
              {content.titulo}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-sm">
              {content.subtitulo}
            </p>
          </div>
        </Container>
      </div>

      {children}
    </main>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/sections/home/hero.tsx
git commit -m "refactor(hero): accept HeroContent props, fallback to defaultValue"
```

---

## Task 9: Refactorizar componente WrapperMarquee

**Files:**
- Modify: `components/sections/home/wrapper-marquee.tsx`

- [ ] **Step 1: Actualizar WrapperMarquee para aceptar content props**

Reemplazar el contenido de `components/sections/home/wrapper-marquee.tsx`:

```tsx
import Image from "next/image"
import { EffectMarquee }     from "@/components/global/effect-marquee"
import type { MarqueeContent } from "@/features/cms/blocks/inicio/marquee.block"
import { marqueeBlock }        from "@/features/cms/blocks/inicio/marquee.block"

interface WrapperMarqueeProps {
  content?: MarqueeContent
}

export default function WrapperMarquee({ content = marqueeBlock.defaultValue }: WrapperMarqueeProps) {
  return (
    <section className="py-10">
      <h2 className="text-center font-semibold mb-8">{content.titulo}</h2>
      <EffectMarquee speed={24} gap={64}>
        {content.items.map((brand) => (
          <div key={brand.nombre} className="relative w-28 h-10 shrink-0">
            <Image
              src={brand.logoUrl}
              alt={brand.nombre}
              fill
              sizes="112px"
              className="object-contain opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </EffectMarquee>
    </section>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/sections/home/wrapper-marquee.tsx
git commit -m "refactor(marquee): accept MarqueeContent props, fallback to defaultValue"
```

---

## Task 10: Refactorizar componente AnnouncementGrid

**Files:**
- Modify: `components/sections/home/announcement-grid.tsx`

- [ ] **Step 1: Actualizar AnnouncementGrid para aceptar content props**

Reemplazar el contenido de `components/sections/home/announcement-grid.tsx`:

```tsx
import { AnnouncementCard }        from "@/components/global/announcement-card"
import type { AnnouncementsContent } from "@/features/cms/blocks/inicio/announcements.block"
import { announcementsBlock }        from "@/features/cms/blocks/inicio/announcements.block"

interface AnnouncementGridProps {
  content?: AnnouncementsContent
}

export default function AnnouncementGrid({ content = announcementsBlock.defaultValue }: AnnouncementGridProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
      {content.items.map((item, i) => (
        <AnnouncementCard
          key={i}
          image={item.imagen}
          alt={item.alt}
          title={item.titulo}
          description={item.descripcion}
          buttonText={item.botonTexto}
          href={item.enlace}
        />
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/sections/home/announcement-grid.tsx
git commit -m "refactor(announcements): accept AnnouncementsContent props, fallback to defaultValue"
```

---

## Task 11: Integrar CMS en la página pública de Inicio

**Files:**
- Modify: `app/(site)/page.tsx`

- [ ] **Step 1: Actualizar la página Inicio**

Reemplazar el contenido de `app/(site)/page.tsx`:

```tsx
import { Suspense }             from "react"
import type { Metadata }        from "next"
import Hero                     from "@/components/sections/home/hero"
import AnnouncementGrid         from "@/components/sections/home/announcement-grid"
import WrapperMarquee           from "@/components/sections/home/wrapper-marquee"
import { HomeSearchBarContent } from "@/features/filters/components/home-search-bar-content"
import { HomeRecommendations }  from "@/features/recommendations/components/home-recommendations"
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton"
import { FilterLoadingProvider }   from "@/features/filters/context/filter-loading-context"
import { getPageContent }          from "@/app/actions/page-content.cached"
import { heroBlock }               from "@/features/cms/blocks/inicio/hero.block"
import { marqueeBlock }            from "@/features/cms/blocks/inicio/marquee.block"
import { announcementsBlock }      from "@/features/cms/blocks/inicio/announcements.block"
import { SEO_BLOCK_KEY }           from "@/features/cms/types/block"
import type { SearchParams }       from "@/types/filters/filters"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("inicio")
  const seo = content[SEO_BLOCK_KEY] as Record<string, string> | undefined
  return {
    title:       seo?.title,
    description: seo?.description,
    openGraph: {
      title:       seo?.ogTitle,
      description: seo?.ogDescription,
      images:      seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: seo?.canonical ? { canonical: seo.canonical } : undefined,
  }
}

interface HomeProps {
  searchParams: Promise<SearchParams>
}

export default async function Home({ searchParams }: HomeProps): Promise<React.ReactElement> {
  const content = await getPageContent("inicio")

  const heroContent          = (content[heroBlock.key]          ?? heroBlock.defaultValue)          as typeof heroBlock.defaultValue
  const marqueeContent       = (content[marqueeBlock.key]       ?? marqueeBlock.defaultValue)       as typeof marqueeBlock.defaultValue
  const announcementsContent = (content[announcementsBlock.key] ?? announcementsBlock.defaultValue) as typeof announcementsBlock.defaultValue

  return (
    <FilterLoadingProvider>
      <Hero content={heroContent}>
        <Suspense>
          <HomeSearchBarContent searchParams={searchParams} className="absolute bottom-6 left-0 right-0 z-30 hola" />
        </Suspense>
      </Hero>

      <Suspense fallback={<VehicleCardSkeletonGrid count={6} />}>
        <HomeRecommendations searchParams={searchParams} />
      </Suspense>

      <WrapperMarquee content={marqueeContent} />
      <AnnouncementGrid content={announcementsContent} />
    </FilterLoadingProvider>
  )
}
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Iniciar dev server y verificar que la página carga igual que antes**

```bash
npm run dev
```

Navegar a `http://localhost:3000`. Verificar que el Hero, el Marquee y los Anuncios se ven igual que antes (están usando los `defaultValue` porque la BD aún está vacía).

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/page.tsx
git commit -m "feat(inicio): consume CMS content from DB, fallback to defaultValue"
```

---

## Task 12: CMS Field Renderer (controles básicos)

**Files:**
- Create: `features/cms/engine/cms-field-renderer.tsx`

- [ ] **Step 1: Crear el componente CmsFieldRenderer**

Crear `features/cms/engine/cms-field-renderer.tsx`:

```tsx
"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Input }    from "@/features/dashboard/components/ui/input"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import { Switch }   from "@/features/dashboard/components/ui/switch"
import { Label }    from "@/features/dashboard/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import type { FieldDefinition } from "@/features/cms/types/block"
import { CmsS3Field }   from "./cms-s3-field"
import { CmsListField } from "./cms-list-field"

interface CmsFieldRendererProps {
  field: FieldDefinition
  name: string
}

export function CmsFieldRenderer({ field, name }: CmsFieldRendererProps) {
  const { register, control } = useFormContext()

  if (field.type === "s3-image" || field.type === "s3-video" || field.type === "s3-document") {
    return <CmsS3Field field={field} name={name} />
  }

  if (field.type === "list") {
    return <CmsListField field={field} name={name} />
  }

  if (field.type === "boolean") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: f }) => (
          <div className="flex items-center gap-2">
            <Switch checked={!!f.value} onCheckedChange={f.onChange} id={name} />
            <Label htmlFor={name}>{field.label}</Label>
          </div>
        )}
      />
    )
  }

  if (field.type === "select" && field.options) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: f }) => (
          <Select value={f.value ?? ""} onValueChange={f.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Seleccionar ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options!.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    )
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <Textarea
        {...register(name)}
        placeholder={field.label}
        rows={field.type === "richtext" ? 6 : 3}
      />
    )
  }

  return (
    <Input
      {...register(name, { valueAsNumber: field.type === "number" })}
      type={field.type === "number" ? "number" : field.type === "color" ? "color" : field.type === "date" ? "date" : "text"}
      placeholder={field.label}
    />
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: errores de importaciones faltantes (CmsS3Field, CmsListField) — se crearán en los siguientes tasks. Los demás imports deben estar limpios.

- [ ] **Step 3: Commit**

```bash
git add features/cms/engine/cms-field-renderer.tsx
git commit -m "feat(cms): add CmsFieldRenderer for basic field types"
```

---

## Task 13: CMS S3 Field (control de upload)

**Files:**
- Create: `features/cms/engine/cms-s3-field.tsx`

- [ ] **Step 1: Crear CmsS3Field**

Crear `features/cms/engine/cms-s3-field.tsx`:

```tsx
"use client"

import { useRef }          from "react"
import { useFormContext }  from "react-hook-form"
import { Button }          from "@/features/dashboard/components/ui/button" // shadcn Button via dashboard
import { useUploadFiles }  from "@/features/s3/use-upload-files"
import type { FieldDefinition } from "@/features/cms/types/block"

const ROUTE_MAP: Record<string, string> = {
  "s3-image":    "cms-image",
  "s3-video":    "cms-video",
  "s3-document": "cms-document",
}

const ACCEPT_MAP: Record<string, string> = {
  "s3-image":    "image/jpeg,image/png,image/webp,image/avif",
  "s3-video":    "video/mp4,video/webm",
  "s3-document": "application/pdf",
}

interface CmsS3FieldProps {
  field: FieldDefinition
  name: string
}

export function CmsS3Field({ field, name }: CmsS3FieldProps) {
  const { watch, setValue }   = useFormContext()
  const inputRef              = useRef<HTMLInputElement>(null)
  const currentUrl: string    = watch(name) ?? ""

  const s3Path  = field.s3Path ?? "cms"
  const [pageSlug, blockKey] = s3Path.split("/")

  const { upload, isPending, progresses } = useUploadFiles({
    route: ROUTE_MAP[field.type] ?? "cms-image",
    onUploadComplete: ({ files }) => {
      if (files[0]) setValue(name, files[0].objectInfo.url, { shouldDirty: true })
    },
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    upload(files, { metadata: { pageSlug, blockKey } })
    e.target.value = ""
  }

  const isImage = field.type === "s3-image"
  const progress = progresses[0]?.progress ?? 0

  return (
    <div className="space-y-2">
      {currentUrl && isImage && (
        <img
          src={currentUrl}
          alt={field.label}
          className="h-24 w-auto rounded-md object-cover border"
        />
      )}
      {currentUrl && !isImage && (
        <p className="text-sm text-muted-foreground truncate max-w-xs">{currentUrl}</p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? `Subiendo ${Math.round(progress * 100)}%...` : currentUrl ? "Reemplazar" : "Subir archivo"}
        </Button>
        {currentUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue(name, "", { shouldDirty: true })}
          >
            Quitar
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[field.type]}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verificar que Button existe en features/dashboard**

```bash
ls features/dashboard/components/ui/
```

Si no existe `button.tsx`, agregarlo con shadcn:
```bash
npx shadcn@latest add button --cwd . --path features/dashboard/components/ui
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores en el nuevo archivo.

- [ ] **Step 4: Commit**

```bash
git add features/cms/engine/cms-s3-field.tsx
git commit -m "feat(cms): add CmsS3Field with upload progress and replace/clear"
```

---

## Task 14: CMS List Field (listas con drag-to-reorder)

**Files:**
- Create: `features/cms/engine/cms-list-field.tsx`

- [ ] **Step 1: Crear CmsListField**

Crear `features/cms/engine/cms-list-field.tsx`:

```tsx
"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Button }  from "@/features/dashboard/components/ui/button"
import { Label }   from "@/features/dashboard/components/ui/label"
import type { FieldDefinition } from "@/features/cms/types/block"
import { CmsFieldRenderer } from "./cms-field-renderer"

interface SortableItemProps {
  id: string
  index: number
  name: string
  itemFields: FieldDefinition[]
  onRemove: () => void
}

function SortableItem({ id, index, name, itemFields, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-3 space-y-3 bg-background">
      <div className="flex items-center justify-between">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground select-none text-sm"
        >
          ⠿ Item {index + 1}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          Eliminar
        </Button>
      </div>
      {itemFields.map((subField) => (
        <div key={subField.key} className="space-y-1">
          <Label>{subField.label}</Label>
          <CmsFieldRenderer field={subField} name={`${name}.${index}.${subField.key}`} />
        </div>
      ))}
    </div>
  )
}

interface CmsListFieldProps {
  field: FieldDefinition
  name: string
}

export function CmsListField({ field, name }: CmsListFieldProps) {
  const { control } = useFormContext()
  const { fields, append, remove, move } = useFieldArray({ control, name })
  const sensors = useSensors(useSensor(PointerSensor))

  const itemFields = field.itemFields ?? []
  const defaultItem = Object.fromEntries(itemFields.map((f) => [f.key, ""]))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = fields.findIndex((f) => f.id === active.id)
    const to   = fields.findIndex((f) => f.id === over.id)
    if (from !== -1 && to !== -1) move(from, to)
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              index={index}
              name={name}
              itemFields={itemFields}
              onRemove={() => remove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(defaultItem)}
      >
        + Agregar {field.label}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add features/cms/engine/cms-list-field.tsx
git commit -m "feat(cms): add CmsListField with dnd-kit drag-to-reorder"
```

---

## Task 15: CMS Block Editor (formulario de un bloque)

**Files:**
- Create: `features/cms/engine/cms-block-editor.tsx`

- [ ] **Step 1: Crear CmsBlockEditor**

Crear `features/cms/engine/cms-block-editor.tsx`:

```tsx
"use client"

import { useTransition }       from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver }          from "@hookform/resolvers/zod"
import { toast }                from "sonner"
import { Label }                from "@/features/dashboard/components/ui/label"
import { Button }               from "@/features/dashboard/components/ui/button"
import type { BlockDefinition } from "@/features/cms/types/block"
import { buildBlockSchema }     from "@/features/cms/validations/page-content"
import { saveBlockContent }     from "@/features/cms/actions/page-content.actions"
import { CmsFieldRenderer }     from "./cms-field-renderer"

interface CmsBlockEditorProps {
  pageSlug:       string
  block:          BlockDefinition
  currentValues:  Record<string, unknown>
  onValuesChange: (values: Record<string, unknown>) => void
}

export function CmsBlockEditor({
  pageSlug,
  block,
  currentValues,
  onValuesChange,
}: CmsBlockEditorProps) {
  const [isPending, startTransition] = useTransition()
  const schema  = buildBlockSchema(block.fields)
  const methods = useForm({
    resolver:      zodResolver(schema),
    defaultValues: { ...block.defaultValue, ...currentValues } as Record<string, unknown>,
  })

  const { handleSubmit, watch } = methods

  // Notify parent on every change for live preview
  const values = watch()
  if (JSON.stringify(values) !== JSON.stringify(onValuesChange.__lastValues)) {
    onValuesChange.__lastValues = values
    onValuesChange(values)
  }

  function onSubmit(data: Record<string, unknown>) {
    startTransition(async () => {
      const result = await saveBlockContent(pageSlug, block.key, data)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {block.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            {field.type !== "boolean" && (
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <CmsFieldRenderer field={field} name={field.key} />
          </div>
        ))}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Guardando..." : `Guardar ${block.label}`}
        </Button>
      </form>
    </FormProvider>
  )
}

// Attach mutable slot to avoid stale closure issues with onValuesChange callback
declare global {
  interface Function {
    __lastValues?: Record<string, unknown>
  }
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add features/cms/engine/cms-block-editor.tsx
git commit -m "feat(cms): add CmsBlockEditor with live preview sync and save action"
```

---

## Task 16: CMS Preview Panel

**Files:**
- Create: `features/cms/engine/cms-preview-panel.tsx`

- [ ] **Step 1: Crear CmsPreviewPanel**

Crear `features/cms/engine/cms-preview-panel.tsx`:

```tsx
"use client"

import Hero             from "@/components/sections/home/hero"
import WrapperMarquee   from "@/components/sections/home/wrapper-marquee"
import AnnouncementGrid from "@/components/sections/home/announcement-grid"
import type { HeroContent }          from "@/features/cms/blocks/inicio/hero.block"
import type { MarqueeContent }       from "@/features/cms/blocks/inicio/marquee.block"
import type { AnnouncementsContent } from "@/features/cms/blocks/inicio/announcements.block"

const PREVIEW_MAP: Record<string, React.ComponentType<{ content: unknown }>> = {
  hero:          ({ content }) => <Hero content={content as HeroContent} />,
  marquee:       ({ content }) => <WrapperMarquee content={content as MarqueeContent} />,
  announcements: ({ content }) => <AnnouncementGrid content={content as AnnouncementsContent} />,
}

interface CmsPreviewPanelProps {
  blockKey: string
  values:   Record<string, unknown>
}

export function CmsPreviewPanel({ blockKey, values }: CmsPreviewPanelProps) {
  const PreviewComponent = PREVIEW_MAP[blockKey]

  if (!PreviewComponent) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Vista previa no disponible para este bloque.
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-white">
      <div
        className="pointer-events-none origin-top-left"
        style={{
          transform: "scale(0.45)",
          width: "222%",
          transformOrigin: "top left",
        }}
      >
        <PreviewComponent content={values} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add features/cms/engine/cms-preview-panel.tsx
git commit -m "feat(cms): add CmsPreviewPanel with scaled real component preview"
```

---

## Task 17: CMS Page Editor (layout principal)

**Files:**
- Create: `features/cms/engine/cms-page-editor.tsx`

- [ ] **Step 1: Crear CmsPageEditor**

Crear `features/cms/engine/cms-page-editor.tsx`:

```tsx
"use client"

import { useState, useTransition }  from "react"
import { useForm, FormProvider }    from "react-hook-form"
import { zodResolver }              from "@hookform/resolvers/zod"
import { toast }                    from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/dashboard/components/ui/tabs"
import { Label }   from "@/features/dashboard/components/ui/label"
import { Input }   from "@/features/dashboard/components/ui/input"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import { Button }  from "@/features/dashboard/components/ui/button"
import { getPageBlocks }  from "@/features/cms/registry"
import { saveSeoContent } from "@/features/cms/actions/page-content.actions"
import { seoSchema }      from "@/features/cms/validations/page-content"
import { SEO_BLOCK_KEY }  from "@/features/cms/types/block"
import type { PageContentMap } from "@/features/cms/types/page-content"
import type { SeoContent }     from "@/features/cms/types/block"
import { CmsBlockEditor }  from "./cms-block-editor"
import { CmsPreviewPanel } from "./cms-preview-panel"

interface CmsPageEditorProps {
  pageSlug:       string
  initialContent: PageContentMap
}

export function CmsPageEditor({ pageSlug, initialContent }: CmsPageEditorProps) {
  const blocks = getPageBlocks(pageSlug)

  const [activeBlockKey, setActiveBlockKey] = useState(blocks[0]?.key ?? "")
  const [previewValues, setPreviewValues]   = useState<Record<string, unknown>>(
    (initialContent[activeBlockKey] ?? blocks[0]?.defaultValue ?? {}) as Record<string, unknown>
  )

  const [isPending, startTransition] = useTransition()

  const seoDefaults: SeoContent = {
    title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "",
    ...((initialContent[SEO_BLOCK_KEY] ?? {}) as Partial<SeoContent>),
  }

  const seoMethods = useForm({
    resolver: zodResolver(seoSchema),
    defaultValues: seoDefaults,
  })

  function handleBlockChange(blockKey: string) {
    setActiveBlockKey(blockKey)
    setPreviewValues(
      (initialContent[blockKey] ?? blocks.find((b) => b.key === blockKey)?.defaultValue ?? {}) as Record<string, unknown>
    )
  }

  function onSeoSubmit(data: Record<string, unknown>) {
    startTransition(async () => {
      const result = await saveSeoContent(pageSlug, data)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
      {/* Left: editor panel */}
      <div className="space-y-4 overflow-y-auto">
        <Tabs defaultValue="contenido">
          <TabsList>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="contenido" className="space-y-4 mt-4">
            {/* Block selector */}
            <div className="flex gap-2 flex-wrap">
              {blocks.map((block) => (
                <Button
                  key={block.key}
                  type="button"
                  variant={activeBlockKey === block.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBlockChange(block.key)}
                >
                  {block.label}
                </Button>
              ))}
            </div>

            {/* Active block form */}
            {blocks.map((block) =>
              block.key === activeBlockKey ? (
                <CmsBlockEditor
                  key={block.key}
                  pageSlug={pageSlug}
                  block={block}
                  currentValues={(initialContent[block.key] ?? {}) as Record<string, unknown>}
                  onValuesChange={setPreviewValues}
                />
              ) : null
            )}
          </TabsContent>

          <TabsContent value="seo" className="mt-4">
            <FormProvider {...seoMethods}>
              <form onSubmit={seoMethods.handleSubmit(onSeoSubmit as any)} className="space-y-4">
                {(
                  [
                    { key: "title",         label: "Título SEO",          type: "text"     },
                    { key: "description",   label: "Descripción",         type: "textarea" },
                    { key: "ogTitle",       label: "OG Título",           type: "text"     },
                    { key: "ogDescription", label: "OG Descripción",      type: "textarea" },
                    { key: "ogImage",       label: "OG Imagen (URL)",     type: "text"     },
                    { key: "canonical",     label: "URL Canónica",        type: "text"     },
                  ] as const
                ).map(({ key, label, type }) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key}>{label}</Label>
                    {type === "textarea" ? (
                      <Textarea id={key} {...seoMethods.register(key)} rows={3} />
                    ) : (
                      <Input id={key} {...seoMethods.register(key)} />
                    )}
                  </div>
                ))}
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Guardando..." : "Guardar SEO"}
                </Button>
              </form>
            </FormProvider>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right: preview panel */}
      <div className="hidden xl:block">
        <p className="text-sm text-muted-foreground mb-2">Vista previa en tiempo real</p>
        <CmsPreviewPanel blockKey={activeBlockKey} values={previewValues} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add features/cms/engine/cms-page-editor.tsx
git commit -m "feat(cms): add CmsPageEditor with tabs (Contenido/SEO) and live preview"
```

---

## Task 18: Página del Dashboard `/dashboard/inicio`

**Files:**
- Create: `app/dashboard/inicio/page.tsx`

- [ ] **Step 1: Crear la página del editor CMS de Inicio**

Crear `app/dashboard/inicio/page.tsx`:

```tsx
import dynamic from "next/dynamic"
import { getPageContentRaw } from "@/features/cms/queries/page-content.queries"
import { toContentMap }      from "@/features/cms/types/page-content"

const CmsPageEditor = dynamic(
  () => import("@/features/cms/engine/cms-page-editor").then((m) => m.CmsPageEditor),
  { ssr: false }
)

export default async function InicioEditorPage() {
  const records       = await getPageContentRaw("inicio")
  const initialContent = toContentMap(records)

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Página Inicio</h1>
        <p className="text-muted-foreground text-sm">
          Edita el contenido y metadatos SEO de la página principal.
        </p>
      </div>
      <CmsPageEditor pageSlug="inicio" initialContent={initialContent} />
    </div>
  )
}
```

- [ ] **Step 2: Verificar que la ruta existe en el sidebar**

Confirmar que `features/dashboard/navigation/sidebar/sidebar-items.ts` ya tiene `url: "/dashboard/inicio"` en el grupo "Dashboard Páginas". Si no está, agregarlo:

```ts
{
  title: "Inicio",
  url: "/dashboard/inicio",
  icon: PanelsTopLeftIcon,
},
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Probar en el dev server**

```bash
npm run dev
```

Navegar a `http://localhost:3000/auth` → iniciar sesión como admin → ir a `/dashboard/inicio`. Verificar que:
- Se muestra el editor con tabs Contenido y SEO
- El selector de bloques (Hero, Marcas Aliadas, Grilla de Anuncios) es visible
- El formulario del bloque Hero muestra sus campos
- La vista previa aparece a la derecha (en pantallas xl)

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/inicio/
git commit -m "feat(dashboard): add Inicio CMS editor page at /dashboard/inicio"
```

---

## Task 19: Seed de contenido por defecto

**Files:**
- Create: `prisma/seeds/page-content.seed.ts`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Crear el seed**

Crear `prisma/seeds/page-content.seed.ts`:

```ts
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
      title:          "Cofiño Usados | Autos de calidad con respaldo",
      description:    "Encuentra tu próximo auto usado con la confianza y respaldo de Cofiño Stahl Usados.",
      ogTitle:        "Cofiño Usados | Autos de calidad con respaldo",
      ogDescription:  "Encuentra tu próximo auto usado con la confianza y respaldo de Cofiño Stahl Usados.",
      ogImage:        "",
      canonical:      "",
    },
  },
]

export async function seedPageContent(prisma: PrismaClient) {
  for (const block of INICIO_BLOCKS) {
    await prisma.pageContent.upsert({
      where:  { pageSlug_blockKey: { pageSlug: "inicio", blockKey: block.blockKey } },
      create: { pageSlug: "inicio", blockKey: block.blockKey, value: block.value },
      update: {},
    })
  }
  console.log("  ✓ PageContent (inicio) seeded")
}
```

- [ ] **Step 2: Importar y ejecutar el seed en prisma/seed.ts**

Abrir `prisma/seed.ts` y agregar la importación y entrada en el array `seeds`:

```ts
import { seedPageContent } from "./seeds/page-content.seed"

// En el array seeds, agregar al final:
{ name: "PageContent", fn: seedPageContent },
```

- [ ] **Step 3: Ejecutar el seed**

```bash
npx prisma db seed
```

Expected output: `▶ PageContent` → `✓ PageContent (inicio) seeded`

- [ ] **Step 4: Verificar en el editor del dashboard**

```bash
npm run dev
```

Navegar a `/dashboard/inicio`. Los campos del Hero deben pre-cargarse con los valores del seed (título, subtítulo). La página pública en `/` debe seguir viéndose igual.

- [ ] **Step 5: Probar el flujo completo de guardado**

1. Ir a `/dashboard/inicio`
2. Cambiar el título del Hero a "Texto de prueba CMS"
3. Presionar "Guardar Hero Principal"
4. Navegar a `http://localhost:3000`
5. Verificar que el Hero ahora muestra "Texto de prueba CMS"
6. Restaurar el título original desde el dashboard

- [ ] **Step 6: Commit final**

```bash
git add prisma/seeds/page-content.seed.ts prisma/seed.ts
git commit -m "feat(cms): add page content seed with Inicio defaults"
```

---

## Self-Review

### Cobertura del spec

| Requisito del spec | Task que lo implementa |
|---|---|
| Modelo `PageContent` en BD | Task 1 |
| `use cache` + `cacheTag` + `cacheLife` | Task 5 |
| `BlockDefinition` con `FieldDefinition` | Task 2 |
| Todos los tipos de campo | Task 12–14 |
| Bloques Hero, Marquee, Announcements | Task 3 |
| Registro central + `getPageBlocks` | Task 4 |
| `saveBlockContent` + validación Zod | Task 6 |
| `saveSeoContent` + tab SEO fijo | Task 6, Task 17 |
| `deleteMediaFromBlock` | Task 6 |
| Rutas CMS en upload API | Task 7 |
| `generateCmsKey` con path organizado | Task 7 |
| Límites: imagen 5MB, video 20MB, doc 5MB | Task 7 |
| Refactorizar Hero, Marquee, Announcements | Task 8–10 |
| Fallback a `defaultValue` en páginas públicas | Task 11 |
| `generateMetadata` con SEO del CMS | Task 11 |
| Formularios estructurados por bloque | Task 15 |
| Preview en tiempo real con componentes reales | Task 16 |
| Layout con tabs Contenido/SEO | Task 17 |
| Página `/dashboard/inicio` | Task 18 |
| Seed con valores actuales | Task 19 |
| Optimización: `dynamic()` en dashboard | Task 18 |
| Prioridad de rendimiento | Tasks 5, 18 |

### Decisiones de implementación anotadas

- **richtext**: renderiza como `<Textarea>` con 6 filas. Un editor Tiptap puede añadirse en el futuro reemplazando únicamente el case `"richtext"` en `CmsFieldRenderer`.
- **Preview scaling**: usa `transform: scale(0.45)` con `width: 222%` para compensar. Ajustar según pantalla si es necesario.
- **onValuesChange sync**: usa un slot `__lastValues` en el callback para evitar re-renders infinitos sin añadir `useEffect`. Si esto causa problemas, reemplazar por un `useRef` en `CmsBlockEditor`.
- **S3 en logos del marquee**: los logos actuales son SVGs locales (`/brands/*.svg`). El seed los usa como `logoUrl` por defecto; el admin puede subirlos a S3 desde el editor cuando lo desee.
