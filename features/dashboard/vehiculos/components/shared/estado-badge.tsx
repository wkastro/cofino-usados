import { Badge } from "@/features/dashboard/components/ui/badge"
import { EstadoVenta } from "@/generated/prisma/enums"

const ESTADO_CONFIG: Record<
  EstadoVenta,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Disponible: { label: "Disponible", variant: "default" },
  Reservado:  { label: "Reservado",  variant: "secondary" },
  Facturado:  { label: "Facturado",  variant: "outline" },
}

interface EstadoBadgeProps {
  estado: EstadoVenta
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? { label: estado, variant: "outline" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
