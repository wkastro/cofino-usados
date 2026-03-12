import "dotenv/config"
import bcrypt from "bcrypt"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const fullName = process.env.ADMIN_FULL_NAME

  if (!email || !password || !fullName) {
    console.error(
      "Faltan variables de entorno: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME"
    )
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    console.log(`El usuario admin (${email}) ya existe. Seed omitido.`)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.create({
    data: {
      fullName,
      email,
      phone: "",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log(`Usuario admin creado: ${admin.email} (${admin.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
