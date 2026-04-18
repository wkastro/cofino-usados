function Bone({ className }: { className?: string }) {
  return (
    <div className={`motion-safe:animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

function SingleSkeleton() {
  return (
    <article className="w-full max-w-[24rem] rounded-lg bg-card border border-border p-6 pb-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Bone className="h-4 w-40" />
          <Bone className="h-3 w-24" />
        </div>
        <Bone className="h-6 w-6 rounded-full" />
      </div>

      {/* Image */}
      <Bone className="h-44 w-full my-2 rounded-lg" />

      {/* Specs grid */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Availability */}
      <Bone className="mt-5 mb-1 h-4 w-48" />

      {/* Price + button */}
      <div className="mt-1 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <Bone className="h-5 w-28" />
          <Bone className="h-3 w-36" />
        </div>
        <Bone className="h-9 w-24 rounded-lg" />
      </div>

      {/* Agency */}
      <div className="mt-6 border-t border-border -mx-6 px-6 pt-3 pb-1 flex justify-center">
        <Bone className="h-4 w-36" />
      </div>
    </article>
  );
}

interface VehicleCardSkeletonGridProps {
  count?: number;
  title?: string;
}

export function VehicleCardSkeletonGrid({
  count = 6,
  title = "Autos recomendados",
}: VehicleCardSkeletonGridProps): React.ReactElement {
  return (
    <section
      className="w-full py-12"
      aria-busy="true"
      aria-label="Cargando vehículos"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-foreground mb-10 tracking-tight">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="w-full flex justify-center">
              <SingleSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SearchBarSkeleton(): React.ReactElement {
  return (
    <div
      className="mt-4 w-full"
      aria-busy="true"
      aria-label="Cargando filtros"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <Bone className="h-10 w-full sm:w-48" />
          <Bone className="h-10 w-full sm:w-48" />
          <Bone className="h-10 w-full sm:w-48" />
          <Bone className="h-10 w-full sm:w-32" />
        </div>
      </div>
    </div>
  );
}
