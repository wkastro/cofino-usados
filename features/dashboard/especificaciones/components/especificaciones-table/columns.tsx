"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/features/dashboard/components/ui/badge"
import type { Especificacion, EspecificacionTipo } from "../../types/especificacion"
import { RowActions } from "./row-actions"

export function getEspecificacionesColumns(
  tipo: EspecificacionTipo,
  onEdit: (row: Especificacion) => void,
): ColumnDef<Especificacion>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {row.original.slug}
        </code>
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
        <RowActions row={row.original} tipo={tipo} onEdit={onEdit} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
