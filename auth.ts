import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    providers: [
        Credentials({
            id: "user-login",
            name: "User Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = (credentials?.email as string | undefined)?.trim().toLowerCase()
                const password = credentials?.password as string | undefined

                if (!email || !password) return null

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) return null

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null

                if (user.role !== "USER") return null

                return {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                }
            },
        }),
        Credentials({
            id: "admin-login",
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = (credentials?.email as string | undefined)?.trim().toLowerCase()
                const password = credentials?.password as string | undefined

                if (!email || !password) return null

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) return null

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null

                if (user.role !== "ADMIN") return null

                return {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.fullName = user.name
                token.phone = (user as { phone?: string }).phone
                token.role = (user as { role?: string }).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.fullName = token.fullName as string
                session.user.phone = token.phone as string
                session.user.role = token.role as string
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const role = auth?.user?.role
            const pathname = nextUrl.pathname

            const userAuthRoutes = ["/login", "/registro"]
            const adminAuthRoutes = ["/auth"]
            const privateRoutes = ["/dashboard"]

            // USER autenticado en /login o /registro → redirigir a /
            if (userAuthRoutes.some((r) => pathname.startsWith(r))) {
                if (isLoggedIn && role === "USER") {
                    return Response.redirect(new URL("/", nextUrl))
                }
                return true
            }

            // ADMIN autenticado en /auth → redirigir a /dashboard
            if (adminAuthRoutes.some((r) => pathname === r)) {
                if (isLoggedIn && role === "ADMIN") {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }

            // /dashboard/* → solo ADMIN
            if (privateRoutes.some((r) => pathname.startsWith(r))) {
                if (!isLoggedIn || role !== "ADMIN") {
                    return Response.redirect(new URL("/auth", nextUrl))
                }
                return true
            }

            return true
        },
    },
})
