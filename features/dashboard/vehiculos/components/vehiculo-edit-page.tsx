import { notFound } from "next/navigation"
import { getCachedVehiculoAdminById } from "../queries/vehiculo.queries"
import { getCachedRelationOptions } from "../queries/relations.queries"
import { VehiculoForm } from "./vehiculo-form/form"

interface VehiculoEditPageProps {
  id: string
}

export async function VehiculoEditPage({ id }: VehiculoEditPageProps) {
  const [vehiculo, options] = await Promise.all([
    getCachedVehiculoAdminById(id),
    getCachedRelationOptions(),
  ])

  if (!vehiculo) notFound()

  return <VehiculoForm mode="edit" vehiculo={vehiculo} options={options} />
}
