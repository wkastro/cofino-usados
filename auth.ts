import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { AdapterUser } from "@auth/core/adapters"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

const extendedAdapter = {
    ...PrismaAdapter(prisma),
    createUser: async (data: Omit<AdapterUser, "id">): Promise<AdapterUser> => {
        const user = await prisma.user.create({
            data: {
                fullName: data.name ?? "Usuario",
                email: data.email,
                emailVerified: data.emailVerified,
                image: data.image,
                phone: null,
                password: null,
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

// Placeholder hash used to run a constant-time bcrypt comparison even when the
// user does not exist, preventing email enumeration via response-time analysis.
const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345"

async function authorizeCredentials(
    credentials: Partial<Record<string, unknown>>,
    requiredRole: "USER" | "ADMIN"
) {
    const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : undefined
    const password = typeof credentials?.password === "string" ? credentials.password : undefined

    if (!email || !password) return null

    const user = await prisma.user.findUnique({ where: { email } })

    // Always run bcrypt so response time doesn't reveal whether the email exists.
    const hash = user?.password ?? DUMMY_HASH
    const isValid = await bcrypt.compare(password, hash)

    if (!user?.password || !isValid) return null

    if (user.role !== requiredRole) return null

    return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: extendedAdapter,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Apple({
            clientId: process.env.AUTH_APPLE_ID,
            clientSecret: process.env.AUTH_APPLE_SECRET,
        }),
        Credentials({
            id: "user-login",
            name: "User Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: (credentials) => authorizeCredentials(credentials, "USER"),
        }),
        Credentials({
            id: "admin-login",
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: (credentials) => authorizeCredentials(credentials, "ADMIN"),
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ account, user }) {
            if (account?.type === "credentials") return true

            if (!user.email) return false
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email },
                select: { role: true, password: true },
            })

            // Block admin accounts — they must use credentials only.
            if (dbUser?.role === "ADMIN") return false

            // Block accounts registered with a password from signing in via OAuth.
            // Without this, an attacker who creates an OAuth account with a victim's
            // email can take over their credentials-based account.
            if (dbUser?.password) return false

            return true
        },
        async jwt({ token, user, account }) {
            if (user && account?.type === "credentials") {
                token.id = user.id!
                token.fullName = user.name ?? ""
                token.phone = user.phone ?? undefined
                token.role = user.role ?? "USER"
            }

            if (account?.type === "oauth" && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    select: { id: true, fullName: true, phone: true, role: true },
                })
                if (dbUser) {
                    token.id = dbUser.id
                    token.fullName = dbUser.fullName
                    token.phone = dbUser.phone ?? undefined
                    token.role = dbUser.role
                }
            }

            // On first login set expiry based on role: 8 h for ADMIN, 30 days for USER.
            if (account) {
                const ttl = token.role === "ADMIN" ? 8 * 60 * 60 : 30 * 24 * 60 * 60
                token.exp = Math.floor(Date.now() / 1000) + ttl
            }

            // Re-sync role on every refresh so role revocations take effect immediately.
            if (!account && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    select: { role: true },
                })
                if (dbUser) token.role = dbUser.role
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
                session.user.fullName = token.fullName
                session.user.phone = token.phone ?? ""
                session.user.role = token.role
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }): boolean | Response {
            const isLoggedIn = !!auth?.user
            const role = auth?.user?.role
            const pathname = nextUrl.pathname

            if (pathname.startsWith("/login") || pathname.startsWith("/registro")) {
                if (isLoggedIn && role === "USER") return Response.redirect(new URL("/", nextUrl))
                return true
            }

            if (pathname === "/auth") {
                if (isLoggedIn && role === "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl))
                return true
            }

            if (pathname.startsWith("/favoritos")) {
                if (!isLoggedIn || role !== "USER") return Response.redirect(new URL("/login", nextUrl))
                return true
            }

            if (pathname.startsWith("/dashboard")) {
                if (!isLoggedIn || role !== "ADMIN") return Response.redirect(new URL("/auth", nextUrl))
                return true
            }

            return true
        },
    },
})
