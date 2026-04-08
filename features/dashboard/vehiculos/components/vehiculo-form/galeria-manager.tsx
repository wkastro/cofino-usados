"use client"

import { useState, useTransition } from "react"
import { ImageIcon, PlusIcon, TrashIcon, GripVerticalIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/dashboard/components/ui/card"
import {
  addGaleriaImage,
  removeGaleriaImage,
  reorderGaleriaImages,
} from "../../actions/vehiculo.actions"
import type { GaleriaItem } from "../../types/vehiculo"

interface GaleriaManagerProps {
  vehiculoId: string
  initialImages: GaleriaItem[]
}

export function GaleriaManager({ vehiculoId, initialImages }: GaleriaManagerProps) {
  const [images, setImages] = useState<GaleriaItem[]>(initialImages)
  const [newUrl, setNewUrl] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleAddImage() {
    if (!newUrl.trim()) return

    startTransition(async () => {
      const orden = images.length
      const result = await addGaleriaImage(vehiculoId, newUrl.trim(), orden)
      if (result.ok) {
        setImages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), url: newUrl.trim(), orden },
        ])
        setNewUrl("")
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleRemove(galeriaId: string) {
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
    const reordered = [...images]
    ;[reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]]
    const withOrden = reordered.map((img, i) => ({ ...img, orden: i }))
    setImages(withOrden)

    startTransition(async () => {
      const result = await reorderGaleriaImages(
        vehiculoId,
        withOrden.map(({ id, orden }) => ({ id, orden })),
      )
      if (!result.ok) toast.error(result.message)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-5" aria-hidden="true" />
          Galería
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Add URL form */}
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
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Sin imágenes. Añade una URL arriba.
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
                      <GripVerticalIcon className="size-3" aria-hidden="true" />
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
      </CardContent>
    </Card>
  )
}
