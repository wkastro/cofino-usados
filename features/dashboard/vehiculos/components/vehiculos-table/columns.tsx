// features/dashboard/vehiculos/components/vehiculos-table/columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency, formatKilometers } from "@/lib/formatters/vehicle"
import { EstadoBadge } from "../shared/estado-badge"
import { RowActions } from "./row-actions"
import type { VehiculoRow } from "../../types/vehiculo"

export const vehiculosColumns: ColumnDef<VehiculoRow>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="min-w-45">
        <p className="font-medium leading-tight">{row.original.nombre}</p>
        <p className="text-xs text-muted-foreground">{row.original.placa}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => <span className="text-sm">{row.original.marca}</span>,
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <span className="text-sm">{row.original.categoria}</span>,
  },
  {
    accessorKey: "anio",
    header: "Año",
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.anio}</span>,
  },
  {
    accessorKey: "precio",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {formatCurrency(row.original.precio)}
      </div>
    ),
  },
  {
    accessorKey: "kilometraje",
    header: () => <div className="text-right">KM</div>,
    cell: ({ row }) => (
      <div className="text-right text-sm tabular-nums text-muted-foreground">
        {formatKilometers(row.original.kilometraje)}
      </div>
    ),
  },
  {
    accessorKey: "sucursal",
    header: "Sucursal",
    cell: ({ row }) => <span className="text-sm">{row.original.sucursal}</span>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <EstadoBadge estado={row.original.estado} />,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RowActions row={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
