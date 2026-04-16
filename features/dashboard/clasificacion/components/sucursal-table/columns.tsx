"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/features/dashboard/components/ui/badge"
import type { Sucursal } from "../../types/sucursal"
import { RowActions } from "./row-actions"

export function getSucursalColumns(
  onEdit: (row: Sucursal) => void,
): ColumnDef<Sucursal>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: "direccion",
      header: "Dirección",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.direccion}</span>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.estado ? "default" : "secondary"}>
          {row.original.estado ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <RowActions row={row.original} onEdit={onEdit} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
