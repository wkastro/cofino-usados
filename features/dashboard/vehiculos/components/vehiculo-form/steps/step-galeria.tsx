"use client"

import { useRef, useState, useTransition } from "react"
import { ImageIcon, TrashIcon, ArrowUpIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useUploadFiles } from "@better-upload/client"
import { Button } from "@/features/dashboard/components/ui/button"
import {
  addGaleriaImage,
  removeGaleriaImage,
  reorderGaleriaImages,
} from "../../../actions/vehiculo.actions"
import { UPLOAD_ROUTES, buildPublicUrl } from "@/features/s3"
import type { GaleriaItem } from "../../../types/vehiculo"

interface StepGaleriaProps {
  vehiculoId: string | null
  initialImages: GaleriaItem[]
}

export function StepGaleria({ vehiculoId, initialImages }: StepGaleriaProps) {
  const [images, setImages] = useState<GaleriaItem[]>(initialImages)
  const [isPending, startTransition] = useTransition()

  // Tracks the next orden value without causing re-renders
  const nextOrdenRef = useRef(initialImages.length)

  const { upload, progresses, isPending: isUploading } = useUploadFiles({
    route: UPLOAD_ROUTES.vehiculoImages,
    onUploadComplete: ({ files }) => {
      files.forEach((file) => {
        const url = buildPublicUrl(file.objectInfo.key)
        const orden = nextOrdenRef.current++

        if (!vehiculoId) {
          setImages((prev) => [
            ...prev,
            { id: `pending-${Date.now()}-${Math.random()}`, url, orden },
          ])
          return
        }

        startTransition(async () => {
          const result = await addGaleriaImage(vehiculoId, url, orden)
          if (result.ok && result.data) {
            setImages((prev) => [
              ...prev,
              { id: result.data!.id, url: result.data!.url, orden: result.data!.orden },
            ])
            toast.success(result.message)
          } else {
            toast.error(result.message)
          }
        })
      })
    },
    onUploadFail: ({ failedFiles }) => {
      failedFiles.forEach((f) => {
        toast.error(`Error al subir ${f.name}: ${f.error.message}`)
      })
    },
    onError: (error) => {
      toast.error(error.message ?? "Error al subir la imagen")
    },
  })

  function handleRemove(galeriaId: string) {
    if (!vehiculoId || galeriaId.startsWith("pending-")) {
      setImages((prev) => prev.filter((img) => img.id !== galeriaId))
      return
    }
    startTransition(async () => {
      const result = await removeGaleriaImage(galeriaId, vehiculoId)
      if (result.ok) {
        setImages((prev) => prev.filter((img) => img.id !== galeriaId))
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleMoveUp(index: number) {
    if (index === 0) return
    const previous = [...images]
    const reordered = [...images]
    ;[reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]]
    const withOrden = reordered.map((img, i) => ({ ...img, orden: i }))
    setImages(withOrden)

    if (!vehiculoId) return

    startTransition(async () => {
      const result = await reorderGaleriaImages(
        vehiculoId,
        withOrden.map(({ id, orden }) => ({ id, orden })),
      )
      if (!result.ok) {
        setImages(previous)
        toast.error(result.message)
      }
    })
  }

  const isBusy = isUploading || isPending

  return (
    <div className="flex flex-col gap-4">
      {/* File picker */}
      <label
        htmlFor="gallery-upload"
        className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed gap-2 text-muted-foreground transition-colors hover:bg-muted/50 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50"
      >
        <UploadIcon className="size-6" aria-hidden="true" />
        <p className="text-sm">Arrastra imágenes o haz clic para seleccionar</p>
        <p className="text-xs">PNG, JPG, WEBP · máx. 5 MB por imagen</p>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={isBusy}
          onChange={(e) => {
            if (!e.target.files?.length) return
            upload(e.target.files, {
              metadata: vehiculoId ? { vehiculoId } : undefined,
            })
            e.target.value = ""
          }}
        />
      </label>

      {/* Per-file upload progress */}
      {isUploading && progresses.length > 0 && (
        <ul className="flex flex-col gap-1" aria-label="Progreso de subida">
          {progresses.map((file) => (
            <li
              key={file.objectInfo.key}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="flex-1 truncate">{file.name}</span>
              <span>{Math.round(file.progress * 100)}%</span>
            </li>
          ))}
        </ul>
      )}

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
          <ImageIcon className="size-6" aria-hidden="true" />
          <p className="text-sm">No hay imágenes todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, index) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7"
                    onClick={() => handleMoveUp(index)}
                    disabled={isBusy}
                  >
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                    <span className="sr-only">Subir</span>
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-7"
                  onClick={() => handleRemove(img.id)}
                  disabled={isBusy}
                >
                  <TrashIcon className="size-3" aria-hidden="true" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
