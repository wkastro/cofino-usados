"use client"

import { useState, useCallback, useMemo } from "react"
import type { Clasificacion } from "../types/clasificacion"

export function useClasificacionTable(data: Clasificacion[]) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      data.filter(
        (item) =>
          item.nombre.toLowerCase().includes(search.toLowerCase()) ||
          item.slug.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  )

  const clearSearch = useCallback(() => setSearch(""), [])

  return { search, setSearch, filtered, clearSearch, total: data.length }
}
