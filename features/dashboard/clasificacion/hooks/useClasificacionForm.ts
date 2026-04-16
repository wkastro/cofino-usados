"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { clasificacionSchema, type ClasificacionInput } from "../validations/clasificacion"
import { createClasificacion, updateClasificacion } from "../actions/clasificacion.actions"
import { generateClasificacionSlug } from "../lib/slug"
import type { ClasificacionTipo, Clasificacion } from "../types/clasificacion"

interface UseClasificacionFormOptions {
  tipo: ClasificacionTipo
  defaultValues?: Clasificacion
  onSuccess?: () => void
}

export function useClasificacionForm({
  tipo,
  defaultValues,
  onSuccess,
}: UseClasificacionFormOptions) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!defaultValues

  const form = useForm<ClasificacionInput>({
    resolver: zodResolver(clasificacionSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      slug: defaultValues?.slug ?? "",
    },
  })

  function handleNombreChange(value: string) {
    form.setValue("nombre", value, { shouldValidate: true })
    if (!isEditing) {
      form.setValue("slug", generateClasificacionSlug(value), { shouldValidate: true })
    }
  }

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = isEditing
        ? await updateClasificacion(tipo, defaultValues.id, data)
        : await createClasificacion(tipo, data)

      if (result.ok) {
        toast.success(result.message)
        form.reset({ nombre: "", slug: "" })
        onSuccess?.()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof ClasificacionInput, { message: messages[0] })
          }
        }
      }
    })
  })

  return { form, onSubmit, isPending, handleNombreChange, isEditing }
}
