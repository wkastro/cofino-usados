"use server";

import { prisma } from "@/lib/prisma";
import { EstadoVenta } from "@/generated/prisma/client";
import { VehicleResponse } from "@/types/vehiculo/vehiculo";

const PAGE_SIZE = 12;

export async function getVehiculos(page = 1): Promise<VehicleResponse> {
  const [vehiculos, total] = await prisma.$transaction([
    prisma.vehiculo.findMany({
      where: { estado: EstadoVenta.DISPONIBLE },
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

    prisma.vehiculo.count({ where: { estado: EstadoVenta.DISPONIBLE } }),
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
