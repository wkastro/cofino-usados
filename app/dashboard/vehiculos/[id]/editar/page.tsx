import { Suspense } from "react"
import { VehiculoEditPage } from "@/features/dashboard/vehiculos/components/vehiculo-edit-page"
import { Skeleton } from "@/features/dashboard/components/ui/skeleton"

export const metadata = { title: "Editar vehículo" }

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ step?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { step } = await searchParams
  const initialStep = step ? Math.max(0, Math.min(4, parseInt(step, 10))) : undefined

  return (
    <Suspense fallback={<Skeleton className="h-[800px] w-full rounded-xl" />}>
      <VehiculoEditPage id={id} initialStep={initialStep} />
    </Suspense>
  )
}
