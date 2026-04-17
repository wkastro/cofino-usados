"use client"

import { useEffect, useTransition }       from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import type { Resolver }                  from "react-hook-form"
import { zodResolver }                    from "@hookform/resolvers/zod"
import { toast }                        from "sonner"
import { Label }                        from "@/features/dashboard/components/ui/label"
import type { BlockDefinition }         from "@/features/cms/types/block"
import { buildBlockSchema }             from "@/features/cms/validations/page-content"
import { saveBlockContent }             from "@/features/cms/actions/page-content.actions"
import { CmsFieldRenderer }             from "./cms-field-renderer"

interface CmsBlockEditorProps {
  pageSlug:       string
  block:          BlockDefinition
  currentValues:  Record<string, unknown>
  onValuesChange: (values: Record<string, unknown>) => void
}

function BlockFormWatcher({ onValuesChange }: { onValuesChange: (v: Record<string, unknown>) => void }) {
  const values = useWatch()
  useEffect(() => {
    onValuesChange(values as Record<string, unknown>)
  }, [values, onValuesChange])
  return null
}

export function CmsBlockEditor({
  pageSlug,
  block,
  currentValues,
  onValuesChange,
}: CmsBlockEditorProps) {
  const [isPending, startTransition] = useTransition()
  const schema  = buildBlockSchema(block.fields)
  const methods = useForm<Record<string, unknown>>({
    resolver:      zodResolver(schema) as Resolver<Record<string, unknown>>,
    defaultValues: { ...block.defaultValue, ...currentValues } as Record<string, unknown>,
  })

  function onSubmit(data: Record<string, unknown>) {
    startTransition(async () => {
      const result = await saveBlockContent(pageSlug, block.key, data)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  return (
    <FormProvider {...methods}>
      <BlockFormWatcher onValuesChange={onValuesChange} />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {block.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            {field.type !== "boolean" && (
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <CmsFieldRenderer field={field} name={field.key} />
          </div>
        ))}

        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : `Guardar ${block.label}`}
        </button>
      </form>
    </FormProvider>
  )
}
