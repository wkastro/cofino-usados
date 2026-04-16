import { cn } from "@/features/dashboard/lib/utils";

type EstadoConfig = { label: string; dotClass: string; wrapperClass: string };

const ESTADO_CONFIG: Record<string, EstadoConfig> = {
  Disponible: {
    label: "Disponible",
    dotClass: "bg-emerald-500",
    wrapperClass:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20",
  },
  Reservado: {
    label: "Reservado",
    dotClass: "bg-amber-500",
    wrapperClass:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20",
  },
  Facturado: {
    label: "Facturado",
    dotClass: "bg-slate-400",
    wrapperClass:
      "bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/20",
  },
};

interface EstadoBadgeProps {
  estado: string;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    dotClass: "bg-muted-foreground/40",
    wrapperClass: "bg-muted text-muted-foreground border border-border",
  };
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
  );
}
