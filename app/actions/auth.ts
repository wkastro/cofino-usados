"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
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

  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Ya existe una cuenta con este correo electrónico",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

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
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Datos de registro inválidos" };
  }

  const { fullName, email, phone, password } = result.data;

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = fullName.trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Ya existe una cuenta con este correo electrónico",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

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
