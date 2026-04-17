# CMS de Páginas — Diseño

**Fecha:** 2026-04-17
**Scope inicial:** Página de Inicio (`/`)
**Extensible a:** todas las páginas públicas del sitio

---

## Resumen

Sistema de gestión de contenido (CMS) administrado desde `/dashboard` que permite modificar el contenido de las páginas públicas sin alterar su maquetado ni estilo. Basado en bloques reutilizables con campos tipados, previsualización en tiempo real, soporte de media via S3, y gestión de metadatos SEO por página.

---

## 1. Capa de datos

### Modelo Prisma

```prisma
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

- `pageSlug` identifica la página (`"inicio"`, `"intercambiar"`, etc.)
- `blockKey` identifica el bloque dentro de la página (`"hero"`, `"marquee"`, `"_seo"`)
- `value` almacena el contenido del bloque como JSON
- El prefijo `_seo` reserva el bloque de metadatos SEO en cada página

### Caché

```ts
// app/actions/page-content.cached.ts
"use cache"
export async function getPageContent(pageSlug: string) {
  cacheTag(`cms-${pageSlug}`)
  cacheLife("days")
  return prisma.pageContent.findMany({ where: { pageSlug } })
}
```

Al guardar cambios desde el dashboard → `revalidateTag("cms-inicio")`. La BD solo se consulta cuando hay un cambio real.

### Seed de valores por defecto

Un script de seed popula los registros con el contenido actualmente hardcodeado. Las páginas nunca quedan vacías en ningún ambiente.

---

## 2. Block Registry

### Contrato de un bloque

```ts
// features/cms/types/block.ts
export interface FieldDefinition {
  key: string
  label: string
  type:
    | "text" | "textarea" | "richtext"
    | "number" | "boolean" | "select"
    | "color" | "url" | "date"
    | "s3-image" | "s3-video" | "s3-document"
    | "list"
  s3Path?: string           // para s3-image, s3-video, s3-document
  options?: string[]        // para select
  itemFields?: FieldDefinition[]  // para list (subcampos de cada item)
  required?: boolean
}

