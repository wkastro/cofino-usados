import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  // ─── Transmision ─────────────────────────────────────────────────────────
  const transmisiones = await Promise.all([
    prisma.transmision.upsert({
      where: { slug: "automatico" },
      update: {},
      create: { nombre: "Automático", slug: "automatico" },
    }),
    prisma.transmision.upsert({
      where: { slug: "manual" },
      update: {},
      create: { nombre: "Manual", slug: "manual" },
    }),
  ])

  // ─── Combustible ─────────────────────────────────────────────────────────
  const combustibles = await Promise.all([
    prisma.combustible.upsert({
      where: { slug: "gasolina" },
      update: {},
      create: { nombre: "Gasolina", slug: "gasolina" },
    }),
    prisma.combustible.upsert({
      where: { slug: "diesel" },
      update: {},
      create: { nombre: "Diesel", slug: "diesel" },
    }),
    prisma.combustible.upsert({
      where: { slug: "hibrido" },
      update: {},
      create: { nombre: "Híbrido", slug: "hibrido" },
    }),
    prisma.combustible.upsert({
      where: { slug: "electrico" },
      update: {},
      create: { nombre: "Eléctrico", slug: "electrico" },
    }),
  ])

  // ─── Traccion ─────────────────────────────────────────────────────────────
  const tracciones = await Promise.all([
    prisma.traccion.upsert({
      where: { slug: "4x4" },
      update: {},
      create: { nombre: "4x4", slug: "4x4" },
    }),
    prisma.traccion.upsert({
      where: { slug: "4x2" },
      update: {},
      create: { nombre: "4x2", slug: "4x2" },
    }),
    prisma.traccion.upsert({
      where: { slug: "awd" },
      update: {},
      create: { nombre: "AWD", slug: "awd" },
    }),
    prisma.traccion.upsert({
      where: { slug: "4wd" },
      update: {},
      create: { nombre: "4WD", slug: "4wd" },
    }),
  ])

  // ─── EstadoVenta ──────────────────────────────────────────────────────────
  const estados = await Promise.all([
    prisma.estadoVenta.upsert({
      where: { slug: "disponible" },
      update: {},
      create: { nombre: "Disponible", slug: "disponible" },
    }),
    prisma.estadoVenta.upsert({
      where: { slug: "reservado" },
      update: {},
      create: { nombre: "Reservado", slug: "reservado" },
    }),
    prisma.estadoVenta.upsert({
      where: { slug: "facturado" },
      update: {},
      create: { nombre: "Facturado", slug: "facturado" },
    }),
  ])

  console.log("Seed: tablas de especificaciones pobladas")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
