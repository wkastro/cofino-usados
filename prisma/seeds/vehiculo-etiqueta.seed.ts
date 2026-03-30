import {
  Combustible,
  EstadoVenta,
  PrismaClient,
  Traccion,
} from "../../generated/prisma/client";

const TAG_SLUGS = [
  "nuevo-ingreso",
  "liquidacion",
  "autos-certificados",
  "consignacion",
  "baja-de-precio",
] as const;

type TagSlug = (typeof TAG_SLUGS)[number];

function resolveTagsForVehicle(vehicle: {
  estado: EstadoVenta;
  anio: number;
  precio: unknown;
  kilometraje: number;
  combustible: Combustible;
  traccion: Traccion;
}): TagSlug[] {
  const tags = new Set<TagSlug>();
  const price = Number(vehicle.precio);

  if (vehicle.anio >= 2023 || vehicle.kilometraje <= 30000) {
    tags.add("nuevo-ingreso");
  }

  if (vehicle.anio >= 2021 && vehicle.estado === EstadoVenta.DISPONIBLE) {
    tags.add("autos-certificados");
  }

  if (price <= 150000 || vehicle.anio <= 2019) {
    tags.add("baja-de-precio");
  }

  if (
    vehicle.combustible === Combustible.DIESEL ||
    vehicle.traccion === Traccion.T4X4 ||
    vehicle.traccion === Traccion.AWD ||
    vehicle.traccion === Traccion.T4WD
  ) {
    tags.add("consignacion");
  }

  if (vehicle.estado !== EstadoVenta.DISPONIBLE || vehicle.anio <= 2018) {
    tags.add("liquidacion");
  }

  if (tags.size === 0) {
    tags.add("nuevo-ingreso");
  }

  return [...tags];
}

export async function seedVehiculoEtiquetas(prisma: PrismaClient) {
  const etiquetas = await prisma.etiquetaComercial.findMany({
    where: { slug: { in: [...TAG_SLUGS] } },
    select: { id: true, slug: true },
  });

  const tagIdBySlug = new Map(etiquetas.map((tag) => [tag.slug as TagSlug, tag.id]));

  const missingSlugs = TAG_SLUGS.filter((slug) => !tagIdBySlug.has(slug));
  if (missingSlugs.length > 0) {
    throw new Error(
      `[vehiculo-etiquetas] Faltan etiquetas en DB: ${missingSlugs.join(", ")}. Ejecuta el seed de etiquetas primero.`,
    );
  }

  const vehicles = await prisma.vehiculo.findMany({
    select: {
      id: true,
      estado: true,
      anio: true,
      precio: true,
      kilometraje: true,
      combustible: true,
      traccion: true,
      etiquetas: { select: { etiquetaId: true } },
    },
  });

  let created = 0;
  let removed = 0;
  let unchanged = 0;

  for (const vehicle of vehicles) {
    const desiredSlugs = resolveTagsForVehicle(vehicle);
    const desiredTagIds = new Set(desiredSlugs.map((slug) => tagIdBySlug.get(slug)!));
    const currentTagIds = new Set(vehicle.etiquetas.map((entry) => entry.etiquetaId));

    const toCreate = [...desiredTagIds].filter((id) => !currentTagIds.has(id));
    const toDelete = [...currentTagIds].filter((id) => !desiredTagIds.has(id));

    if (toCreate.length === 0 && toDelete.length === 0) {
      unchanged++;
      continue;
    }

    if (toCreate.length > 0) {
      await prisma.vehiculoEtiquetaComercial.createMany({
        data: toCreate.map((etiquetaId) => ({
          vehiculoId: vehicle.id,
          etiquetaId,
        })),
        skipDuplicates: true,
      });
      created += toCreate.length;
    }

    if (toDelete.length > 0) {
      await prisma.vehiculoEtiquetaComercial.deleteMany({
        where: {
          vehiculoId: vehicle.id,
          etiquetaId: { in: toDelete },
        },
      });
      removed += toDelete.length;
    }
  }

  console.log(
    `  [vehiculo-etiquetas] Creadas: ${created} | Eliminadas: ${removed} | Sin cambios: ${unchanged}`,
  );
}
