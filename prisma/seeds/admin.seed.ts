import bcrypt from "bcrypt";
import { PrismaClient } from "../../generated/prisma/client";

export async function seedAdmin(prisma: PrismaClient) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME;

  if (!email || !password || !fullName) {
    console.error(
      "Faltan variables de entorno: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME"
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`  [admin] Usuario (${email}) ya existe. Omitido.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      fullName,
      email,
      phone: "",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`  [admin] Usuario creado: ${admin.email} (${admin.id})`);
}
