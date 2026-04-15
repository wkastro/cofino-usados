"use client"

import { useRef, useState, useTransition } from "react"
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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ImageIcon, TrashIcon, GripVertical, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useUploadFiles } from "@/features/s3/use-upload-files"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/dashboard/components/ui/alert-dialog"
import {
  addGaleriaImage,
  removeGaleriaImage,
  reorderGaleriaImages,
} from "../../../actions/vehiculo.actions"
import { UPLOAD_ROUTES } from "@/features/s3"
import type { GaleriaItem } from "../../../types/vehiculo"

// ─── Subcomponent ─────────────────────────────────────────────────────────────

interface SortableGaleriaItemProps {
  img: GaleriaItem
  index: number
  isBusy: boolean
  onDeleteRequest: (img: GaleriaItem) => void
}

function SortableGaleriaItem({
  img,
  index,
  isBusy,
  onDeleteRequest,
}: SortableGaleriaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id, disabled: isBusy })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-lg border"
    >
      <div className="relative aspect-video bg-muted">
        <Image
          src={img.url}
          alt={`Imagen ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-start justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 bg-black/30">
        {/* Drag handle */}
        <button
          type="button"
          className="flex size-8 cursor-grab items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50 active:cursor-grabbing"
          disabled={isBusy}
          aria-label="Arrastrar para reordenar"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>

        {/* Delete button */}
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-md bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          onClick={() => onDeleteRequest(img)}
          disabled={isBusy}
          aria-label="Eliminar imagen"
        >
          <TrashIcon className="size-4" aria-hidden="true" />
        </button>
      </div>

      {index === 0 && (
        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
          Principal
        </span>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface StepGaleriaProps {
  vehiculoId: string | null
  initialImages: GaleriaItem[]
}

export function StepGaleria({ vehiculoId, initialImages }: StepGaleriaProps) {
  const [images, setImages] = useState<GaleriaItem[]>(initialImages)
  const [imageToDelete, setImageToDelete] = useState<GaleriaItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPending, startTransition] = useTransition()

  const nextOrdenRef = useRef(initialImages.length)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const { upload, progresses, isPending: isUploading } = useUploadFiles({
    route: UPLOAD_ROUTES.vehiculoImages,
    onUploadComplete: ({ files }) => {
      files.forEach((file) => {
        const url = file.objectInfo.url
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
  })

  function handleConfirmDelete() {
    if (!imageToDelete) return
    const target = imageToDelete
    setImageToDelete(null)

    // pending images (no vehiculoId) — remove locally only
    if (!vehiculoId || target.id.startsWith("pending-")) {
      setImages((prev) => prev.filter((img) => img.id !== target.id))
      return
    }

    startTransition(async () => {
      const result = await removeGaleriaImage(target.id, vehiculoId)
      if (result.ok) {
        setImages((prev) => prev.filter((img) => img.id !== target.id))
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    if (isBusy) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)

    const previous = images
    const reordered = arrayMove(images, oldIndex, newIndex)
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

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (isBusy || !vehiculoId) return
    const files = e.dataTransfer.files
    if (!files?.length) return
    upload(files, { metadata: { vehiculoId } })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* File picker */}
      {!vehiculoId ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed gap-2 text-muted-foreground opacity-60">
          <UploadIcon className="size-6" aria-hidden="true" />
          <p className="text-sm">Al guardar serás redirigido aquí para añadir imágenes</p>
        </div>
      ) : (
        <label
          htmlFor="gallery-upload"
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
          onDrop={handleDrop}
          className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed gap-2 text-muted-foreground transition-colors hover:bg-muted/50 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50${isDragging ? " bg-muted/70 border-primary" : ""}`}
        >
          <UploadIcon className="size-6" aria-hidden="true" />
          <p className="text-sm">{isDragging ? "Suelta para subir" : "Haz clic o arrastra imágenes aquí"}</p>
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
              upload(e.target.files, { metadata: { vehiculoId } })
              e.target.value = ""
            }}
          />
        </label>
      )}

      {/* Per-file upload progress */}
      {isUploading && progresses.length > 0 && (
        <ul className="flex flex-col gap-1" aria-label="Progreso de subida">
          {progresses.map((file) => (
            <li
              key={file.name}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img, index) => (
                <SortableGaleriaItem
                  key={img.id}
                  img={img}
                  index={index}
                  isBusy={isBusy}
                  onDeleteRequest={setImageToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => { if (!open) setImageToDelete(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada permanentemente de la galería.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
