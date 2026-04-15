"use server"

import { revalidatePath } from "next/cache"
import { updateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { vehiculoSchema, galeriaImageSchema } from "../validations/vehiculo"
import { generateVehiculoSlug } from "../lib/slug"
import type { VehiculoInput } from "../validations/vehiculo"
import type { ActionResult } from "../types/vehiculo"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function revalidateVehiculoCaches(slug?: string, id?: string): void {
  updateTag("admin-vehiculos")
  updateTag("vehicle-list")
  updateTag("home-recommendations")
  if (slug) updateTag(`vehicle-${slug}`)
  if (id) updateTag(`admin-vehiculo-${id}`)
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createVehiculo(
  input: VehiculoInput,
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin()

  const parsed = vehiculoSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  const marca = await prisma.marca.findUnique({
    where: { id: data.marcaId },
    select: { nombre: true },
  })
  if (!marca) return { ok: false, message: "La marca seleccionada no existe." }

  let slug = generateVehiculoSlug(data.nombre, marca.nombre, data.anio, data.placa)
  const existing = await prisma.vehiculo.findUnique({ where: { slug }, select: { id: true } })
  if (existing) slug = `${slug}-${Date.now()}`

  let vehiculo: { id: string; slug: string }
  try {
    vehiculo = await prisma.vehiculo.create({
      data: {
        nombre: data.nombre,
        slug,
        codigo: data.codigo ?? null,
        placa: data.placa,
        precio: data.precio,
        preciodescuento: data.preciodescuento ?? null,
        kilometraje: data.kilometraje,
        motor: data.motor ?? null,
        anio: data.anio,
        estadoId: data.estadoId,
        transmisionId: data.transmisionId,
        combustibleId: data.combustibleId,
        traccionId: data.traccionId,
        color_interior: data.color_interior ?? null,
        color_exterior: data.color_exterior ?? null,
        descripcion: data.descripcion ?? null,
        marcaId: data.marcaId,
        sucursalId: data.sucursalId,
        categoriaId: data.categoriaId,
        etiquetaComercialId: data.etiquetaComercialId ?? null,
      },
      select: { id: true, slug: true },
    })
  } catch (error) {
    console.error("[createVehiculo]", error)
    return { ok: false, message: "Error al crear el vehículo. Verifica que la placa no esté duplicada." }
  }

  revalidateVehiculoCaches(vehiculo.slug, vehiculo.id)
  return { ok: true, message: "Vehículo creado exitosamente.", data: { id: vehiculo.id, slug: vehiculo.slug } }
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateVehiculo(
  id: string,
  input: VehiculoInput,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = vehiculoSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  const current = await prisma.vehiculo.findUnique({ where: { id }, select: { slug: true } })
  if (!current) return { ok: false, message: "Vehículo no encontrado." }

  try {
    await prisma.vehiculo.update({
      where: { id },
      data: {
        nombre: data.nombre,
        codigo: data.codigo ?? null,
        placa: data.placa,
        precio: data.precio,
        preciodescuento: data.preciodescuento ?? null,
        kilometraje: data.kilometraje,
        motor: data.motor ?? null,
        anio: data.anio,
        estadoId: data.estadoId,
        transmisionId: data.transmisionId,
        combustibleId: data.combustibleId,
        traccionId: data.traccionId,
        color_interior: data.color_interior ?? null,
        color_exterior: data.color_exterior ?? null,
        descripcion: data.descripcion ?? null,
        marcaId: data.marcaId,
        sucursalId: data.sucursalId,
        categoriaId: data.categoriaId,
        etiquetaComercialId: data.etiquetaComercialId ?? null,
      },
    })
  } catch (error) {
    console.error("[updateVehiculo]", error)
    return { ok: false, message: "Error al actualizar el vehículo. Verifica que la placa no esté duplicada." }
  }

  revalidateVehiculoCaches(current.slug, id)
  revalidatePath(`/catalogo/${current.slug}`)
  return { ok: true, message: "Vehículo actualizado exitosamente." }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteVehiculo(id: string): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({ where: { id }, select: { slug: true } })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  try {
    await prisma.vehiculo.delete({ where: { id } })
  } catch (error) {
    console.error("[deleteVehiculo]", error)
    return { ok: false, message: "Error al eliminar el vehículo." }
  }

  revalidateVehiculoCaches(vehiculo.slug, id)
  revalidatePath(`/catalogo/${vehiculo.slug}`)
  return { ok: true, message: "Vehículo eliminado." }
}

// ─── Galería ─────────────────────────────────────────────────────────────────

export async function addGaleriaImage(
  vehiculoId: string,
  url: string,
  orden: number,
): Promise<ActionResult<{ id: string; url: string; orden: number }>> {
  await requireAdmin()

  const parsed = galeriaImageSchema.safeParse({ url, orden })
  if (!parsed.success) {
    return {
      ok: false,
      message: "URL de imagen inválida.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  let created: { id: string; url: string; orden: number }
  try {
    created = await prisma.galeria.create({
      data: { vehiculoId, url: parsed.data.url, orden: parsed.data.orden },
      select: { id: true, url: true, orden: true },
    })
  } catch (error) {
    console.error("[addGaleriaImage]", error)
    return { ok: false, message: "Error al añadir la imagen. Verifica que el vehículo existe." }
  }

  updateTag(`admin-vehiculo-${vehiculoId}`)
  return { ok: true, message: "Imagen añadida.", data: created }
}

export async function removeGaleriaImage(
  galeriaId: string,
  vehiculoId: string,
): Promise<ActionResult> {
  await requireAdmin()

  try {
    await prisma.galeria.delete({ where: { id: galeriaId, vehiculoId } })
  } catch (error) {
    console.error("[removeGaleriaImage]", error)
    return { ok: false, message: "Imagen no encontrada o no pertenece a este vehículo." }
  }

  updateTag(`admin-vehiculo-${vehiculoId}`)
  return { ok: true, message: "Imagen eliminada." }
}

export async function reorderGaleriaImages(
  vehiculoId: string,
  images: { id: string; orden: number }[],
): Promise<ActionResult> {
  await requireAdmin()

  try {
    await prisma.$transaction(
      images.map((img) =>
        prisma.galeria.update({
          where: { id: img.id, vehiculoId },
          data: { orden: img.orden },
        }),
      ),
    )
  } catch (error) {
    console.error("[reorderGaleriaImages]", error)
    return { ok: false, message: "Error al reordenar las imágenes." }
  }

  updateTag(`admin-vehiculo-${vehiculoId}`)
  return { ok: true, message: "Galería reordenada." }
}
