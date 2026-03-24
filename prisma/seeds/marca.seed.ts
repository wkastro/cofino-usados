import { PrismaClient } from "../../generated/prisma/client";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const marcas = [
  "Nissan", "Mitsubishi", "Toyota", "Mazda", "Lexus", "KIA", "Hyundai",
  "Chevrolet", "Audi", "Subaru", "Renault", "Ford", "Honda", "BMW",
  "Volskwagen", "Peugeot", "Jac", "Jaguar", "Changan", "Seat", "Isuzu",
  "SsangYong", "Jeep", "BYD", "VOLVO", "PORSCHE", "Citroen", "Chery",
  "Maxus", "JIM", "MG",
].map((nombre) => ({ nombre, slug: toSlug(nombre), estado: true }));

const marcasInactivas = [
  "FIAT", "Daihatsu", "Land Rover", "Suzuki", "Dodge", "Mercedes Benz",
  "Mahindra", "Mini Cooper",
].map((nombre) => ({ nombre, slug: toSlug(nombre), estado: false }));

const allMarcas = [...marcas, ...marcasInactivas];

export async function seedMarcas(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const marca of allMarcas) {
    const existing = await prisma.marca.findUnique({
      where: { nombre: marca.nombre },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.marca.create({ data: marca });
    created++;
  }

  console.log(
    `  [marcas] Creadas: ${created} | Omitidas (ya existían): ${skipped}`
  );
}
