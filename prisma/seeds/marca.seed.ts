import { PrismaClient } from "../../generated/prisma/client";

const marcas = [
  { nombre: "Nissan", estado: true },
  { nombre: "Mitsubishi", estado: true },
  { nombre: "Toyota", estado: true },
  { nombre: "Mazda", estado: true },
  { nombre: "Lexus", estado: true },
  { nombre: "KIA", estado: true },
  { nombre: "Hyundai", estado: true },
  { nombre: "FIAT", estado: false },
  { nombre: "Daihatsu", estado: false },
  { nombre: "Chevrolet", estado: true },
  { nombre: "Audi", estado: true },
  { nombre: "Land Rover", estado: false },
  { nombre: "Subaru", estado: true },
  { nombre: "Suzuki", estado: false },
  { nombre: "Dodge", estado: false },
  { nombre: "Renault", estado: true },
  { nombre: "Ford", estado: true },
  { nombre: "Honda", estado: true },
  { nombre: "BMW", estado: true },
  { nombre: "Mercedes Benz", estado: false },
  { nombre: "Volskwagen", estado: true },
  { nombre: "Mahindra", estado: false },
  { nombre: "Mini Cooper", estado: false },
  { nombre: "Peugeot", estado: true },
  { nombre: "Jac", estado: true },
  { nombre: "Jaguar", estado: true },
  { nombre: "Changan", estado: true },
  { nombre: "Seat", estado: true },
  { nombre: "Isuzu", estado: true },
  { nombre: "SsangYong", estado: true },
  { nombre: "Jeep", estado: true },
  { nombre: "BYD", estado: true },
  { nombre: "VOLVO", estado: true },
  { nombre: "PORSCHE", estado: true },
  { nombre: "Citroen", estado: true },
  { nombre: "Chery", estado: true },
  { nombre: "Maxus", estado: true },
  { nombre: "JIM", estado: true },
  { nombre: "MG", estado: true },
];

export async function seedMarcas(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;

  for (const marca of marcas) {
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
