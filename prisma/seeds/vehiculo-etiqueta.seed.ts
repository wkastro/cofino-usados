import { PrismaClient } from "../../generated/prisma/client";

const TAG_SLUGS = [
  "nuevo-ingreso",
  "liquidacion",
  "autos-certificados",
  "consignacion",
  "baja-de-precio",
] as const;

export async function seedVehiculoEtiquetas(prisma: PrismaClient) {
  const etiquetas = await prisma.etiquetaComercial.findMany({
    where: { slug: { in: [...TAG_SLUGS] } },
    select: { id: true, slug: true },
  });

  const missingSlugs = TAG_SLUGS.filter(
    (slug) => !etiquetas.some((e) => e.slug === slug),
  );
  if (missingSlugs.length > 0) {
    throw new Error(
      `[vehiculo-etiquetas] Faltan etiquetas en DB: ${missingSlugs.join(", ")}. Ejecuta el seed de etiquetas primero.`,
    );
  }

  const tagIds = TAG_SLUGS.map(
    (slug) => etiquetas.find((e) => e.slug === slug)!.id,
  );

  const vehicles = await prisma.vehiculo.findMany({
    select: { id: true, etiquetaComercialId: true },
  });

  // Mezclar vehículos aleatoriamente para distribuir etiquetas uniformemente
  // independientemente del estado del vehículo
  const shuffled = [...vehicles].sort(() => Math.random() - 0.5);

  let updated = 0;
  let unchanged = 0;

  for (let i = 0; i < shuffled.length; i++) {
    const desiredTagId = tagIds[i % tagIds.length];

    if (shuffled[i].etiquetaComercialId === desiredTagId) {
      unchanged++;
      continue;
    }

    await prisma.vehiculo.update({
      where: { id: shuffled[i].id },
      data: { etiquetaComercialId: desiredTagId },
    });
    updated++;
  }

  console.log(
    `  [vehiculo-etiquetas] Actualizadas: ${updated} | Sin cambios: ${unchanged}`,
  );
}
