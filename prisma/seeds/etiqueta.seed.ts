import { PrismaClient } from "../../generated/prisma/client";

const etiquetas = [
  { nombre: "Nuevo ingreso",      slug: "nuevo-ingreso",      estado: true },
  { nombre: "Liquidación",        slug: "liquidacion",        estado: true },
  { nombre: "Autos Certificados", slug: "autos-certificados", estado: true },
  { nombre: "Consignación",       slug: "consignacion",       estado: true },
  { nombre: "Baja de precio",     slug: "baja-de-precio",     estado: true },
];

export async function seedEtiquetasComerciales(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const etiqueta of etiquetas) {
    const existing = await prisma.etiquetaComercial.findUnique({
      where: { slug: etiqueta.slug },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.etiquetaComercial.create({ data: etiqueta });
    created++;
  }

  console.log(
    `  [etiquetas-comerciales] Creadas: ${created} | Omitidas (ya existían): ${skipped}`
  );
}
