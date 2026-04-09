export { auth as proxy } from "@/auth"

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/favoritos/:path*",
        "/auth",
        "/login",
        "/registro",
    ],
}
