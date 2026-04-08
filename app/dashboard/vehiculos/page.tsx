import { Suspense } from "react"
import type { SearchParams } from "next/dist/server/request/search-params"
import { VehiculosPage } from "@/features/dashboard/vehiculos/components/vehiculos-page"
import { VehiculosTableSkeleton } from "@/features/dashboard/vehiculos/components/vehiculos-table/skeleton"

interface PageProps {
  searchParams: Promise<SearchParams>
}

export const metadata = { title: "Vehículos" }

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page   = Number(params.page   ?? "1")
  const search = String(params.q      ?? "")
  const estado = String(params.estado ?? "")

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Vehículos</h1>
      </div>
      <Suspense key={`${page}-${search}-${estado}`} fallback={<VehiculosTableSkeleton />}>
        <VehiculosPage page={page} search={search} estado={estado} />
      </Suspense>
    </div>
  )
}
