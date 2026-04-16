import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { Clasificacion, AllClasificaciones } from "../types/clasificacion"
import type { Sucursal } from "../types/sucursal"

export async function getCachedMarcas(): Promise<Clasificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-marcas")
  return prisma.marca.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedCategorias(): Promise<Clasificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-categorias")
  return prisma.categoria.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedEtiquetas(): Promise<Clasificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-etiquetas")
  return prisma.etiquetaComercial.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedSucursales(): Promise<Sucursal[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-sucursales")
  const results = await prisma.sucursal.findMany({ orderBy: { nombre: "asc" } })
  return results.map((s) => ({
    ...s,
    latitud: s.latitud.toNumber(),
    longitud: s.longitud.toNumber(),
  }))
}

export async function getCachedAllClasificaciones(): Promise<AllClasificaciones> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-all-clasificaciones")

  const [marcas, categorias, etiquetas, sucursales] = await Promise.all([
    getCachedMarcas(),
    getCachedCategorias(),
    getCachedEtiquetas(),
    getCachedSucursales(),
  ])

  return { marcas, categorias, etiquetas, sucursales }
}
