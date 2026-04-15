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
import { deleteVehiculo } from "../../actions/vehiculo.actions"
import type { VehiculoRow } from "../../types/vehiculo"

interface RowActionsProps {
  row: VehiculoRow
}

export function RowActions({ row }: RowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  function handleEdit() {
    router.push(`/dashboard/vehiculos/${row.id}/editar`)
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
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            {row.nombre}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <PencilIcon className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
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
