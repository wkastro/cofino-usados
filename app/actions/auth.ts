"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { requireAdmin } from "@/lib/auth-guard";
import type { ActionResult } from "@/types/auth";

export async function registerUser(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<ActionResult> {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Datos de registro inválidos" };
  }

  const { fullName, email, phone, password } = result.data;

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = fullName.trim();

  // async-parallel: run DB check and bcrypt hash in parallel
  const [existingUser, hashedPassword] = await Promise.all([
    prisma.user.findUnique({ where: { email: sanitizedEmail } }),
    bcrypt.hash(password, 12),
  ]);

  if (existingUser) {
    return {
      success: false,
      message: "Ya existe una cuenta con este correo electrónico",
    };
  }

  await prisma.user.create({
    data: {
      fullName: sanitizedName,
      email: sanitizedEmail,
      phone,
      password: hashedPassword,
    },
  });

  return { success: true, message: "Cuenta creada exitosamente" };
}

export async function registerAdmin(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<ActionResult> {
  // Solo un ADMIN autenticado puede crear otros ADMIN.
  // requireAdmin() redirige a /auth si no hay sesión y a / si no es ADMIN.
  await requireAdmin();

  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Datos de registro inválidos" };
  }

  const { fullName, email, phone, password } = result.data;

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = fullName.trim();

  // async-parallel: run DB check and bcrypt hash in parallel
  const [existingUser, hashedPassword] = await Promise.all([
    prisma.user.findUnique({ where: { email: sanitizedEmail } }),
    bcrypt.hash(password, 12),
  ]);

  if (existingUser) {
    return {
      success: false,
      message: "Ya existe una cuenta con este correo electrónico",
    };
  }

  await prisma.user.create({
    data: {
      fullName: sanitizedName,
      email: sanitizedEmail,
      phone,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return { success: true, message: "Cuenta de administrador creada exitosamente" };
}
