"use server"

import { updateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { sucursalSchema } from "../validations/sucursal"
import type { SucursalActionResult } from "../types/sucursal"
import type { SucursalInput } from "../validations/sucursal"

export async function createSucursal(
  input: SucursalInput,
): Promise<SucursalActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = sucursalSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const record = await prisma.sucursal.create({
      data: {
        nombre: parsed.data.nombre,
        direccion: parsed.data.direccion,
        latitud: parsed.data.latitud,
        longitud: parsed.data.longitud,
        maps: parsed.data.maps ?? null,
        waze: parsed.data.waze ?? null,
      },
      select: { id: true },
    })
    updateTag("admin-sucursales")
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: "Sucursal creada.", data: { id: record.id } }
  } catch (error) {
    if ((error as any)?.code === "P2002") {
      return { ok: false, message: "Ya existe una sucursal con ese nombre." }
    }
    console.error("[createSucursal]", error)
    return { ok: false, message: "Error al crear la sucursal." }
  }
}

export async function updateSucursal(
  id: string,
  input: SucursalInput,
): Promise<SucursalActionResult> {
  await requireAdmin()

  const parsed = sucursalSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await prisma.sucursal.update({
      where: { id },
      data: {
        nombre: parsed.data.nombre,
        direccion: parsed.data.direccion,
        latitud: parsed.data.latitud,
        longitud: parsed.data.longitud,
        maps: parsed.data.maps ?? null,
        waze: parsed.data.waze ?? null,
      },
    })
    updateTag("admin-sucursales")
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: "Sucursal actualizada." }
  } catch (error) {
    if ((error as any)?.code === "P2002") {
      return { ok: false, message: "Ya existe una sucursal con ese nombre." }
    }
    console.error("[updateSucursal]", error)
    return { ok: false, message: "Error al actualizar la sucursal." }
  }
}

export async function deleteSucursal(id: string): Promise<SucursalActionResult> {
  await requireAdmin()

  const count = await prisma.vehiculo.count({ where: { sucursalId: id } })
  if (count > 0) {
    return {
      ok: false,
      message: `No se puede eliminar: ${count} vehículo${count !== 1 ? "s" : ""} usa${count === 1 ? "" : "n"} esta sucursal.`,
    }
  }

  try {
    await prisma.sucursal.delete({ where: { id } })
    updateTag("admin-sucursales")
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: "Sucursal eliminada." }
  } catch (error) {
    console.error("[deleteSucursal]", error)
    return { ok: false, message: "Error al eliminar la sucursal." }
  }
}

export async function toggleEstadoSucursal(
  id: string,
  estado: boolean,
): Promise<SucursalActionResult> {
  await requireAdmin()

  try {
    await prisma.sucursal.update({ where: { id }, data: { estado } })
    updateTag("admin-sucursales")
    updateTag("admin-all-clasificaciones")
    return { ok: true, message: estado ? "Sucursal activada." : "Sucursal desactivada." }
  } catch (error) {
    console.error("[toggleEstadoSucursal]", error)
    return { ok: false, message: "Error al cambiar el estado." }
  }
}
