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
  const tableHook = useVehiculosTable(data.estadoOptions)

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

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70"
                  >
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
                <TableRow
                  key={row.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={vehiculosColumns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">No se encontraron vehículos</p>
                      <p className="text-xs mt-0.5">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">{data.total}</span>{" "}
          vehículo{data.total !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground tabular-nums lg:block">
            Página{" "}
            <span className="font-medium text-foreground">{data.page}</span>
            {" "}de{" "}
            <span className="font-medium text-foreground">{data.pages}</span>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => tableHook.setPage(1)}
              disabled={data.page <= 1}
            >
              <ChevronsLeftIcon aria-hidden="true" />
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => tableHook.setPage(data.page - 1)}
              disabled={data.page <= 1}
            >
              <ChevronLeftIcon aria-hidden="true" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => tableHook.setPage(data.page + 1)}
              disabled={data.page >= data.pages}
            >
              <ChevronRightIcon aria-hidden="true" />
              <span className="sr-only">Página siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => tableHook.setPage(data.pages)}
              disabled={data.page >= data.pages}
            >
              <ChevronsRightIcon aria-hidden="true" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
