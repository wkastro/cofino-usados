"use server"

import { revalidatePath } from "next/cache"
import { updateTag } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { vehiculoSchema, galeriaImageSchema } from "../validations/vehiculo"
import { generateVehiculoSlug } from "../lib/slug"
import type { VehiculoInput } from "../validations/vehiculo"
import type { ActionResult } from "../types/vehiculo"
import { deleteS3Object } from "@/features/s3/delete"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function revalidateVehiculoCaches(slug?: string, id?: string): void {
  updateTag("admin-vehiculos")
  updateTag("vehicle-list")
  updateTag("home-recommendations")
  if (slug) updateTag(`vehicle-${slug}`)
  if (id) updateTag(`admin-vehiculo-${id}`)
}

// ─── Check Placa ─────────────────────────────────────────────────────────────

export async function checkPlacaDisponible(
  placa: string,
  excludeId?: string,
): Promise<{ disponible: boolean }> {
  await requireAdmin()
  const existing = await prisma.vehiculo.findFirst({
    where: { placa, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  })
  return { disponible: !existing }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createVehiculo(
  input: VehiculoInput,
  galeria?: { portada?: string | null; images?: { url: string; orden: number }[] },
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

  const [marca, placaExistente] = await Promise.all([
    prisma.marca.findUnique({ where: { id: data.marcaId }, select: { nombre: true } }),
    prisma.vehiculo.findUnique({ where: { placa: data.placa }, select: { id: true } }),
  ])
  if (!marca) return { ok: false, message: "La marca seleccionada no existe." }
  if (placaExistente) {
    return {
      ok: false,
      message: "La placa ingresada ya está registrada.",
      fieldErrors: { placa: ["Esta placa ya está registrada en el sistema."] },
    }
  }

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
        motor: data.motor,
        anio: data.anio,
        estadoId: data.estadoId,
        transmisionId: data.transmisionId,
        combustibleId: data.combustibleId,
        traccionId: data.traccionId,
        color_interior: data.color_interior,
        color_exterior: data.color_exterior,
        descripcion: data.descripcion,
        marcaId: data.marcaId,
        sucursalId: data.sucursalId,
        categoriaId: data.categoriaId,
        etiquetaComercialId: data.etiquetaComercialId ?? null,
        portada: galeria?.portada ?? null,
        galeria: galeria?.images?.length
          ? { create: galeria.images.map((img) => ({ url: img.url, orden: img.orden })) }
          : undefined,
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

  const [current, placaExistente] = await Promise.all([
    prisma.vehiculo.findUnique({ where: { id }, select: { slug: true } }),
    prisma.vehiculo.findFirst({ where: { placa: data.placa, NOT: { id } }, select: { id: true } }),
  ])
  if (!current) return { ok: false, message: "Vehículo no encontrado." }
  if (placaExistente) {
    return {
      ok: false,
      message: "La placa ingresada ya está registrada.",
      fieldErrors: { placa: ["Esta placa ya está registrada en el sistema."] },
    }
  }

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
        motor: data.motor,
        anio: data.anio,
        estadoId: data.estadoId,
        transmisionId: data.transmisionId,
        combustibleId: data.combustibleId,
        traccionId: data.traccionId,
        color_interior: data.color_interior,
        color_exterior: data.color_exterior,
        descripcion: data.descripcion,
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

// ─── Update Estado ───────────────────────────────────────────────────────────

export async function updateVehiculoEstado(
  id: string,
  estadoId: string,
): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({ where: { id }, select: { slug: true } })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  try {
    await prisma.vehiculo.update({ where: { id }, data: { estadoId } })
  } catch (error) {
    console.error("[updateVehiculoEstado]", error)
    return { ok: false, message: "Error al actualizar el estado." }
  }

  revalidateVehiculoCaches(vehiculo.slug, id)
  return { ok: true, message: "Estado actualizado." }
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

// ─── Portada ─────────────────────────────────────────────────────────────────

export async function updateVehiculoPortada(
  vehiculoId: string,
  url: string | null,
): Promise<ActionResult> {
  await requireAdmin()

  let slug: string | undefined
  try {
    const vehiculo = await prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: { portada: url },
      select: { slug: true },
    })
    slug = vehiculo.slug
  } catch (error) {
    console.error("[updateVehiculoPortada]", error)
    return { ok: false, message: "Error al actualizar la portada." }
  }

  revalidateVehiculoCaches(slug, vehiculoId)
  return { ok: true, message: url ? "Portada actualizada." : "Portada eliminada." }
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

  let imageUrl: string | undefined

  try {
    const image = await prisma.galeria.findUnique({ where: { id: galeriaId, vehiculoId } })
    if (!image) return { ok: false, message: "Imagen no encontrada o no pertenece a este vehículo." }
    imageUrl = image.url
    await prisma.galeria.delete({ where: { id: galeriaId } })
  } catch (error) {
    console.error("[removeGaleriaImage]", error)
    return { ok: false, message: "Imagen no encontrada o no pertenece a este vehículo." }
  }

  if (imageUrl) {
    await deleteS3Object(imageUrl)
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
