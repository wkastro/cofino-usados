import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'wcastro@aumenta.do' },
    select: { id: true, email: true, role: true, password: true, fullName: true }
  });

  if (!user) {
    console.log('USER NOT FOUND');
  } else {
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('FullName:', user.fullName);
    console.log('Password hash:', user.password);
    const match = await bcrypt.compare('WalterCherec123', user.password);
    console.log('Password match:', match);
  }

  await prisma.$disconnect();
}

main();
