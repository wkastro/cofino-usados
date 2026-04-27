"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import type { VehicleResponse, VehicleDetail } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";
import { buildFilterWhere, NOT_FACTURADO } from "@/lib/filters/build-vehicle-where";

const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 50;

export async function getVehiculos(
  page = 1,
  filters: VehicleFilters = {},
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<VehicleResponse> {
  const clampedPageSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
  const clampedPage = Math.max(1, page);

  const where = buildFilterWhere(filters);

  const [vehiculos, total] = await prisma.$transaction([
    prisma.vehiculo.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        slug: true,
        precio: true,
        preciodescuento: true,
        kilometraje: true,
        motor: true,
        anio: true,
        traccion: { select: { nombre: true } },
        transmision: { select: { nombre: true } },
        combustible: { select: { nombre: true } },
        color_exterior: true,
        marca: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        portada: true,
        etiquetaComercial: {
          select: { nombre: true, slug: true },
        },
        galeria: {
          select: { id: true, url: true, orden: true },
          orderBy: { orden: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (clampedPage - 1) * clampedPageSize,
      take: clampedPageSize,
    }),

    prisma.vehiculo.count({ where }),
  ]);

  const formattedVehicles = vehiculos.map((vehicle) => ({
    ...vehicle,
    precio: Number(vehicle.precio),
    preciodescuento: vehicle.preciodescuento != null ? Number(vehicle.preciodescuento) : null,
    color_exterior: vehicle.color_exterior ?? "",
    traccion: vehicle.traccion.nombre,
    transmision: vehicle.transmision.nombre,
    combustible: vehicle.combustible.nombre,
  }));

  return {
    vehiculos: formattedVehicles,
    total,
    pages: Math.ceil(total / clampedPageSize),
    page: clampedPage,
  };
}

export async function getVehicleBySlug(
  slug: string,
): Promise<VehicleDetail | null> {
  const vehicle = await prisma.vehiculo.findFirst({
    where: { slug, ...NOT_FACTURADO },
    select: {
      id: true,
      nombre: true,
      slug: true,
      precio: true,
      preciodescuento: true,
      kilometraje: true,
      motor: true,
      anio: true,
      traccion: { select: { nombre: true } },
      transmision: { select: { nombre: true } },
      combustible: { select: { nombre: true } },
      color_exterior: true,
      color_interior: true,
      descripcion: true,
      marca: { select: { id: true, nombre: true } },
      categoria: { select: { id: true, nombre: true } },
      sucursal: { select: { id: true, nombre: true } },
      portada: true,
      etiquetaComercial: {
        select: { nombre: true, slug: true },
      },
      galeria: {
        select: { id: true, url: true, orden: true },
        orderBy: { orden: "asc" },
      },
    },
  });

  if (!vehicle) return null;

  return {
    ...vehicle,
    precio: Number(vehicle.precio),
    preciodescuento: vehicle.preciodescuento != null ? Number(vehicle.preciodescuento) : null,
    color_exterior: vehicle.color_exterior ?? "",
    color_interior: vehicle.color_interior ?? "",
    descripcion: vehicle.descripcion ?? null,
    traccion: vehicle.traccion.nombre,
    transmision: vehicle.transmision.nombre,
    combustible: vehicle.combustible.nombre,
  };
}

export async function revalidateVehicle(slug: string) {
  revalidateTag(`vehicle-${slug}`, "days");
}

export async function revalidateVehicleList() {
  revalidateTag("vehicle-list", "hours");
  revalidateTag("home-recommendations", "hours");
}
