// features/dashboard/vehiculos/components/vehiculos-table/row-actions.tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/features/dashboard/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/features/dashboard/components/ui/dropdown-menu"
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
import { deleteVehiculo, updateVehiculoEstado } from "../../actions/vehiculo.actions"
import { EstadoBadge } from "../shared/estado-badge"
import type { SelectOption, VehiculoRow } from "../../types/vehiculo"

interface RowActionsProps {
  row: VehiculoRow
  estadoOptions: SelectOption[]
}

export function RowActions({ row, estadoOptions }: RowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  function handleEdit() {
    router.push(`/dashboard/vehiculos/${row.id}/editar`)
  }

  function handleEstadoChange(estadoId: string) {
    startTransition(async () => {
      const result = await updateVehiculoEstado(row.id, estadoId)
      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleConfirmDelete() {
    startTransition(async () => {
      const result = await deleteVehiculo(row.id)
      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const otherEstados = estadoOptions.filter((e) => e.id !== row.estadoVenta.id)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            disabled={isPending}
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Acciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            {row.nombre}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <PencilIcon className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          {otherEstados.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <EstadoBadge estado={row.estadoVenta.nombre} />
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {otherEstados.map((estado) => (
                  <DropdownMenuItem
                    key={estado.id}
                    onClick={() => handleEstadoChange(estado.id)}
                  >
                    <EstadoBadge estado={estado.nombre} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <TrashIcon className="mr-2 size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <span className="font-medium text-foreground">{row.nombre}</span> de
              forma permanente junto con todas sus imágenes. Esta acción no se puede deshacer.
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
    </>
  )
}
