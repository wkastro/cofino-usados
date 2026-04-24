# CmsS3Field Delete Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un botón "Eliminar" en `CmsS3Field` que borre el archivo de S3 y limpie el campo en DB y en el formulario, permitiendo al admin volver a usar un video de YouTube cuando ya había uno local activo.

**Architecture:** El botón llama al Server Action `deleteMediaFromBlock` (ya existente) pasándole los valores actuales del bloque completo via `getValues()` del form context. El action borra el archivo de S3 y guarda el bloque con el campo vacío en DB. Tras el éxito, `setValue` limpia el campo en el form state local.

**Tech Stack:** React, React Hook Form (`useFormContext`, `getValues`, `setValue`, `useTransition`), Sonner (`toast`), Server Action existente `deleteMediaFromBlock`.

---

### Task 1: Agregar botón "Eliminar" en `CmsS3Field`

**Files:**
- Modify: `features/cms/engine/cms-s3-field.tsx`

- [ ] **Step 1: Agregar imports necesarios**

Reemplazar el bloque de imports actual:

```tsx
"use client"

import { useRef, useCallback, useTransition } from "react"
import { useFormContext }                       from "react-hook-form"
import { toast }                               from "sonner"
import { useUploadFiles }                      from "@/features/s3/use-upload-files"
import type { UploadedFile }                   from "@/features/s3/use-upload-files"
import type { FieldDefinition }                from "@/features/cms/types/block"
import { deleteMediaFromBlock }                from "@/features/cms/actions/page-content.actions"
```

- [ ] **Step 2: Agregar `useTransition` y `getValues` al cuerpo del componente**

Reemplazar:

```tsx
export function CmsS3Field({ field, name }: CmsS3FieldProps) {
  const { watch, setValue }   = useFormContext()
  const inputRef              = useRef<HTMLInputElement>(null)
  const currentUrl: string    = watch(name) ?? ""
```

Por:

```tsx
export function CmsS3Field({ field, name }: CmsS3FieldProps) {
  const { watch, setValue, getValues } = useFormContext()
  const inputRef                        = useRef<HTMLInputElement>(null)
  const currentUrl: string              = watch(name) ?? ""
  const [isDeleting, startDelete]       = useTransition()
```

- [ ] **Step 3: Agregar handler de eliminación**

Agregar después de `handleChange`:

```tsx
function handleDelete() {
  startDelete(async () => {
    const result = await deleteMediaFromBlock(pageSlug, blockKey, name, getValues() as Record<string, unknown>)
    if (result.ok) {
      setValue(name, "", { shouldDirty: false })
      toast.success("Archivo eliminado.")
    } else {
      toast.error(result.message)
    }
  })
}
```

- [ ] **Step 4: Agregar botón "Eliminar" en el JSX**

Reemplazar el bloque `<div className="flex items-center gap-2">`:

```tsx
<div className="flex items-center gap-2">
  <button
    type="button"
    disabled={isPending || isDeleting}
    onClick={() => inputRef.current?.click()}
    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {uploadLabel}
  </button>
  {currentUrl && (
    <button
      type="button"
      disabled={isPending || isDeleting}
      onClick={handleDelete}
      className="inline-flex items-center justify-center rounded-md border border-destructive text-destructive px-3 py-1.5 text-sm font-medium hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Eliminando..." : "Eliminar"}
    </button>
  )}
</div>
```

- [ ] **Step 5: Verificar el archivo final completo**

El archivo `features/cms/engine/cms-s3-field.tsx` debe quedar así:

```tsx
"use client"

import { useRef, useCallback, useTransition } from "react"
import { useFormContext }                       from "react-hook-form"
import { toast }                               from "sonner"
import { useUploadFiles }                      from "@/features/s3/use-upload-files"
import type { UploadedFile }                   from "@/features/s3/use-upload-files"
import type { FieldDefinition }                from "@/features/cms/types/block"
import { deleteMediaFromBlock }                from "@/features/cms/actions/page-content.actions"

const ROUTE_MAP: Record<string, string> = {
  "s3-image":    "cms-image",
  "s3-video":    "cms-video",
  "s3-document": "cms-document",
}

const ACCEPT_MAP: Record<string, string> = {
  "s3-image":    "image/jpeg,image/png,image/webp,image/avif,image/svg+xml",
  "s3-video":    "video/mp4,video/webm",
  "s3-document": "application/pdf",
}

interface CmsS3FieldProps {
  field: FieldDefinition
  name: string
}

export function CmsS3Field({ field, name }: CmsS3FieldProps) {
  const { watch, setValue, getValues } = useFormContext()
  const inputRef                        = useRef<HTMLInputElement>(null)
  const currentUrl: string              = watch(name) ?? ""
  const [isDeleting, startDelete]       = useTransition()

  const s3Path   = field.s3Path ?? "cms"
  const parts    = s3Path.split("/")
  const pageSlug = parts[0] ?? "cms"
  const blockKey = parts[1] ?? "block"

  const handleUploadComplete = useCallback(
    ({ files }: { files: UploadedFile[] }) => {
      if (files[0]) setValue(name, files[0].objectInfo.url, { shouldDirty: true })
    },
    [name, setValue],
  )

  const { upload, isPending, progresses } = useUploadFiles({
    route: ROUTE_MAP[field.type] ?? "cms-image",
    onUploadComplete: handleUploadComplete,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    upload(files, { metadata: { pageSlug, blockKey } })
    e.target.value = ""
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteMediaFromBlock(pageSlug, blockKey, name, getValues() as Record<string, unknown>)
      if (result.ok) {
        setValue(name, "", { shouldDirty: false })
        toast.success("Archivo eliminado.")
      } else {
        toast.error(result.message)
      }
    })
  }

  const isImage     = field.type === "s3-image"
  const progress    = progresses[0]?.progress ?? 0
  const uploadLabel = isPending
    ? `Subiendo ${Math.round(progress * 100)}%...`
    : currentUrl ? "Reemplazar" : "Subir archivo"

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
        <button
          type="button"
          disabled={isPending || isDeleting}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadLabel}
        </button>
        {currentUrl && (
          <button
            type="button"
            disabled={isPending || isDeleting}
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md border border-destructive text-destructive px-3 py-1.5 text-sm font-medium hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[field.type]}
        className="hidden"
        onChange={handleChange}
      />

      {field.imageHint && (
        <p className="text-xs text-muted-foreground">
          Tamaño recomendado: {field.imageHint}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add features/cms/engine/cms-s3-field.tsx
git commit -m "feat: agregar botón Eliminar en campos S3 del CMS"
```
