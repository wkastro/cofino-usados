import { ClasificacionPage } from "@/features/dashboard/clasificacion/components/clasificacion-page"
import { getCachedAllClasificaciones } from "@/features/dashboard/clasificacion/queries/clasificacion.queries"

export const metadata = { title: "Clasificación" }

export default async function Page() {
  const data = await getCachedAllClasificaciones()

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Clasificación</h1>
      </div>
      <ClasificacionPage data={data} />
    </div>
  )
}