export interface BlockDefinition<T = Record<string, unknown>> {
  key: string
  label: string
  fields: FieldDefinition[]
  defaultValue: T
}
```

### Tipos de campo

| Tipo | Uso |
|---|---|
| `text` | Títulos, etiquetas cortas |
| `textarea` | Descripciones, párrafos |
| `richtext` | Texto con formato (bold, listas, links) |
| `number` | Cantidades, duraciones |
| `boolean` | Mostrar/ocultar sección |
| `select` | Opciones predefinidas |
| `color` | Colores de fondo, texto |
| `url` | Enlaces externos |
| `s3-image` | Imágenes subidas a S3 (máx 5 MB, jpg/png/webp/avif) |
| `s3-video` | Videos subidos a S3 (máx 20 MB, mp4/webm) |
| `s3-document` | Documentos subidos a S3 (máx 5 MB, pdf) |
| `list` | Lista de items con subcampos propios |
| `date` | Fechas |

### Ejemplo: bloque Hero

```ts
// features/cms/blocks/inicio/hero.block.ts
export const heroBlock: BlockDefinition = {
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

### Ejemplo: bloque Announcements (con lista)

```ts
// features/cms/blocks/inicio/announcements.block.ts
export const announcementsBlock: BlockDefinition = {
  key: "announcements",
  label: "Grilla de Anuncios",
  fields: [
    {
      key: "items", label: "Anuncios", type: "list",
      itemFields: [
        { key: "titulo", label: "Título",  type: "text"                                        },
        { key: "imagen", label: "Imagen",  type: "s3-image", s3Path: "inicio/announcements"   },
        { key: "enlace", label: "Enlace",  type: "url"                                         },
      ],
    },
  ],
  defaultValue: { items: [] },
}
```

### Registro central

```ts
// features/cms/registry/index.ts
import { heroBlock }          from "@/features/cms/blocks/inicio/hero.block"
import { marqueeBlock }       from "@/features/cms/blocks/inicio/marquee.block"
import { announcementsBlock } from "@/features/cms/blocks/inicio/announcements.block"

export const cmsRegistry: Record<string, BlockDefinition> = {
  [heroBlock.key]:           heroBlock,
  [marqueeBlock.key]:        marqueeBlock,
  [announcementsBlock.key]:  announcementsBlock,
}
```

El motor del CMS solo lee este registro. No conoce los bloques internamente.

---

## 3. Motor del CMS (Dashboard)

### Layout del editor

Ruta: `/dashboard/inicio`

```
┌──────────────────────────────────────────────────────┐
│ [Contenido]  [SEO]                      [Guardar]    │
├─────────────────────┬────────────────────────────────┤
│  Bloques            │  Vista previa                  │
│  ────────────────   │  ──────────────────────────    │
│  ▼ Hero Principal   │  [Componente real escalado     │
│    Título: [___]    │   con valores del formulario]  │
│    Video:  [↑ S3]   │                                │
│                     │                                │
│  ▼ Marquee          │                                │
│    Items: [+]       │                                │
│                     │                                │
│  ▼ Grilla Anuncios  │                                │
│    Items: [+]       │                                │
└─────────────────────┴────────────────────────────────┘
```

### Componentes del motor

```
features/cms/engine/
  cms-page-editor.tsx     ← layout principal, tabs Contenido/SEO, botón Guardar
  cms-block-editor.tsx    ← renderiza el formulario de un bloque leyendo sus fields
  cms-field-renderer.tsx  ← switch por field.type → control correcto
  cms-preview-panel.tsx   ← renderiza el componente real con valores del form
  cms-s3-field.tsx        ← control de upload con progress bar
  cms-list-field.tsx      ← control para campos tipo list con drag-to-reorder
```

### Funcionamiento del preview

1. Los componentes públicos se refactorizan para aceptar props de contenido
2. El panel de preview renderiza el mismo componente con los valores actuales del form
3. El admin escribe en un campo → React Hook Form actualiza el estado → preview re-renderiza
4. Componentes grandes (como Hero, 100dvh) se muestran escalados con `transform: scale(0.5)`
5. El preview tiene `pointer-events: none` para evitar confusión con la página real
6. Los videos en preview están pausados por defecto

### Flujo de guardado

1. Admin edita campos → estado local (React Hook Form)
2. Admin presiona "Guardar"
3. Server Action `savePageContent(pageSlug, blockKey, value)`
4. Validación con el Zod schema derivado de los `fields` del bloque
5. Upsert en BD → `revalidateTag("cms-{pageSlug}")`
6. Página pública sirve el nuevo contenido en la próxima visita

### Tab SEO (campos fijos por página)

Almacenado como `blockKey: "_seo"` en la misma tabla `PageContent`.

| Campo | Tipo | Key |
|---|---|---|
| Título | text | `title` |
| Descripción | textarea | `description` |
| OG Título | text | `ogTitle` |
| OG Descripción | textarea | `ogDescription` |
| OG Imagen | s3-image | `ogImage` (path: `{pageSlug}/seo`) |
| URL Canónica | url | `canonical` |

---

## 4. Integración con páginas públicas

### Consumo de contenido

```tsx
// app/(site)/page.tsx
export default async function Home({ searchParams }) {
  const blocks = await getPageContent("inicio")

  const hero          = blocks.find(b => b.blockKey === "hero")?.value          ?? heroBlock.defaultValue
  const marquee       = blocks.find(b => b.blockKey === "marquee")?.value       ?? marqueeBlock.defaultValue
  const announcements = blocks.find(b => b.blockKey === "announcements")?.value ?? announcementsBlock.defaultValue

  return (
    <FilterLoadingProvider>
      <Hero content={hero}>...</Hero>
      <HomeRecommendations searchParams={searchParams} />
      <WrapperMarquee content={marquee} />
      <AnnouncementGrid content={announcements} />
    </FilterLoadingProvider>
  )
}
```

### SEO via generateMetadata

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const blocks = await getPageContent("inicio")
  const seo = blocks.find(b => b.blockKey === "_seo")?.value
  return {
    title:       seo?.title,
    description: seo?.description,
    openGraph: {
      title:       seo?.ogTitle,
      description: seo?.ogDescription,
      images:      [seo?.ogImage],
    },
  }
}
```

`getPageContent` es la misma función cacheada — Next.js deduplica la llamada entre `generateMetadata` y el render de la página.

### Refactorización de componentes públicos

Los componentes existentes pasan de tener contenido hardcodeado a aceptar props:

```tsx
// components/sections/home/hero.tsx
interface HeroContent {
  titulo: string
  subtitulo: string
  videoUrl: string
  posterUrl: string
}

