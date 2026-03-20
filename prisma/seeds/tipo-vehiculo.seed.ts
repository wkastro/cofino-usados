import { PrismaClient } from "../../generated/prisma/client";

const tipos = [
  { nombre: "Hybrid",        thumbnail: null, estado: true },
  { nombre: "Hatchback",      thumbnail: null, estado: true },
  { nombre: "Pickup",     thumbnail: null, estado: true },
  { nombre: "Panel",  thumbnail: null, estado: true },
  { nombre: "Blindado",      thumbnail: null, estado: true },
  { nombre: "Sedán",        thumbnail: null, estado: true },
  { nombre: "Suv",  thumbnail: null, estado: true },
  { nombre: "Camión",thumbnail: null, estado: false },
];

export async function seedCategorias(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const tipo of tipos) {
    const existing = await prisma.categoria.findFirst({
      where: { nombre: tipo.nombre },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.categoria.create({ data: tipo });
    created++;
  }

  console.log(
    `  [categorias] Creadas: ${created} | Omitidas (ya existían): ${skipped}`
  );
}
