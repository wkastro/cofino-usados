"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/enums"
import { vehiculoSchema, type VehiculoInput } from "../validations/vehiculo"
import { createVehiculo, updateVehiculo } from "../actions/vehiculo.actions"
import type { VehiculoAdmin, ActionResult } from "../types/vehiculo"

interface UseVehiculoFormOptions {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
}

export function useVehiculoForm({ mode, vehiculo }: UseVehiculoFormOptions) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // zodResolver infers Input/Output from the schema; no explicit generic needed
  const form = useForm({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      nombre: vehiculo?.nombre ?? "",
      codigo: vehiculo?.codigo ?? "",
      placa: vehiculo?.placa ?? "",
      precio: vehiculo?.precio ?? 0,
      preciosiniva: vehiculo?.preciosiniva ?? 0,
      kilometraje: vehiculo?.kilometraje ?? 0,
      motor: vehiculo?.motor ?? "",
      anio: vehiculo?.anio ?? new Date().getFullYear(),
      estado: vehiculo?.estado ?? EstadoVenta.Disponible,
      transmision: vehiculo?.transmision ?? Transmision.Automatico,
      combustible: vehiculo?.combustible ?? Combustible.Gasolina,
      traccion: vehiculo?.traccion ?? Traccion.T4X2,
      color_interior: vehiculo?.color_interior ?? "",
      color_exterior: vehiculo?.color_exterior ?? "",
      descripcion: vehiculo?.descripcion ?? "",
      marcaId: vehiculo?.marcaId ?? "",
      sucursalId: vehiculo?.sucursalId ?? "",
      categoriaId: vehiculo?.categoriaId ?? "",
      etiquetaComercialId: vehiculo?.etiquetaComercialId ?? null,
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      // data is already validated/transformed by zodResolver
      let result: ActionResult<unknown>
      if (mode === "create") {
        result = await createVehiculo(data as VehiculoInput)
      } else {
        if (!vehiculo) {
          toast.error("No se puede guardar: vehículo no encontrado.")
          return
        }
        result = await updateVehiculo(vehiculo.id, data as VehiculoInput)
      }

      if (result.ok) {
        toast.success(result.message)
        router.push("/dashboard/vehiculos")
        router.refresh()
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof VehiculoInput, {
              message: messages[0],
            })
          }
        }
      }
    })
  })

  return { form, onSubmit, isPending }
}
