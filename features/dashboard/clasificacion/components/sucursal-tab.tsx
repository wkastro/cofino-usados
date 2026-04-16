"use client"

import { useState, useMemo, useCallback } from "react"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/dashboard/components/ui/table"
import { CreateDialog } from "./sucursal-dialog/create-dialog"
import { EditDialog } from "./sucursal-dialog/edit-dialog"
import { getSucursalColumns } from "./sucursal-table/columns"
import type { Sucursal } from "../types/sucursal"

interface SucursalTabProps {
  data: Sucursal[]
}

export function SucursalTab({ data }: SucursalTabProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Sucursal | null>(null)
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      data.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.direccion.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  )

  const handleEdit = useCallback((row: Sucursal) => {
    setSelectedRow(row)
    setEditOpen(true)
  }, [])

  const columns = useMemo(() => getSucursalColumns(handleEdit), [handleEdit])

  const table = useReactTable<Sucursal>({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en sucursales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="mr-1.5 size-4" />
          Nueva
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
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
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium">
                      {search ? "Sin resultados para la búsqueda" : "No hay sucursales registradas"}
                    </p>
                    {!search && (
                      <p className="text-xs">Crea la primera sucursal con el botón "Nueva"</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditDialog
        key={selectedRow?.id}
        row={selectedRow}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setSelectedRow(null)
        }}
      />
    </div>
  )
}
