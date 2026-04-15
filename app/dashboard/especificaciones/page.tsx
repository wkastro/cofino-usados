import { EspecificacionesPage } from "@/features/dashboard/especificaciones/components/especificaciones-page"
import { getCachedAllEspecificaciones } from "@/features/dashboard/especificaciones/queries/especificaciones.queries"

export const metadata = { title: "Especificaciones" }

export default async function Page() {
  const data = await getCachedAllEspecificaciones()

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Especificaciones</h1>
      </div>
      <EspecificacionesPage data={data} />
    </div>
  )
}
