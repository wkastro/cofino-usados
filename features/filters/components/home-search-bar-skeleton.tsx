import { cn }        from "@/lib/utils"
import { Container } from "@/components/layout/container"

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-white/10", className)} />
}

export function HomeSearchBarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative z-30", className)}>
      <Container>
        <div className="rounded-2xl bg-card/80 p-6 lg:px-8 lg:py-12 border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Bone className="h-4 w-24" />
                  <Bone className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="shrink-0">
              <Bone className="h-11 w-full lg:w-36 rounded-full" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
