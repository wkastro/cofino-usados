"use server";

import { prisma } from "@/lib/prisma";
import type { Transmision } from "@/generated/prisma/client";

export async function getCategorias() {
  return prisma.categoria.findMany({
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
}

export type CategoriasResult = Awaited<ReturnType<typeof getCategorias>>;

export async function getMarcas() {
  return prisma.marca.findMany({
    where: { estado: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
}

export type MarcasResult = Awaited<ReturnType<typeof getMarcas>>;

const transmisionValues: Transmision[] = ["AUTOMATICO", "MANUAL"];

export async function getTransmisiones() {
  return transmisionValues.map((value) => ({
    id: value,
    nombre: value,
  }));
}

export type TransmisionesResult = Awaited<ReturnType<typeof getTransmisiones>>;
