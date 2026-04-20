"use client"

import { useState, useTransition }        from "react"
import { useForm, FormProvider }          from "react-hook-form"
import { zodResolver }                    from "@hookform/resolvers/zod"
import { toast }                          from "sonner"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/features/dashboard/components/ui/tabs"
import { Label }    from "@/features/dashboard/components/ui/label"
import { Input }    from "@/features/dashboard/components/ui/input"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import { getPageBlocks }  from "@/features/cms/registry"
import { saveSeoContent } from "@/features/cms/actions/page-content.actions"
import { seoSchema }      from "@/features/cms/validations/page-content"
import { SEO_BLOCK_KEY }  from "@/features/cms/types/block"
import type { PageContentMap } from "@/features/cms/types/page-content"
import type { SeoContent }     from "@/features/cms/types/block"
import { CmsBlockEditor }  from "./cms-block-editor"
import { CmsPreviewPanel } from "./cms-preview-panel"

interface CmsPageEditorProps {
  pageSlug:       string
  initialContent: PageContentMap
}

export function CmsPageEditor({ pageSlug, initialContent }: CmsPageEditorProps) {
  const blocks = getPageBlocks(pageSlug)

  const [activeBlockKey, setActiveBlockKey] = useState(blocks[0]?.key ?? "")
  const [previewValues, setPreviewValues]   = useState<Record<string, unknown>>(
    (initialContent[blocks[0]?.key ?? ""] ?? blocks[0]?.defaultValue ?? {}) as Record<string, unknown>
  )

  const [isPending, startTransition] = useTransition()

  const seoDefaults: SeoContent = {
    title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "",
    ...((initialContent[SEO_BLOCK_KEY] ?? {}) as Partial<SeoContent>),
  }

  const seoMethods = useForm({
    resolver: zodResolver(seoSchema) as any,
    defaultValues: seoDefaults,
  })

  function handleBlockChange(blockKey: string) {
    setActiveBlockKey(blockKey)
    setPreviewValues(
      (initialContent[blockKey] ?? blocks.find((b) => b.key === blockKey)?.defaultValue ?? {}) as Record<string, unknown>
    )
  }

  function onSeoSubmit(data: Record<string, unknown>) {
    startTransition(async () => {
      const result = await saveSeoContent(pageSlug, data)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  const SEO_FIELDS = [
    { key: "title" as const,         label: "Título SEO",      type: "text"     },
    { key: "description" as const,   label: "Descripción",     type: "textarea" },
    { key: "ogTitle" as const,       label: "OG Título",       type: "text"     },
    { key: "ogDescription" as const, label: "OG Descripción",  type: "textarea" },
    { key: "ogImage" as const,       label: "OG Imagen (URL)", type: "text"     },
    { key: "canonical" as const,     label: "URL Canónica",    type: "text"     },
  ]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4 overflow-y-auto">
        <Tabs defaultValue="contenido">
          <TabsList>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="contenido" className="space-y-4 mt-4">
            <div className="flex gap-2 flex-wrap">
              {blocks.map((block) => (
                <button
                  key={block.key}
                  type="button"
                  onClick={() => handleBlockChange(block.key)}
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium border transition-colors ${
                    activeBlockKey === block.key
                      ? "bg-dashboard-primary text-dashboard-primary-foreground border-dashboard-primary"
                      : "bg-background text-foreground border-input hover:bg-muted"
                  }`}
                >
                  {block.label}
                </button>
              ))}
            </div>

            {blocks.map((block) =>
              block.key === activeBlockKey ? (
                <CmsBlockEditor
                  key={block.key}
                  pageSlug={pageSlug}
                  block={block}
                  currentValues={(initialContent[block.key] ?? {}) as Record<string, unknown>}
                  onValuesChange={setPreviewValues}
                />
              ) : null
            )}
          </TabsContent>

          <TabsContent value="seo" className="mt-4">
            <FormProvider {...seoMethods}>
              <form onSubmit={seoMethods.handleSubmit(onSeoSubmit as any)} className="space-y-4">
                {SEO_FIELDS.map(({ key, label, type }) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key}>{label}</Label>
                    {type === "textarea" ? (
                      <Textarea id={key} {...seoMethods.register(key)} rows={3} />
                    ) : (
                      <Input id={key} {...seoMethods.register(key)} />
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center rounded-md bg-dashboard-primary text-dashboard-primary-foreground px-4 py-2 text-sm font-medium hover:bg-dashboard-primary/90 disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar SEO"}
                </button>
              </form>
            </FormProvider>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden xl:block">
        <p className="text-sm text-muted-foreground mb-2">Vista previa en tiempo real</p>
        <CmsPreviewPanel blockKey={activeBlockKey} values={previewValues} />
      </div>
    </div>
  )
}
