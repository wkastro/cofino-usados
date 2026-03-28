import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return NextResponse.json(
        { message: "Datos de registro inválidos", errors },
        { status: 400 }
      )
    }

    const { fullName, email, phone, password } = result.data

    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedName = fullName.trim()

    // async-parallel: run DB check and bcrypt hash in parallel
    const [existingUser, hashedPassword] = await Promise.all([
      prisma.user.findUnique({ where: { email: sanitizedEmail } }),
      bcrypt.hash(password, 12),
    ])

    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo electrónico" },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        fullName: sanitizedName,
        email: sanitizedEmail,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: "Cuenta creada exitosamente", user },
      { status: 201 }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
