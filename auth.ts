import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // En una implementación real, aquí buscarías en la base de datos
                // Por ahora usamos credenciales fijas para demo según lo discutido
                if (
                    credentials?.email === "admin@example.com" &&
                    credentials?.password === "password123"
                ) {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: "admin@example.com",
                    }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirige a login
            }
            return true
        },
    },
})
