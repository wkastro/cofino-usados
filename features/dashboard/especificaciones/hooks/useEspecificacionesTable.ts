"use client"

import { useState, useCallback } from "react"
import type { Especificacion } from "../types/especificacion"

export function useEspecificacionesTable(data: Especificacion[]) {
  const [search, setSearch] = useState("")

  const filtered = data.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()),
  )

  const clearSearch = useCallback(() => setSearch(""), [])

  return { search, setSearch, filtered, clearSearch, total: data.length }
}
