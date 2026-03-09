"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "../../components/global/logo"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Credenciales inválidas")
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setError("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md flex flex-col items-center">
            <Logo className="text-foreground h-10 w-auto" />
            <h2 className="text-2xl font-bold text-center w-full">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Entrar"}
                </Button>
            </form>
            <div className="text-center text-sm text-gray-500">
                <p>Demo: admin@example.com / password123</p>
            </div>
        </div>
    )
}
