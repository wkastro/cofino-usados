import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export function VehiculosTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-9 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <div className="flex items-center gap-4 border-b bg-muted px-4 py-3">
          {[180, 80, 100, 100, 80, 80, 100, 80].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-4 py-3">
            {[180, 80, 100, 100, 80, 80, 100, 80].map((w, j) => (
              <Skeleton key={j} className="h-4" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="size-8" />
          ))}
        </div>
      </div>
    </div>
  )
}