export function Hero({ content, children }: { content: HeroContent; children?: ReactNode }) {
  // mismo JSX actual usando content.titulo, content.videoUrl, etc.
}
```

---

## 5. Uploads S3

### Convención de rutas

```
{pageSlug}/{blockKey}/{timestamp}-{nombre-sanitizado}.{ext}

inicio/hero/1736985600000-hero-video.mp4
inicio/hero/1736985600000-hero-poster.webp
inicio/announcements/1736985600000-banner-verano.jpg
inicio/seo/1736985600000-og-image.jpg
```

### Límites y formatos

| Tipo | Formatos | Límite |
|---|---|---|
| `s3-image` | jpg, png, webp, avif | 5 MB |
| `s3-video` | mp4, webm | 20 MB |
| `s3-document` | pdf | 5 MB |

### Eliminación de archivos

- **Reemplazar archivo** → elimina el anterior de S3 antes de subir el nuevo
- **Limpiar campo** → elimina de S3 y limpia el valor en BD al guardar
- **Eliminar item de lista** → elimina todos los archivos S3 asociados al item al guardar
- Reutiliza la Server Action de eliminación S3 ya existente en el proyecto

---

## 6. Estructura de directorios

```
features/cms/
  types/
    block.ts                    ← BlockDefinition, FieldDefinition
    page-content.ts             ← tipos para PageContent de BD
  blocks/
    inicio/
      hero.block.ts
      marquee.block.ts
      announcements.block.ts
    # futuras páginas:
    # intercambiar/
    #   exchange-hero.block.ts
  registry/
    index.ts                    ← registro central de bloques
  engine/
    cms-page-editor.tsx
    cms-block-editor.tsx
    cms-field-renderer.tsx
    cms-preview-panel.tsx
    cms-s3-field.tsx
    cms-list-field.tsx
  actions/
    page-content.actions.ts     ← savePageContent, deleteMediaField
  queries/
    page-content.queries.ts     ← getPageContentRaw (sin caché)
  validations/
    page-content.ts             ← validación Zod contra schema del bloque

app/actions/
  page-content.cached.ts        ← getPageContent con use cache + cacheTag

app/dashboard/
  inicio/
    page.tsx                    ← editor CMS de la página Inicio

components/sections/home/
  hero.tsx                      ← refactorizado, acepta HeroContent props
  wrapper-marquee.tsx           ← refactorizado
  announcement-grid.tsx         ← refactorizado
```

---

## 7. Extensibilidad a nuevas páginas

Agregar una página nueva al CMS requiere solo tres pasos:

1. **Crear bloques** en `features/cms/blocks/{pageSlug}/`
2. **Registrarlos** en `features/cms/registry/index.ts`
3. **Crear la ruta** `app/dashboard/{pageSlug}/page.tsx` con `<CmsPageEditor pageSlug="{pageSlug}" />`

El motor, la BD, el caché y los uploads funcionan automáticamente. El sidebar ya tiene las rutas de Comprar, Intercambiar y Próximamente registradas.

---

## Decisiones de diseño

| Decisión | Elección | Razón |
|---|---|---|
| Almacenamiento | `PageContent` genérico en MariaDB | Escala a nuevas páginas sin migraciones |
| Caché | `use cache` + `cacheTag` + `cacheLife("days")` | Cero impacto en BD por visitas de usuarios |
| Bloques | Registro TypeScript externo al motor | Motor agnóstico, bloques independientes |
| Ubicación de bloques | `features/cms/blocks/{pageSlug}/` | Separación CMS/público, relación semántica por nombre |
| Preview | Componentes reales con props del form | Preview 100% fiel, sin duplicación de markup |
| SEO | Bloque `_seo` fijo, tab separado | Siempre presente, campos predecibles |
| Eliminación S3 | Sincronizada al guardar/reemplazar | Consistencia BD ↔ S3, reutiliza lógica existente |
