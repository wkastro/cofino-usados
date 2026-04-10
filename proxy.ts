import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/rate-limit"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authHandler = auth as any

// NextAuth credential callback endpoints — these are the brute-force targets.
const AUTH_ENDPOINTS = new Set([
    "/api/auth/callback/user-login",
    "/api/auth/callback/admin-login",
])

function getClientIP(request: NextRequest): string | null {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        null
    )
}

export async function proxy(request: NextRequest) {
    if (request.method === "POST" && AUTH_ENDPOINTS.has(request.nextUrl.pathname)) {
        // If the IP cannot be determined (misconfigured proxy, local dev), skip
        // rate limiting rather than putting all unknown clients in one shared bucket.
        const ip = getClientIP(request)
        if (!ip) return authHandler(request)

        const { limited, resetAt } = checkRateLimit(`auth:${ip}`)

        if (limited) {
            return new NextResponse("Too Many Requests", {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
                    "X-RateLimit-Limit": "5",
                    "X-RateLimit-Remaining": "0",
                },
            })
        }
    }

    return authHandler(request)
}

export const config = {
    matcher: [
        "/api/auth/callback/user-login",
        "/api/auth/callback/admin-login",
        "/dashboard/:path*",
        "/favoritos/:path*",
        "/auth",
        "/login",
        "/registro",
    ],
}
