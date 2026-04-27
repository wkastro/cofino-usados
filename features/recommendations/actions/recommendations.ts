"use server";

import { prisma } from "@/lib/prisma";
import { getVehicleBySlug } from "@/app/actions/vehiculo";
import { buildFilterWhere, NOT_FACTURADO } from "@/lib/filters/build-vehicle-where";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

const HOME_LIMIT = 6;
const SIMILAR_LIMIT = 3;
const MAX_PER_BRAND = 2;
const PRICE_DELTA = 0.20;

/**
 * Select compartido para recomendaciones.
 * Coincide con el select de `getVehiculos` para mantener compatibilidad
 * con el componente `VehicleCard`.
 */
const RECOMMENDATION_SELECT = {
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
    orderBy: { orden: "asc" as const },
    take: 1,
  },
} as const;

type PrismaVehicleRow = {
  id: string;
  nombre: string;
  slug: string;
  precio: { toString(): string } | number;
  preciodescuento: { toString(): string } | number | null;
  kilometraje: number;
  motor: string | null;
  anio: number;
  traccion: { nombre: string };
  transmision: { nombre: string };
  combustible: { nombre: string };
  color_exterior: string | null;
  portada: string | null;
  marca: { id: string; nombre: string };
  categoria: { id: string; nombre: string };
  sucursal: { id: string; nombre: string };
  etiquetaComercial: { nombre: string; slug: string } | null;
  galeria: { id: string; url: string; orden: number }[];
};

function formatVehicle(row: PrismaVehicleRow): Vehiculo {
  return {
    ...row,
    precio: Number(row.precio),
    preciodescuento: row.preciodescuento != null ? Number(row.preciodescuento) : null,
    color_exterior: row.color_exterior ?? "",
    traccion: row.traccion.nombre,
    transmision: row.transmision.nombre,
    combustible: row.combustible.nombre,
  };
}

/**
 * Aplica diversidad por marca: máximo 2 vehículos por marca.
 * Respeta el contador externo `marcaCount` (mutado in-place) para que
 * fases sucesivas (query de destacados + fallback) compartan estado.
 */
function pickWithBrandDiversity(
  rows: Vehiculo[],
  limit: number,
  marcaCount: Record<string, number>,
  alreadyPicked: Vehiculo[] = [],
  perBrandCap: number = MAX_PER_BRAND,
): Vehiculo[] {
  const result = [...alreadyPicked];
  for (const row of rows) {
    if (result.length >= limit) break;
    const brandId = row.marca.id;
    const count = marcaCount[brandId] ?? 0;
    if (count >= perBrandCap) continue;
    result.push(row);
    marcaCount[brandId] = count + 1;
  }
  return result;
}

export async function getHomeRecommendations(
  filters: VehicleFilters = {},
): Promise<Vehiculo[]> {
  const filterWhere = buildFilterWhere(filters);
  // Cuando el usuario filtra explícitamente por marca, no tiene sentido
  // aplicar el cap de diversidad — quiere ver todos los resultados de esa marca.
  const enforceBrandDiversity = !filters.marca;
  const perBrandCap = enforceBrandDiversity ? MAX_PER_BRAND : Number.POSITIVE_INFINITY;

  // Paso 1: vehículos con etiqueta comercial + filtros del usuario, recientes primero.
  const destacadosRaw = await prisma.vehiculo.findMany({
    where: { ...filterWhere, etiquetaComercialId: { not: null } },
    select: RECOMMENDATION_SELECT,
    orderBy: { createdAt: "desc" },
  });
  const destacados = (destacadosRaw as unknown as PrismaVehicleRow[]).map(formatVehicle);

  // Paso 2: aplicar diversidad por marca (o cap relajado si el filtro lo desactiva).
  const marcaCount: Record<string, number> = {};
  let picked = pickWithBrandDiversity(destacados, HOME_LIMIT, marcaCount, [], perBrandCap);

  if (picked.length >= HOME_LIMIT) return picked;

  // Paso 3: fallback con recientes (manteniendo filtros), excluyendo ya seleccionados.
  const excludedIds = picked.map((v) => v.id);
  const recientesRaw = await prisma.vehiculo.findMany({
    where: {
      ...filterWhere,
      ...(excludedIds.length > 0 ? { id: { notIn: excludedIds } } : {}),
    },
    select: RECOMMENDATION_SELECT,
    orderBy: { createdAt: "desc" },
  });
  const recientes = (recientesRaw as unknown as PrismaVehicleRow[]).map(formatVehicle);

  picked = pickWithBrandDiversity(recientes, HOME_LIMIT, marcaCount, picked, perBrandCap);

  if (picked.length >= HOME_LIMIT) return picked;

  // Paso 4: relajar diversidad y completar con los más recientes restantes.
  const pickedIds = new Set(picked.map((v) => v.id));
  for (const v of recientes) {
    if (picked.length >= HOME_LIMIT) break;
    if (pickedIds.has(v.id)) continue;
    picked.push(v);
    pickedIds.add(v.id);
  }

  return picked;
}

export async function getSimilarVehicles(slug: string): Promise<Vehiculo[]> {
  const current = await getVehicleBySlug(slug);
  if (!current) return [];

  const currentId = current.id;
  const categoriaId = current.categoria.id;
  const marcaId = current.marca.id;
  const precio = current.precio;
  const minPrecio = precio * (1 - PRICE_DELTA);
  const maxPrecio = precio * (1 + PRICE_DELTA);

  const collected: Vehiculo[] = [];
  const collectedIds = new Set<string>([currentId]);

  async function runQuery(
    where: Record<string, unknown>,
    orderBy: Record<string, unknown>,
  ): Promise<void> {
    if (collected.length >= SIMILAR_LIMIT) return;
    const remaining = SIMILAR_LIMIT - collected.length;
    const rows = await prisma.vehiculo.findMany({
      where: {
        ...NOT_FACTURADO,
        ...where,
        id: { notIn: Array.from(collectedIds) },
      },
      select: RECOMMENDATION_SELECT,
      orderBy,
      take: remaining,
    });
    for (const row of rows) {
      const formatted = formatVehicle(row as unknown as PrismaVehicleRow);
      collected.push(formatted);
      collectedIds.add(formatted.id);
    }
  }

  // Nivel 1: categoría + marca + precio ±20%
  await runQuery(
    {
      categoriaId,
      marcaId,
      precio: { gte: minPrecio, lte: maxPrecio },
    },
    { precio: "asc" },
  );

  // Nivel 2: categoría + marca (precio libre)
  if (collected.length < SIMILAR_LIMIT) {
    await runQuery({ categoriaId, marcaId }, { precio: "asc" });
  }

  // Nivel 3: categoría (marca libre)
  if (collected.length < SIMILAR_LIMIT) {
    await runQuery({ categoriaId }, { precio: "asc" });
  }

  // Nivel 4: fallback global — cualquier vehículo, más recientes primero
  if (collected.length < SIMILAR_LIMIT) {
    await runQuery({}, { createdAt: "desc" });
  }

  return collected;
}
