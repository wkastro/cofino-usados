"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { SearchIcon, XIcon, PlusIcon, FilterIcon } from "lucide-react"
import { Button } from "@/features/dashboard/components/ui/button"
import { Input } from "@/features/dashboard/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import type { UseVehiculosTableReturn } from "../../hooks/useVehiculosTable"

interface ToolbarProps {
  table: UseVehiculosTableReturn
}

const ALL_VALUE = "all"

export function VehiculosToolbar({ table }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync input with URL on external navigation
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== table.search) {
      inputRef.current.value = table.search
    }
  }, [table.search])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    table.setSearch(e.target.value)
  }

  function handleEstadoChange(value: string) {
    table.setEstado(value === ALL_VALUE ? "" : value)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <SearchIcon aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            defaultValue={table.search}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, placa..."
            aria-label="Buscar vehículos"
            className="pl-9"
          />
        </div>
        <Select
          value={table.estado || ALL_VALUE}
          onValueChange={handleEstadoChange}
        >
          <SelectTrigger className="w-[140px]" size="default">
            <FilterIcon aria-hidden="true" className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>
              {table.estadoOptions.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {table.hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={table.clearFilters}>
            <XIcon aria-hidden="true" className="size-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/vehiculos/nuevo">
          <PlusIcon aria-hidden="true" className="size-4 mr-1" />
          Nuevo vehículo
        </Link>
      </Button>
    </div>
  )
}
