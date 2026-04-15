import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { Especificacion, AllEspecificaciones } from "../types/especificacion"

export async function getCachedTransmisiones(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-transmisiones")
  return prisma.transmision.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedCombustibles(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-combustibles")
  return prisma.combustible.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedTracciones(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-tracciones")
  return prisma.traccion.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedEstados(): Promise<Especificacion[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-estados")
  return prisma.estadoVenta.findMany({ orderBy: { nombre: "asc" } })
}

export async function getCachedAllEspecificaciones(): Promise<AllEspecificaciones> {
  "use cache"
  cacheLife("hours")
  cacheTag("admin-all-especificaciones")

  const [transmisiones, combustibles, tracciones, estados] = await Promise.all([
    getCachedTransmisiones(),
    getCachedCombustibles(),
    getCachedTracciones(),
    getCachedEstados(),
  ])

  return { transmisiones, combustibles, tracciones, estados }
}
