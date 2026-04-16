"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/dashboard/components/ui/dialog"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import { Label } from "@/features/dashboard/components/ui/label"
import { useClasificacionForm } from "../../hooks/useClasificacionForm"
import type { ClasificacionTipo } from "../../types/clasificacion"

interface CreateDialogProps {
  tipo: ClasificacionTipo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDialog({ tipo, open, onOpenChange }: CreateDialogProps) {
  const { form, onSubmit, isPending, handleNombreChange } = useClasificacionForm({
    tipo,
    onSuccess: () => onOpenChange(false),
  })

  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-nombre">Nombre</Label>
            <Input
              id="create-nombre"
              placeholder="Ej. Toyota"
              {...register("nombre")}
              onChange={(e) => handleNombreChange(e.target.value)}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-slug">Slug</Label>
            <Input
              id="create-slug"
              placeholder="Ej. toyota"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
