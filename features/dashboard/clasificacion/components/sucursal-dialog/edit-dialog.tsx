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
import { useSucursalForm } from "../../hooks/useSucursalForm"
import type { Sucursal } from "../../types/sucursal"

interface EditDialogProps {
  row: Sucursal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDialog({ row, open, onOpenChange }: EditDialogProps) {
  const { form, onSubmit, isPending } = useSucursalForm({
    defaultValues: row ?? undefined,
    onSuccess: () => onOpenChange(false),
  })

  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar sucursal</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nombre">Nombre</Label>
            <Input id="edit-nombre" {...register("nombre")} />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-direccion">Dirección</Label>
            <Input id="edit-direccion" {...register("direccion")} />
            {errors.direccion && (
              <p className="text-xs text-destructive">{errors.direccion.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-latitud">Latitud</Label>
              <Input id="edit-latitud" type="number" step="any" {...register("latitud", { valueAsNumber: true })} />
              {errors.latitud && (
                <p className="text-xs text-destructive">{errors.latitud.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-longitud">Longitud</Label>
              <Input id="edit-longitud" type="number" step="any" {...register("longitud", { valueAsNumber: true })} />
              {errors.longitud && (
                <p className="text-xs text-destructive">{errors.longitud.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-maps">
              Google Maps <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input id="edit-maps" {...register("maps")} />
            {errors.maps && (
              <p className="text-xs text-destructive">{errors.maps.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-waze">
              Waze <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input id="edit-waze" {...register("waze")} />
            {errors.waze && (
              <p className="text-xs text-destructive">{errors.waze.message}</p>
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
