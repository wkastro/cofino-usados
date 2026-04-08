import { Suspense } from "react"
import { VehiculoCreatePage } from "@/features/dashboard/vehiculos/components/vehiculo-create-page"
import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export const metadata = { title: "Nuevo vehículo" }

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-xl" />}>
      <VehiculoCreatePage />
    </Suspense>
  )
}
