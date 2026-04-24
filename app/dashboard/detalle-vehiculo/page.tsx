import type { Metadata }      from "next"
import { connection }         from "next/server"
import { getPageContentRaw } from "@/features/cms/queries/page-content.queries"
import { toContentMap }      from "@/features/cms/types/page-content"
import { CmsPageEditor }     from "@/features/cms/engine/cms-page-editor"

export const metadata: Metadata = {
  title: "Detalle de Vehículo",
}

export default async function DetalleVehiculoEditorPage() {
  await connection()
  const records        = await getPageContentRaw("detalle-vehiculo")
  const initialContent = toContentMap(records)

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Página Detalle de Vehículo</h1>
        <p className="text-muted-foreground text-sm">
          Edita el contenido del video showcase y la calculadora de cuotas.
        </p>
      </div>
      <CmsPageEditor pageSlug="detalle-vehiculo" initialContent={initialContent} />
    </div>
  )
}
