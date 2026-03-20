import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { AdapterUser } from "@auth/core/adapters"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

const adapter = PrismaAdapter(prisma)

const extendedAdapter = {
    ...adapter,
    createUser: async (data: Omit<AdapterUser, "id">): Promise<AdapterUser> => {
        const user = await prisma.user.create({
            data: {
                fullName: data.name ?? "Usuario",
                email: data.email,
                emailVerified: data.emailVerified,
                image: data.image,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                phone: undefined as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                password: undefined as any,
            },
        })
        return {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            name: user.fullName,
            image: user.image,
        }
    },
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: extendedAdapter,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
        Apple({
            allowDangerousEmailAccountLinking: true,
        }),
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
                if (!user.password) return null

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
                if (!user.password) return null

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
        async signIn({ account }) {
            if (account?.provider === "credentials") {
                return true
            }

            // Admin blocking for OAuth is handled in the jwt callback
            // where the DB user is available via token.email lookup.
            return true
        },
        async jwt({ token, user, account }) {
            // Credentials: enrich from the authorize return value
            if (user && account?.provider === "credentials") {
                token.id = user.id
                token.fullName = user.name
                token.phone = (user as { phone?: string | null }).phone ?? undefined
                token.role = (user as { role?: string }).role
            }

            // OAuth: on first sign-in (account is present), look up DB user
            if (account && account.provider !== "credentials" && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                })
                if (dbUser) {
                    // Block admin accounts from OAuth sign-in
                    if (dbUser.role === "ADMIN") {
                        return { ...token, error: "AdminOAuthNotAllowed" }
                    }
                    token.id = dbUser.id
                    token.fullName = dbUser.fullName
                    token.phone = dbUser.phone ?? undefined
                    token.role = dbUser.role
                }
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
