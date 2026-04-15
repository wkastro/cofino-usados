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
import { useEspecificacionForm } from "../../hooks/useEspecificacionForm"
import type { Especificacion, EspecificacionTipo } from "../../types/especificacion"

interface EditDialogProps {
  tipo: EspecificacionTipo
  row: Especificacion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDialog({ tipo, row, open, onOpenChange }: EditDialogProps) {
  const { form, onSubmit, isPending, handleNombreChange } = useEspecificacionForm({
    tipo,
    defaultValues: row ?? undefined,
    onSuccess: () => onOpenChange(false),
  })

  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nombre">Nombre</Label>
            <Input
              id="edit-nombre"
              {...register("nombre")}
              onChange={(e) => handleNombreChange(e.target.value)}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input id="edit-slug" {...register("slug")} />
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
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
