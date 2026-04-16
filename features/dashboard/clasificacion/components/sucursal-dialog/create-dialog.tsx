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

interface CreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const { form, onSubmit, isPending } = useSucursalForm({
    onSuccess: () => onOpenChange(false),
  })

  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva sucursal</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-nombre">Nombre</Label>
            <Input
              id="create-nombre"
              placeholder="Ej. Sucursal Central"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-direccion">Dirección</Label>
            <Input
              id="create-direccion"
              placeholder="Ej. Av. Principal 123"
              {...register("direccion")}
            />
            {errors.direccion && (
              <p className="text-xs text-destructive">{errors.direccion.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-latitud">Latitud</Label>
              <Input
                id="create-latitud"
                type="number"
                step="any"
                placeholder="Ej. 9.9281"
                {...register("latitud", { valueAsNumber: true })}
              />
              {errors.latitud && (
                <p className="text-xs text-destructive">{errors.latitud.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-longitud">Longitud</Label>
              <Input
                id="create-longitud"
                type="number"
                step="any"
                placeholder="Ej. -84.0907"
                {...register("longitud", { valueAsNumber: true })}
              />
              {errors.longitud && (
                <p className="text-xs text-destructive">{errors.longitud.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-maps">
              Google Maps <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="create-maps"
              placeholder="https://maps.google.com/..."
              {...register("maps")}
            />
            {errors.maps && (
              <p className="text-xs text-destructive">{errors.maps.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-waze">
              Waze <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="create-waze"
              placeholder="https://waze.com/ul/..."
              {...register("waze")}
            />
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
              {isPending ? "Guardando..." : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
