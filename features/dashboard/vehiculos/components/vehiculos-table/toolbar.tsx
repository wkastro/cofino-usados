"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { SearchIcon, XIcon, PlusIcon, ChevronDownIcon } from "lucide-react"
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-sm">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={inputRef}
            defaultValue={table.search}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, placa..."
            aria-label="Buscar vehículos"
            className="pl-9"
          />
        </div>

        {/* Estado filter */}
        <Select value={table.estado || ALL_VALUE} onValueChange={handleEstadoChange}>
          <SelectTrigger className="w-36 shrink-0" size="default">
            <SelectValue placeholder="Estado" />
            <ChevronDownIcon aria-hidden="true" className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL_VALUE}>Todos los estados</SelectItem>
              {table.estadoOptions.map((e) => (
                <SelectItem key={e.id} value={e.slug ?? e.nombre}>
                  {e.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {table.hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={table.clearFilters}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <XIcon aria-hidden="true" className="mr-1 size-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Primary CTA */}
      <Button asChild size="sm" className="shrink-0">
        <Link href="/dashboard/vehiculos/nuevo">
          <PlusIcon aria-hidden="true" className="mr-1.5 size-4" />
          Nuevo vehículo
        </Link>
      </Button>
    </div>
  )
}
