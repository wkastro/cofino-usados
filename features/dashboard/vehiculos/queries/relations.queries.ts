import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { SelectOption, VehiculoRelationOptions } from "../types/vehiculo"

export async function getCachedMarcasOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-marcas-options")

  return prisma.marca.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedCategoriasOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-categorias-options")

  return prisma.categoria.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedSucursalesOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-sucursales-options")

  return prisma.sucursal.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedEtiquetasOptions(): Promise<SelectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-etiquetas-options")

  return prisma.etiquetaComercial.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  })
}

export async function getCachedRelationOptions(): Promise<VehiculoRelationOptions> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-relation-options")

  const [marcas, categorias, sucursales, etiquetas] = await Promise.all([
    getCachedMarcasOptions(),
    getCachedCategoriasOptions(),
    getCachedSucursalesOptions(),
    getCachedEtiquetasOptions(),
  ])

  return { marcas, categorias, sucursales, etiquetas }
}
