"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { sucursalSchema, type SucursalInput } from "../validations/sucursal"
import { createSucursal, updateSucursal } from "../actions/sucursal.actions"
import type { Sucursal } from "../types/sucursal"

interface UseSucursalFormOptions {
  defaultValues?: Sucursal
  onSuccess?: () => void
}

export function useSucursalForm({ defaultValues, onSuccess }: UseSucursalFormOptions) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!defaultValues

  const form = useForm<SucursalInput>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      direccion: defaultValues?.direccion ?? "",
      latitud: defaultValues?.latitud ?? 0,
      longitud: defaultValues?.longitud ?? 0,
      maps: defaultValues?.maps ?? "",
      waze: defaultValues?.waze ?? "",
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const payload: SucursalInput = {
        nombre: data.nombre,
        direccion: data.direccion,
        latitud: data.latitud,
        longitud: data.longitud,
        maps: data.maps || undefined,
        waze: data.waze || undefined,
      }

      const result = isEditing
        ? await updateSucursal(defaultValues.id, payload)
        : await createSucursal(payload)

      if (result.ok) {
        toast.success(result.message)
        form.reset()
        onSuccess?.()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof SucursalInput, { message: messages[0] })
          }
        }
      }
    })
  })

  return { form, onSubmit, isPending, isEditing }
}
