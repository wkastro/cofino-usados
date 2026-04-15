import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

const COL_WIDTHS = [176, 72, 88, 56, 80, 72, 88, 72, 32]

export function VehiculosTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-36 shrink-0" />
        </div>
        <Skeleton className="h-9 w-36 shrink-0" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border bg-card">
        {/* Header */}
        <div className="flex items-center gap-4 border-b bg-muted/60 px-4 py-3">
          {COL_WIDTHS.map((w, i) => (
            <Skeleton key={i} className="h-3 rounded" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-4 py-3.5 last:border-0">
            <div className="flex flex-col gap-1.5" style={{ width: 176 }}>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            {COL_WIDTHS.slice(1).map((w, j) => (
              <Skeleton key={j} className="h-4 rounded" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-3.5 w-28" />
        <div className="flex items-center gap-3">
          <Skeleton className="hidden h-3.5 w-20 lg:block" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-8 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
