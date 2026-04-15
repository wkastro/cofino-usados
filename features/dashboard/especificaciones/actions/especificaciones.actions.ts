"use server"

import { revalidateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { especificacionSchema } from "../validations/especificacion"
import type { EspecificacionTipo, EspecificacionActionResult } from "../types/especificacion"
import type { EspecificacionInput } from "../validations/especificacion"

const CACHE_TAGS: Record<EspecificacionTipo, string> = {
  transmision: "admin-transmisiones",
  combustible: "admin-combustibles",
  traccion: "admin-tracciones",
  estado: "admin-estados",
}

function getDelegate(tipo: EspecificacionTipo) {
  switch (tipo) {
    case "transmision": return prisma.transmision
    case "combustible": return prisma.combustible
    case "traccion":    return prisma.traccion
    case "estado":      return prisma.estadoVenta
  }
}

export async function createEspecificacion(
  tipo: EspecificacionTipo,
  input: EspecificacionInput,
): Promise<EspecificacionActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = especificacionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const record = await (getDelegate(tipo) as any).create({
      data: { nombre: parsed.data.nombre, slug: parsed.data.slug },
      select: { id: true },
    })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: "Registro creado.", data: { id: record.id } }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { ok: false, message: "Ya existe un registro con ese nombre o slug." }
    }
    console.error(`[createEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al crear el registro." }
  }
}

export async function updateEspecificacion(
  tipo: EspecificacionTipo,
  id: string,
  input: EspecificacionInput,
): Promise<EspecificacionActionResult> {
  await requireAdmin()

  const parsed = especificacionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await (getDelegate(tipo) as any).update({
      where: { id },
      data: { nombre: parsed.data.nombre, slug: parsed.data.slug },
    })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: "Registro actualizado." }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { ok: false, message: "Ya existe un registro con ese nombre o slug." }
    }
    console.error(`[updateEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al actualizar el registro." }
  }
}

export async function deleteEspecificacion(
  tipo: EspecificacionTipo,
  id: string,
): Promise<EspecificacionActionResult> {
  await requireAdmin()

  const fkField: Record<EspecificacionTipo, string> = {
    transmision: "transmisionId",
    combustible: "combustibleId",
    traccion: "traccionId",
    estado: "estadoId",
  }

  const count = await prisma.vehiculo.count({ where: { [fkField[tipo]]: id } })
  if (count > 0) {
    return {
      ok: false,
      message: `No se puede eliminar: ${count} vehículo${count !== 1 ? "s" : ""} usa${count === 1 ? "" : "n"} este registro.`,
    }
  }

  try {
    await (getDelegate(tipo) as any).delete({ where: { id } })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: "Registro eliminado." }
  } catch (error) {
    console.error(`[deleteEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al eliminar el registro." }
  }
}

export async function toggleEstadoEspecificacion(
  tipo: EspecificacionTipo,
  id: string,
  estado: boolean,
): Promise<EspecificacionActionResult> {
  await requireAdmin()

  try {
    await (getDelegate(tipo) as any).update({ where: { id }, data: { estado } })
    revalidateTag(CACHE_TAGS[tipo])
    revalidateTag("admin-all-especificaciones")
    return { ok: true, message: estado ? "Registro activado." : "Registro desactivado." }
  } catch (error) {
    console.error(`[toggleEstadoEspecificacion:${tipo}]`, error)
    return { ok: false, message: "Error al cambiar el estado." }
  }
}
