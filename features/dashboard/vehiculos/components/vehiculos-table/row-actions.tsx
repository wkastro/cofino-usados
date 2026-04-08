// features/dashboard/vehiculos/components/vehiculos-table/row-actions.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, CircleDotIcon } from "lucide-react"
import { toast } from "sonner"
import { EstadoVenta } from "@/generated/prisma/enums"
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
import { deleteVehiculo, changeEstadoVehiculo } from "../../actions/vehiculo.actions"
import type { VehiculoRow } from "../../types/vehiculo"

const ESTADOS = Object.values(EstadoVenta)

interface RowActionsProps {
  row: VehiculoRow
}

export function RowActions({ row }: RowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleEdit() {
    router.push(`/dashboard/vehiculos/${row.id}/editar`)
  }

  function handleChangeEstado(estado: EstadoVenta) {
    startTransition(async () => {
      const result = await changeEstadoVehiculo(row.id, estado)
      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar "${row.nombre}"? Esta acción no se puede deshacer.`)) return

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
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <PencilIcon className="mr-2 size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <CircleDotIcon className="mr-2 size-4" />
            Cambiar estado
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {ESTADOS.map((estado) => (
              <DropdownMenuItem
                key={estado}
                disabled={estado === row.estado}
                onClick={() => handleChangeEstado(estado)}
              >
                {estado}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <TrashIcon className="mr-2 size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
