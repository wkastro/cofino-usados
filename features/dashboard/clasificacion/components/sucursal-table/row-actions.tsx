"use client"

import { useState, useTransition } from "react"
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon } from "lucide-react"
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
import { deleteSucursal, toggleEstadoSucursal } from "../../actions/sucursal.actions"
import type { Sucursal } from "../../types/sucursal"

interface RowActionsProps {
  row: Sucursal
  onEdit: (row: Sucursal) => void
}

export function RowActions({ row, onEdit }: RowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleEstadoSucursal(row.id, !row.estado)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  function handleConfirmDelete() {
    startTransition(async () => {
      const result = await deleteSucursal(row.id)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
      setDeleteOpen(false)
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
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {row.nombre}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(row)}>
            <PencilIcon className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggle}>
            {row.estado ? (
              <ToggleRightIcon className="mr-2 size-4" />
            ) : (
              <ToggleLeftIcon className="mr-2 size-4" />
            )}
            {row.estado ? "Desactivar" : "Activar"}
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
            <AlertDialogTitle>¿Eliminar sucursal?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará{" "}
              <span className="font-medium text-foreground">{row.nombre}</span>{" "}
              de forma permanente. Esta acción no se puede deshacer.
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
