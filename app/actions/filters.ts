"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import type { Transmision } from "@/generated/prisma/client";

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

const TRANSMISSION_OPTIONS: Transmision[] = ["AUTOMATICO", "MANUAL"];

export async function getTransmissions() {
  return TRANSMISSION_OPTIONS.map((value) => ({
    id: value,
    nombre: value,
  }));
}

export type TransmissionsResult = Awaited<ReturnType<typeof getTransmissions>>;

export async function revalidateCategories() {
  revalidateTag("categories", "weeks");
}

export async function revalidateBrands() {
  revalidateTag("brands", "weeks");
}
