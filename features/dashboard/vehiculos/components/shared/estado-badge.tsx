import { EstadoVenta } from "@/generated/prisma/enums"
import { cn } from "@/features/dashboard/lib/utils"

const ESTADO_CONFIG: Record<
  EstadoVenta,
  { label: string; dotClass: string; wrapperClass: string }
> = {
  Disponible: {
    label: "Disponible",
    dotClass: "bg-primary",
    wrapperClass:
      "bg-primary/20 text-primary-foreground border border-primary/40",
  },
  Reservado: {
    label: "Reservado",
    dotClass: "bg-amber-400",
    wrapperClass:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20",
  },
  Facturado: {
    label: "Facturado",
    dotClass: "bg-muted-foreground/40",
    wrapperClass: "bg-muted text-muted-foreground border border-border",
  },
}

interface EstadoBadgeProps {
  estado: EstadoVenta
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    dotClass: "bg-muted-foreground/40",
    wrapperClass: "bg-muted text-muted-foreground border border-border",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.wrapperClass,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", config.dotClass)}
        aria-hidden="true"
      />
      {config.label}
    </span>
  )
}
