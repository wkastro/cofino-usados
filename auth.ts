import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string | undefined
                const password = credentials?.password as string | undefined

                if (!email || !password) return null

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) return null

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null

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
            const pathname = nextUrl.pathname

            // /auth es la página de login de admin — siempre accesible
            if (pathname === "/auth") return true

            // Rutas que requieren rol ADMIN
            const adminRoutes = ["/dashboard"]

            const isAdminRoute = adminRoutes.some((r) =>
                pathname.startsWith(r)
            )

            if (isAdminRoute) {
                if (!isLoggedIn || auth?.user?.role !== "ADMIN") {
                    return Response.redirect(new URL("/auth", nextUrl))
                }
                return true
            }

            return true
        },
    },
})
