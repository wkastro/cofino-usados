"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { especificacionSchema, type EspecificacionInput } from "../validations/especificacion"
import { createEspecificacion, updateEspecificacion } from "../actions/especificaciones.actions"
import { generateEspecificacionSlug } from "../lib/slug"
import type { EspecificacionTipo, Especificacion } from "../types/especificacion"

interface UseEspecificacionFormOptions {
  tipo: EspecificacionTipo
  defaultValues?: Especificacion
  onSuccess?: () => void
}

export function useEspecificacionForm({
  tipo,
  defaultValues,
  onSuccess,
}: UseEspecificacionFormOptions) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!defaultValues

  const form = useForm<EspecificacionInput>({
    resolver: zodResolver(especificacionSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      slug: defaultValues?.slug ?? "",
    },
  })

  function handleNombreChange(value: string) {
    form.setValue("nombre", value, { shouldValidate: true })
    if (!isEditing) {
      form.setValue("slug", generateEspecificacionSlug(value), { shouldValidate: true })
    }
  }

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = isEditing
        ? await updateEspecificacion(tipo, defaultValues.id, data)
        : await createEspecificacion(tipo, data)

      if (result.ok) {
        toast.success(result.message)
        form.reset({ nombre: "", slug: "" })
        onSuccess?.()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof EspecificacionInput, { message: messages[0] })
          }
        }
      }
    })
  })

  return { form, onSubmit, isPending, handleNombreChange, isEditing }
}
