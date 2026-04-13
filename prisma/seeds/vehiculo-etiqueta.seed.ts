import { PrismaClient } from "../../generated/prisma/client";

const TAG_SLUGS = [
  "nuevo-ingreso",
  "liquidacion",
  "autos-certificados",
  "consignacion",
  "baja-de-precio",
] as const;

const PROXIMAMENTE_SLUG = "proximamente";
const PROXIMAMENTE_COUNT = 6;

export async function seedVehiculoEtiquetas(prisma: PrismaClient) {
  const allSlugs = [...TAG_SLUGS, PROXIMAMENTE_SLUG];

  const etiquetas = await prisma.etiquetaComercial.findMany({
    where: { slug: { in: allSlugs } },
    select: { id: true, slug: true },
  });

  const missingSlugs = allSlugs.filter(
    (slug) => !etiquetas.some((e) => e.slug === slug),
  );
  if (missingSlugs.length > 0) {
    throw new Error(
      `[vehiculo-etiquetas] Faltan etiquetas en DB: ${missingSlugs.join(", ")}. Ejecuta el seed de etiquetas primero.`,
    );
  }

  const getTagId = (slug: string) => etiquetas.find((e) => e.slug === slug)!.id;

  const proximamenteId = getTagId(PROXIMAMENTE_SLUG);
  const tagIds = TAG_SLUGS.map(getTagId);

  const vehicles = await prisma.vehiculo.findMany({
    select: { id: true, etiquetaComercialId: true },
  });

  // Mezclar aleatoriamente para distribución uniforme
  const shuffled = [...vehicles].sort(() => Math.random() - 0.5);

  // Los primeros PROXIMAMENTE_COUNT vehículos reciben la etiqueta "proximamente"
  const proximamenteVehicles = shuffled.slice(0, PROXIMAMENTE_COUNT);
  // El resto se distribuye round-robin entre las 5 etiquetas originales
  const remainingVehicles = shuffled.slice(PROXIMAMENTE_COUNT);

  let updated = 0;
  let unchanged = 0;

  for (const vehicle of proximamenteVehicles) {
    if (vehicle.etiquetaComercialId === proximamenteId) {
      unchanged++;
      continue;
    }
    await prisma.vehiculo.update({
      where: { id: vehicle.id },
      data: { etiquetaComercialId: proximamenteId },
    });
    updated++;
  }

  for (let i = 0; i < remainingVehicles.length; i++) {
    const desiredTagId = tagIds[i % tagIds.length];
    if (remainingVehicles[i].etiquetaComercialId === desiredTagId) {
      unchanged++;
      continue;
    }
    await prisma.vehiculo.update({
      where: { id: remainingVehicles[i].id },
      data: { etiquetaComercialId: desiredTagId },
    });
    updated++;
  }

  console.log(
    `  [vehiculo-etiquetas] Actualizadas: ${updated} | Sin cambios: ${unchanged}`,
  );
}
