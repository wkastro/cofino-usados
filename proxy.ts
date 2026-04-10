import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/rate-limit"

// NextAuth credential callback endpoints — these are the brute-force targets.
const AUTH_ENDPOINTS = new Set([
    "/api/auth/callback/user-login",
    "/api/auth/callback/admin-login",
])

function getClientIP(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        "anonymous"
    )
}

export async function proxy(request: NextRequest) {
    if (request.method === "POST" && AUTH_ENDPOINTS.has(request.nextUrl.pathname)) {
        const ip = getClientIP(request)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (auth as any)(request)
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
