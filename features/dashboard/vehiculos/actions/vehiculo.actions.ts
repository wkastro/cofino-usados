"use server"

import { revalidateTag, revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { vehiculoSchema, galeriaImageSchema } from "../validations/vehiculo"
import { generateVehiculoSlug } from "../lib/slug"
import type { VehiculoInput } from "../validations/vehiculo"
import type { ActionResult } from "../types/vehiculo"
import { EstadoVenta } from "@/generated/prisma/client"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function revalidateVehiculoCaches(slug?: string, id?: string): void {
  revalidateTag("admin-vehiculos", "minutes")
  revalidateTag("vehicle-list", "hours")
  revalidateTag("home-recommendations", "hours")
  if (slug) revalidateTag(`vehicle-${slug}`, "hours")
  if (id) revalidateTag(`admin-vehiculo-${id}`, "minutes")
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

  const vehiculo = await prisma.vehiculo.create({
    data: {
      nombre: data.nombre,
      slug,
      codigo: data.codigo ?? null,
      placa: data.placa,
      precio: data.precio,
      preciosiniva: data.preciosiniva,
      kilometraje: data.kilometraje,
      motor: data.motor ?? null,
      anio: data.anio,
      estado: data.estado,
      transmision: data.transmision,
      combustible: data.combustible,
      traccion: data.traccion,
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

  revalidateVehiculoCaches(vehiculo.slug, vehiculo.id)

  return {
    ok: true,
    message: "Vehículo creado exitosamente.",
    data: { id: vehiculo.id, slug: vehiculo.slug },
  }
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

  const current = await prisma.vehiculo.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!current) return { ok: false, message: "Vehículo no encontrado." }

  await prisma.vehiculo.update({
    where: { id },
    data: {
      nombre: data.nombre,
      codigo: data.codigo ?? null,
      placa: data.placa,
      precio: data.precio,
      preciosiniva: data.preciosiniva,
      kilometraje: data.kilometraje,
      motor: data.motor ?? null,
      anio: data.anio,
      estado: data.estado,
      transmision: data.transmision,
      combustible: data.combustible,
      traccion: data.traccion,
      color_interior: data.color_interior ?? null,
      color_exterior: data.color_exterior ?? null,
      descripcion: data.descripcion ?? null,
      marcaId: data.marcaId,
      sucursalId: data.sucursalId,
      categoriaId: data.categoriaId,
      etiquetaComercialId: data.etiquetaComercialId ?? null,
    },
  })

  revalidateVehiculoCaches(current.slug, id)
  revalidatePath(`/catalogo/${current.slug}`)

  return { ok: true, message: "Vehículo actualizado exitosamente." }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteVehiculo(id: string): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  await prisma.vehiculo.delete({ where: { id } })

  revalidateVehiculoCaches(vehiculo.slug, id)
  revalidatePath(`/catalogo/${vehiculo.slug}`)

  return { ok: true, message: "Vehículo eliminado." }
}

// ─── Cambiar estado ───────────────────────────────────────────────────────────

export async function changeEstadoVehiculo(
  id: string,
  estado: EstadoVenta,
): Promise<ActionResult> {
  await requireAdmin()

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!vehiculo) return { ok: false, message: "Vehículo no encontrado." }

  await prisma.vehiculo.update({ where: { id }, data: { estado } })

  revalidateVehiculoCaches(vehiculo.slug, id)

  return { ok: true, message: `Estado cambiado a ${estado}.` }
}

// ─── Galería ─────────────────────────────────────────────────────────────────

export async function addGaleriaImage(
  vehiculoId: string,
  url: string,
  orden: number,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = galeriaImageSchema.safeParse({ url, orden })
  if (!parsed.success) {
    return {
      ok: false,
      message: "URL de imagen inválida.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  await prisma.galeria.create({
    data: { vehiculoId, url: parsed.data.url, orden: parsed.data.orden },
  })

  revalidateTag(`admin-vehiculo-${vehiculoId}`, "minutes")

  return { ok: true, message: "Imagen añadida." }
}

export async function removeGaleriaImage(
  galeriaId: string,
  vehiculoId: string,
): Promise<ActionResult> {
  await requireAdmin()

  await prisma.galeria.delete({ where: { id: galeriaId } })

  revalidateTag(`admin-vehiculo-${vehiculoId}`, "minutes")

  return { ok: true, message: "Imagen eliminada." }
}

export async function reorderGaleriaImages(
  vehiculoId: string,
  images: { id: string; orden: number }[],
): Promise<ActionResult> {
  await requireAdmin()

  await prisma.$transaction(
    images.map((img) =>
      prisma.galeria.update({
        where: { id: img.id },
        data: { orden: img.orden },
      }),
    ),
  )

  revalidateTag(`admin-vehiculo-${vehiculoId}`, "minutes")

  return { ok: true, message: "Galería reordenada." }
}
