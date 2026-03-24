import { PrismaClient } from "../../generated/prisma/client";

function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const categorias = [
  { nombre: "Hybrid", estado: true },
  { nombre: "Hatchback", estado: true },
  { nombre: "Pickup", estado: true },
  { nombre: "Panel", estado: true },
  { nombre: "Blindado", estado: true },
  { nombre: "Sedán", estado: true },
  { nombre: "Suv", estado: true },
  { nombre: "Camión", estado: false },
].map((c) => ({ ...c, slug: toSlug(c.nombre), thumbnail: null }));

export async function seedCategorias(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const categoria of categorias) {
    const existing = await prisma.categoria.findFirst({
      where: { nombre: categoria.nombre },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.categoria.create({ data: categoria });
    created++;
  }

  console.log(
    `  [categorias] Creadas: ${created} | Omitidas (ya existían): ${skipped}`
  );
}
