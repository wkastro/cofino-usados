export const dynamic = "force-dynamic"

import { getPageContentRaw } from "@/features/cms/queries/page-content.queries"
import { toContentMap }      from "@/features/cms/types/page-content"
import { CmsPageEditor }     from "@/features/cms/engine/cms-page-editor"

export default async function InicioEditorPage() {
  const records        = await getPageContentRaw("inicio")
  const initialContent = toContentMap(records)

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Página Inicio</h1>
        <p className="text-muted-foreground text-sm">
          Edita el contenido y metadatos SEO de la página principal.
        </p>
      </div>
      <CmsPageEditor pageSlug="inicio" initialContent={initialContent} />
    </div>
  )
}
