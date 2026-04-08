import { getCachedVehiculosAdmin } from "../queries/vehiculo.queries"
import { VehiculosTable } from "./vehiculos-table/table"

interface VehiculosPageProps {
  page: number
  search: string
  estado: string
}

export async function VehiculosPage({ page, search, estado }: VehiculosPageProps) {
  const data = await getCachedVehiculosAdmin(page, search, estado || undefined)

  return <VehiculosTable data={data} />
}
