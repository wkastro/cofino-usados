"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

export async function toggleFavorite(
  vehiculoId: string,
): Promise<{ isFavorite: boolean }> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "USER") {
    throw new Error("No autenticado");
  }

  const userId = session.user.id;

  // Atomic transaction to prevent race conditions
  return prisma.$transaction(async (tx) => {
    const existing = await tx.favorito.findUnique({
      where: { userId_vehiculoId: { userId, vehiculoId } },
    });

    if (existing) {
      await tx.favorito.delete({ where: { id: existing.id } });
      return { isFavorite: false };
    }

    await tx.favorito.create({ data: { userId, vehiculoId } });
    return { isFavorite: true };
  });
}

export async function getFavoriteStatus(): Promise<{
  ids: string[];
  isAuthenticated: boolean;
}> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "USER") return { ids: [], isAuthenticated: false };

  const favoritos = await prisma.favorito.findMany({
    where: { userId: session.user.id },
    select: { vehiculoId: true },
  });

  return { ids: favoritos.map((f) => f.vehiculoId), isAuthenticated: true };
}

export async function getFavoriteVehiculos(): Promise<Vehiculo[]> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "USER") return [];

  const favoritos = await prisma.favorito.findMany({
    where: {
      userId: session.user.id,
      vehiculo: { estadoVenta: { slug: { not: "facturado" } } },
    },
    select: {
      vehiculo: {
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
          etiquetaComercial: {
            select: { nombre: true, slug: true },
          },
          galeria: {
            select: { id: true, url: true, orden: true },
            orderBy: { orden: "asc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favoritos.map(({ vehiculo }) => ({
    ...vehiculo,
    precio: Number(vehiculo.precio),
    preciodescuento: vehiculo.preciodescuento != null ? Number(vehiculo.preciodescuento) : null,
    color_exterior: vehiculo.color_exterior ?? "",
    traccion: vehiculo.traccion.nombre,
    transmision: vehiculo.transmision.nombre,
    combustible: vehiculo.combustible.nombre,
  }));
}
