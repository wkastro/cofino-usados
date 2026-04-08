import { getCachedRelationOptions } from "../queries/relations.queries"
import { VehiculoForm } from "./vehiculo-form/form"

export async function VehiculoCreatePage() {
  const options = await getCachedRelationOptions()

  return <VehiculoForm mode="create" options={options} />
}
