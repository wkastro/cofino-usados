"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export async function toggleFavorite(
  vehiculoId: string,
): Promise<{ isFavorite: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  const existing = await prisma.favorito.findUnique({
    where: {
      userId_vehiculoId: {
        userId: session.user.id,
        vehiculoId,
      },
    },
  });

  if (existing) {
    await prisma.favorito.delete({ where: { id: existing.id } });
    return { isFavorite: false };
  }

  await prisma.favorito.create({
    data: {
      userId: session.user.id,
      vehiculoId,
    },
  });

  return { isFavorite: true };
}

export async function getFavoriteStatus(): Promise<{
  ids: string[];
  isAuthenticated: boolean;
}> {
  const session = await auth();
  if (!session?.user?.id) return { ids: [], isAuthenticated: false };

  const favoritos = await prisma.favorito.findMany({
    where: { userId: session.user.id },
    select: { vehiculoId: true },
  });

  return { ids: favoritos.map((f) => f.vehiculoId), isAuthenticated: true };
}

export async function getFavoriteVehiculos(): Promise<Vehiculo[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const favoritos = await prisma.favorito.findMany({
    where: { userId: session.user.id },
    select: {
      vehiculo: {
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
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favoritos.map(({ vehiculo }) => ({
    ...vehiculo,
    precio: Number(vehiculo.precio),
    preciosiniva: Number(vehiculo.preciosiniva),
    color_exterior: vehiculo.color_exterior ?? "",
    traccion: vehiculo.traccion as string,
    transmision: vehiculo.transmision as string,
    combustible: vehiculo.combustible as string,
  }));
}
