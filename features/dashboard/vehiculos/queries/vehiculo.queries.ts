import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { VehiculoRow, VehiculosAdminResponse, VehiculoAdmin } from "../types/vehiculo"
import { getCachedEstadosOptions } from "./relations.queries"

const PAGE_SIZE = 20

export async function getCachedVehiculosAdmin(
  page = 1,
  search = "",
  estadoSlug?: string,
): Promise<VehiculosAdminResponse> {
  "use cache"
  cacheLife("minutes")
  cacheTag("admin-vehiculos")

  const where = {
    ...(search.trim() && {
      OR: [
        { nombre: { contains: search.trim() } },
        { placa: { contains: search.trim() } },
        { codigo: { contains: search.trim() } },
      ],
    }),
    ...(estadoSlug && {
      estadoVenta: { slug: estadoSlug },
    }),
  }

  const clampedPage = Math.max(1, page)

  const [rawVehiculos, total, estadoOptions] = await Promise.all([
    prisma.vehiculo.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        slug: true,
        placa: true,
        codigo: true,
        precio: true,
        kilometraje: true,
        anio: true,
        estadoVenta: { select: { id: true, nombre: true, slug: true } },
        transmision: { select: { id: true, nombre: true, slug: true } },
        combustible: { select: { id: true, nombre: true, slug: true } },
        createdAt: true,
        marca: { select: { nombre: true } },
        categoria: { select: { nombre: true } },
        sucursal: { select: { nombre: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (clampedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.vehiculo.count({ where }),
    getCachedEstadosOptions(),
  ])

  const vehiculos: VehiculoRow[] = rawVehiculos.map((v) => ({
    id: v.id,
    nombre: v.nombre,
    slug: v.slug,
    placa: v.placa,
    codigo: v.codigo,
    precio: parseFloat(v.precio.toString()),
    kilometraje: v.kilometraje,
    anio: v.anio,
    estadoVenta: v.estadoVenta,
    transmision: v.transmision,
    combustible: v.combustible,
    marca: v.marca.nombre,
    categoria: v.categoria.nombre,
    sucursal: v.sucursal.nombre,
    createdAt: v.createdAt,
  }))

  return {
    vehiculos,
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page: clampedPage,
    estadoOptions,
  }
}

export async function getCachedVehiculoAdminById(id: string): Promise<VehiculoAdmin | null> {
  "use cache"
  cacheLife("minutes")
  cacheTag(`admin-vehiculo-${id}`)

  const v = await prisma.vehiculo.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      slug: true,
      codigo: true,
      placa: true,
      precio: true,
      preciodescuento: true,
      kilometraje: true,
      motor: true,
      anio: true,
      estadoId: true,
      transmisionId: true,
      combustibleId: true,
      traccionId: true,
      color_interior: true,
      color_exterior: true,
      descripcion: true,
      marcaId: true,
      sucursalId: true,
      categoriaId: true,
      etiquetaComercialId: true,
      createdAt: true,
      updatedAt: true,
      galeria: {
        select: { id: true, url: true, orden: true },
        orderBy: { orden: "asc" },
      },
    },
  })

  if (!v) return null

  return {
    ...v,
    precio: parseFloat(v.precio.toString()),
    preciodescuento: v.preciodescuento != null ? parseFloat(v.preciodescuento.toString()) : null,
  }
}
