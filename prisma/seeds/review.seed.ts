import { PrismaClient } from "../../generated/prisma/client";

const REVIEW_USERS = [
  {
    fullName: "Ana Martínez",
    email: "review.user1@cofino.local",
    phone: "50256230001",
  },
  {
    fullName: "Luis Herrera",
    email: "review.user2@cofino.local",
    phone: "50256230002",
  },
  {
    fullName: "María López",
    email: "review.user3@cofino.local",
    phone: "50256230003",
  },
  {
    fullName: "Carlos Gómez",
    email: "review.user4@cofino.local",
    phone: "50256230004",
  },
  {
    fullName: "Sofía Ramírez",
    email: "review.user5@cofino.local",
    phone: "50256230005",
  },
] as const;

const COMMENT_TEMPLATES = [
  "Excelente experiencia general. El vehículo responde muy bien y está en muy buen estado.",
  "Muy cómodo para uso diario. El consumo me pareció razonable y el manejo es estable.",
  "Buena relación calidad-precio. El interior está bien cuidado y la conducción es agradable.",
  "Me gustó el desempeño en ciudad y carretera. La atención en agencia también fue muy buena.",
  "Cumple lo que esperaba. Lo recomendaría para alguien que busca confiabilidad y buen equipamiento.",
] as const;

function buildComment(vehicleName: string, template: string) {
  return `${template} Modelo reseñado: ${vehicleName}.`;
}

function buildRating(vehicleIndex: number, userIndex: number): number {
  return ((vehicleIndex + userIndex) % 5) + 1;
}

export async function seedReviews(prisma: PrismaClient) {
  const users = await Promise.all(
    REVIEW_USERS.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        create: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          password: null,
          role: "USER",
        },
        update: {
          fullName: user.fullName,
          phone: user.phone,
          role: "USER",
        },
      }),
    ),
  );

  const vehicles = await prisma.vehiculo.findMany({
    select: {
      id: true,
      nombre: true,
    },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  if (vehicles.length < 10) {
    console.warn(
      `  [reviews] Solo hay ${vehicles.length} vehículos. Se esperaban al menos 10 para el seed completo.`,
    );
  }

  let upserts = 0;

  for (const [vehicleIndex, vehicle] of vehicles.entries()) {
    for (const [userIndex, user] of users.entries()) {
      const rating = buildRating(vehicleIndex, userIndex);
      const template = COMMENT_TEMPLATES[(vehicleIndex + userIndex) % COMMENT_TEMPLATES.length];
      const comment = buildComment(vehicle.nombre, template);

      await prisma.review.upsert({
        where: {
          userId_vehiculoId: {
            userId: user.id,
            vehiculoId: vehicle.id,
          },
        },
        create: {
          userId: user.id,
          vehiculoId: vehicle.id,
          rating,
          comment,
        },
        update: {
          rating,
          comment,
        },
      });

      upserts++;
    }
  }

  console.log(
    `  [reviews] Usuarios USER seed: ${users.length} | Vehículos: ${vehicles.length} | Reseñas procesadas: ${upserts}`,
  );
}
