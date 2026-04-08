import { Suspense } from "react"
import { VehiculoEditPage } from "@/features/dashboard/vehiculos/components/vehiculo-edit-page"
import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export const metadata = { title: "Editar vehículo" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<Skeleton className="h-[800px] w-full rounded-xl" />}>
      <VehiculoEditPage id={id} />
    </Suspense>
  )
}
