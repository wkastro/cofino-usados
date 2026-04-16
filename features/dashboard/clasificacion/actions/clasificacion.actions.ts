"use server"

import { updateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { clasificacionSchema } from "../validations/clasificacion"
import type { ClasificacionTipo, ClasificacionActionResult } from "../types/clasificacion"
import type { ClasificacionInput } from "../validations/clasificacion"

const CACHE_TAGS: Record<ClasificacionTipo, string> = {
  marca: "admin-marcas",
  categoria: "admin-categorias",
  etiquetaComercial: "admin-etiquetas",
}

const FK_FIELDS: Record<ClasificacionTipo, string> = {
  marca: "marcaId",
  categoria: "categoriaId",
  etiquetaComercial: "etiquetaComercialId",
}

function getDelegate(tipo: ClasificacionTipo) {
  switch (tipo) {
    case "marca":             return prisma.marca
    case "categoria":         return prisma.categoria
    case "etiquetaComercial": return prisma.etiquetaComercial
  }
}

export async function createClasificacion(
  tipo: ClasificacionTipo,
  input: ClasificacionInput,
): Promise<ClasificacionActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = clasificacionSchema.safeParse(input)
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
    updateTag(CACHE_TAGS[tipo])
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: "Registro creado.", data: { id: record.id } }
  } catch (error) {
    if ((error as any)?.code === "P2002") {
      return { ok: false, message: "Ya existe un registro con ese nombre o slug." }
    }
    console.error(`[createClasificacion:${tipo}]`, error)
    return { ok: false, message: "Error al crear el registro." }
  }
}

export async function updateClasificacion(
  tipo: ClasificacionTipo,
  id: string,
  input: ClasificacionInput,
): Promise<ClasificacionActionResult> {
  await requireAdmin()

  const parsed = clasificacionSchema.safeParse(input)
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
    updateTag(CACHE_TAGS[tipo])
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: "Registro actualizado." }
  } catch (error) {
    if ((error as any)?.code === "P2002") {
      return { ok: false, message: "Ya existe un registro con ese nombre o slug." }
    }
    console.error(`[updateClasificacion:${tipo}]`, error)
    return { ok: false, message: "Error al actualizar el registro." }
  }
}

export async function deleteClasificacion(
  tipo: ClasificacionTipo,
  id: string,
): Promise<ClasificacionActionResult> {
  await requireAdmin()

  const count = await prisma.vehiculo.count({ where: { [FK_FIELDS[tipo]]: id } })
  if (count > 0) {
    return {
      ok: false,
      message: `No se puede eliminar: ${count} vehículo${count !== 1 ? "s" : ""} usa${count === 1 ? "" : "n"} este registro.`,
    }
  }

  try {
    await (getDelegate(tipo) as any).delete({ where: { id } })
    updateTag(CACHE_TAGS[tipo])
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: "Registro eliminado." }
  } catch (error) {
    console.error(`[deleteClasificacion:${tipo}]`, error)
    return { ok: false, message: "Error al eliminar el registro." }
  }
}

export async function toggleEstadoClasificacion(
  tipo: ClasificacionTipo,
  id: string,
  estado: boolean,
): Promise<ClasificacionActionResult> {
  await requireAdmin()

  try {
    await (getDelegate(tipo) as any).update({ where: { id }, data: { estado } })
    updateTag(CACHE_TAGS[tipo])
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: estado ? "Registro activado." : "Registro desactivado." }
  } catch (error) {
    console.error(`[toggleEstadoClasificacion:${tipo}]`, error)
    return { ok: false, message: "Error al cambiar el estado." }
  }
}
