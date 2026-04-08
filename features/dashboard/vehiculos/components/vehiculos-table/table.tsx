"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { Button } from "@/features/dashboard/components/ui/button"
import { Label } from "@/features/dashboard/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/dashboard/components/ui/table"
import { vehiculosColumns } from "./columns"
import { VehiculosToolbar } from "./toolbar"
import { useVehiculosTable } from "../../hooks/useVehiculosTable"
import type { VehiculoRow, VehiculosAdminResponse } from "../../types/vehiculo"

interface VehiculosTableProps {
  data: VehiculosAdminResponse
}

export function VehiculosTable({ data }: VehiculosTableProps) {
  const tableHook = useVehiculosTable()

  const table = useReactTable<VehiculoRow>({
    data: data.vehiculos,
    columns: vehiculosColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data.pages,
    state: {
      pagination: {
        pageIndex: data.page - 1,
        pageSize: 20,
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <VehiculosToolbar table={tableHook} />

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={vehiculosColumns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No se encontraron vehículos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="hidden text-sm text-muted-foreground lg:block">
          {data.total} vehículo{data.total !== 1 ? "s" : ""} en total
        </p>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label className="text-sm font-medium">Página</Label>
            <span className="text-sm tabular-nums">
              {data.page} / {data.pages}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => tableHook.setPage(1)}
              disabled={data.page <= 1}
            >
              <ChevronsLeftIcon />
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => tableHook.setPage(data.page - 1)}
              disabled={data.page <= 1}
            >
              <ChevronLeftIcon />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => tableHook.setPage(data.page + 1)}
              disabled={data.page >= data.pages}
            >
              <ChevronRightIcon />
              <span className="sr-only">Página siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => tableHook.setPage(data.pages)}
              disabled={data.page >= data.pages}
            >
              <ChevronsRightIcon />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
