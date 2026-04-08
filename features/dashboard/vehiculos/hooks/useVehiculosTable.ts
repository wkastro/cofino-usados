"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useRef, useTransition } from "react"
import { EstadoVenta } from "@/generated/prisma/enums"

const ESTADOS = Object.values(EstadoVenta)

export interface UseVehiculosTableReturn {
  search: string
  estado: string
  page: number
  isPending: boolean
  setSearch: (value: string) => void
  setEstado: (value: string) => void
  setPage: (value: number) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  estadoOptions: string[]
}

export function useVehiculosTable(): UseVehiculosTableReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const search = searchParams.get("q") ?? ""
  const estado = searchParams.get("estado") ?? ""
  const page = Number(searchParams.get("page") ?? "1")

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      // Whenever filters change, reset to page 1
      if (!("page" in updates)) params.set("page", "1")
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams],
  )

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setSearch = useCallback(
    (value: string) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
      searchTimerRef.current = setTimeout(() => {
        pushParams({ q: value })
      }, 350)
    },
    [pushParams],
  )

  const setEstado = useCallback(
    (value: string) => pushParams({ estado: value }),
    [pushParams],
  )

  const setPage = useCallback(
    (value: number) => pushParams({ page: String(value) }),
    [pushParams],
  )

  const clearFilters = useCallback(
    () => pushParams({ q: null, estado: null }),
    [pushParams],
  )

  return {
    search,
    estado,
    page,
    isPending,
    setSearch,
    setEstado,
    setPage,
    clearFilters,
    hasActiveFilters: !!(search || estado),
    estadoOptions: ESTADOS,
  }
}
