"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function getCategories() {
  return prisma.categoria.findMany({
    select: { id: true, nombre: true, slug: true },
    orderBy: { nombre: "asc" },
  });
}

export type CategoriesResult = Awaited<ReturnType<typeof getCategories>>;

export async function getBrands() {
  return prisma.marca.findMany({
    where: { estado: true },
    select: { id: true, nombre: true, slug: true },
    orderBy: { nombre: "asc" },
  });
}

export type BrandsResult = Awaited<ReturnType<typeof getBrands>>;

export async function getTransmissions() {
  return prisma.transmision.findMany({
    where: { estado: true },
    select: { id: true, nombre: true, slug: true },
    orderBy: { nombre: "asc" },
  });
}

export type TransmissionsResult = Awaited<ReturnType<typeof getTransmissions>>;

export async function getEtiquetas() {
  return prisma.etiquetaComercial.findMany({
    where: { estado: true },
    select: { id: true, nombre: true, slug: true },
    orderBy: { nombre: "asc" },
  });
}

export type EtiquetasResult = Awaited<ReturnType<typeof getEtiquetas>>;

export async function getPriceRange() {
  const result = await prisma.vehiculo.aggregate({
    where: { estadoVenta: { slug: { not: "facturado" } } },
    _min: { precio: true },
    _max: { precio: true },
  });

  return {
    min: Number(result._min?.precio ?? 0),
    max: Number(result._max?.precio ?? 0),
  };
}

export type PriceRangeResult = Awaited<ReturnType<typeof getPriceRange>>;

export async function getMinYear() {
  const result = await prisma.vehiculo.aggregate({
    where: { estadoVenta: { slug: { not: "facturado" } } },
    _min: { anio: true },
  });

  return result._min?.anio ?? new Date().getFullYear();
}

export type MinYearResult = Awaited<ReturnType<typeof getMinYear>>;

export async function getKilometrajeRange() {
  const result = await prisma.vehiculo.aggregate({
    where: { estadoVenta: { slug: { not: "facturado" } } },
    _min: { kilometraje: true },
    _max: { kilometraje: true },
  });

  return {
    min: result._min?.kilometraje ?? 0,
    max: result._max?.kilometraje ?? 0,
  };
}

export type KilometrajeRangeResult = Awaited<ReturnType<typeof getKilometrajeRange>>;

export async function revalidateCategories() {
  revalidateTag("categories", "weeks");
}

export async function revalidateBrands() {
  revalidateTag("brands", "weeks");
}
