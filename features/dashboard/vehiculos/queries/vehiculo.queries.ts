import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { VehiculoRow, VehiculosAdminResponse, VehiculoAdmin } from "../types/vehiculo"

const PAGE_SIZE = 20

export async function getCachedVehiculosAdmin(
  page = 1,
  search = "",
  estado?: string,
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
    ...(estado && { estado: estado as never }),
  }

  const clampedPage = Math.max(1, page)

  const [rawVehiculos, total] = await prisma.$transaction([
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
        estado: true,
        transmision: true,
        combustible: true,
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
  ])

  const vehiculos: VehiculoRow[] = rawVehiculos.map((v) => ({
    id: v.id,
    nombre: v.nombre,
    slug: v.slug,
    placa: v.placa,
    codigo: v.codigo,
    precio: Number(v.precio),
    kilometraje: v.kilometraje,
    anio: v.anio,
    estado: v.estado,
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
      estado: true,
      transmision: true,
      combustible: true,
      traccion: true,
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
    precio: Number(v.precio),
    preciodescuento: v.preciodescuento != null ? Number(v.preciodescuento) : null,
  }
}
