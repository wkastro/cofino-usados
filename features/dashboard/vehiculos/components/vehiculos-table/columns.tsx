// features/dashboard/vehiculos/components/vehiculos-table/columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency, formatKilometers } from "@/lib/formatters/vehicle"
import { EstadoBadge } from "../shared/estado-badge"
import { RowActions } from "./row-actions"
import type { SelectOption, VehiculoRow } from "../../types/vehiculo"

export function vehiculosColumns(estadoOptions: SelectOption[]): ColumnDef<VehiculoRow>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Vehículo",
      cell: ({ row }) => (
        <div className="min-w-44 max-w-56">
          <p className="truncate font-medium leading-tight">{row.original.nombre}</p>
          <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{row.original.placa}</p>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "marca",
      header: "Marca",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.marca}</span>
      ),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.categoria}</span>
      ),
    },
    {
      accessorKey: "anio",
      header: "Año",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">{row.original.anio}</span>
      ),
    },
    {
      accessorKey: "precio",
      header: () => <div className="text-right">Precio</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold tabular-nums">
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
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.sucursal}</span>
      ),
    },
    {
      accessorKey: "estadoVenta",
      header: "Estado",
      cell: ({ row }) => <EstadoBadge estado={row.original.estadoVenta.nombre} />,
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => <RowActions row={row.original} estadoOptions={estadoOptions} />,
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
