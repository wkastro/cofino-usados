"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { EstadoVenta, Transmision, Combustible } from "@/generated/prisma/client";
import type { VehicleResponse, VehicleDetail } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

const TRANSMISION_MAP: Record<string, Transmision> = {
  automatico: Transmision.Automatico,
  manual: Transmision.Manual,
};

const COMBUSTIBLE_MAP: Record<string, Combustible> = {
  gasolina: Combustible.Gasolina,
  diesel: Combustible.Diesel,
  hibrido: Combustible.Hibrido,
  electrico: Combustible.Electrico,
};

const PAGE_SIZE = 6;

export async function getVehiculos(
  page = 1,
  filters: VehicleFilters = {},
): Promise<VehicleResponse> {
  const transmision = filters.transmision ? TRANSMISION_MAP[filters.transmision] : undefined;
  const combustible = filters.combustible ? COMBUSTIBLE_MAP[filters.combustible] : undefined;

  const where = {
    estado: EstadoVenta.Disponible,
    ...(filters.marca && { marca: { slug: filters.marca } }),
    ...(filters.categoria && { categoria: { slug: filters.categoria } }),
    ...(transmision && { transmision }),
    ...(filters.etiqueta && {
      etiquetaComercial: { slug: filters.etiqueta },
    }),
    ...(combustible && { combustible }),
    ...(filters.anio != null && { anio: { gte: filters.anio } }),
    ...((filters.precioMin != null || filters.precioMax != null) && {
      precio: {
        ...(filters.precioMin != null && { gte: filters.precioMin }),
        ...(filters.precioMax != null && { lte: filters.precioMax }),
      },
    }),
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
        etiquetaComercial: {
          select: { nombre: true, slug: true },
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
