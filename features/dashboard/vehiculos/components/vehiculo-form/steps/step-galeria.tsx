"use client"

import { useState, useTransition } from "react"
import { ImageIcon, PlusIcon, TrashIcon, ArrowUpIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import {
  addGaleriaImage,
  removeGaleriaImage,
  reorderGaleriaImages,
} from "../../../actions/vehiculo.actions"
import type { GaleriaItem } from "../../../types/vehiculo"
import type { UploadAdapter } from "../upload-adapter"

interface StepGaleriaProps {
  vehiculoId: string | null
  initialImages: GaleriaItem[]
  adapter: UploadAdapter
}

export function StepGaleria({ vehiculoId, initialImages, adapter: _adapter }: StepGaleriaProps) {
  const [images, setImages] = useState<GaleriaItem[]>(initialImages)
  const [newUrl, setNewUrl] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleAddImage() {
    if (!newUrl.trim()) return

    let isValidUrl = true
    try {
      new URL(newUrl.trim())
    } catch {
      isValidUrl = false
    }
    if (!isValidUrl) {
      toast.error("Ingresa una URL válida")
      return
    }

    if (!vehiculoId) {
      setImages((prev) => [
        ...prev,
        { id: `pending-${Date.now()}`, url: newUrl.trim(), orden: prev.length },
      ])
      setNewUrl("")
      return
    }

    startTransition(async () => {
      const result = await addGaleriaImage(vehiculoId, newUrl.trim(), images.length)
      if (result.ok && result.data) {
        setImages((prev) => [
          ...prev,
          { id: result.data!.id, url: result.data!.url, orden: result.data!.orden },
        ])
        setNewUrl("")
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="gallery-url" className="sr-only">URL de imagen</Label>
          <Input
            id="gallery-url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://cdn.ejemplo.com/imagen.jpg"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddImage}
          disabled={isPending || !newUrl.trim()}
          aria-label="Añadir imagen"
        >
          <PlusIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed gap-2 text-muted-foreground">
          <ImageIcon className="size-8" />
          <p className="text-sm">Añade URLs de imágenes arriba</p>
          {!vehiculoId && (
            <p className="text-xs">Las imágenes se guardarán al crear el vehículo</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, index) => (
            <div key={img.id} className="group relative rounded-lg border overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 bg-black/40 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7"
                    onClick={() => handleMoveUp(index)}
                    disabled={isPending}
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
                  disabled={isPending}
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
