"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { EstadoVenta } from "@/generated/prisma/client";
import type { Transmision } from "@/generated/prisma/client";
import type { VehicleResponse, VehicleDetail } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

const PAGE_SIZE = 6;

export async function getVehiculos(
  page = 1,
  filters: VehicleFilters = {},
): Promise<VehicleResponse> {
  const where = {
    estado: EstadoVenta.DISPONIBLE,
    ...(filters.marca && { marca: { slug: filters.marca } }),
    ...(filters.categoria && { categoria: { slug: filters.categoria } }),
    ...(filters.transmision && { transmision: filters.transmision as Transmision }),
  };

  const [vehiculos, total] = await prisma.$transaction([
    prisma.vehiculo.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        slug: true,
        precio: true,
        preciosiniva: true,
        kilometraje: true,
        motor: true,
        anio: true,
        traccion: true,
        transmision: true,
        combustible: true,
        color_exterior: true,
        marca: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        etiquetas: {
          select: { etiqueta: { select: { nombre: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.vehiculo.count({ where }),
  ]);

  const formattedVehicles = vehiculos.map((vehicle) => ({
    ...vehicle,
    precio: Number(vehicle.precio),
    preciosiniva: Number(vehicle.preciosiniva),
    color_exterior: vehicle.color_exterior ?? "",
    traccion: vehicle.traccion as string,
    transmision: vehicle.transmision as string,
    combustible: vehicle.combustible as string,
  }));

  return {
    vehiculos: formattedVehicles,
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  };
}

export async function getVehicleBySlug(
  slug: string,
): Promise<VehicleDetail | null> {
  const vehicle = await prisma.vehiculo.findUnique({
    where: { slug },
    select: {
      id: true,
      nombre: true,
      slug: true,
      precio: true,
      preciosiniva: true,
      kilometraje: true,
      motor: true,
      anio: true,
      traccion: true,
      transmision: true,
      combustible: true,
      color_exterior: true,
      color_interior: true,
      descripcion: true,
      marca: { select: { id: true, nombre: true } },
      categoria: { select: { id: true, nombre: true } },
      sucursal: { select: { id: true, nombre: true } },
      etiquetas: {
        select: { etiqueta: { select: { nombre: true, slug: true } } },
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
    preciosiniva: Number(vehicle.preciosiniva),
    color_exterior: vehicle.color_exterior ?? "",
    color_interior: vehicle.color_interior ?? "",
    descripcion: vehicle.descripcion ?? null,
    traccion: vehicle.traccion as string,
    transmision: vehicle.transmision as string,
    combustible: vehicle.combustible as string,
  };
}

export async function revalidateVehicle(slug: string) {
  revalidateTag(`vehicle-${slug}`, "days");
}

export async function revalidateVehicleList() {
  revalidateTag("vehicle-list", "hours");
}
