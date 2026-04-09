"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { EstadoVenta, Transmision, Combustible, Traccion } from "@/generated/prisma/enums"
import { vehiculoSchema, type VehiculoInput } from "../validations/vehiculo"
import { createVehiculo, updateVehiculo } from "../actions/vehiculo.actions"
import type { VehiculoAdmin, ActionResult } from "../types/vehiculo"

const TOTAL_STEPS = 5

const STEP_FIELDS: Record<number, (keyof VehiculoInput)[]> = {
  0: ["nombre", "placa", "anio", "kilometraje"],
  1: ["transmision", "combustible", "traccion"],
  2: ["precio", "preciosiniva"],
  3: ["marcaId", "categoriaId", "sucursalId"],
  4: [],
}

interface UseVehiculoFormWizardOptions {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
}

export function useVehiculoFormWizard({ mode, vehiculo }: UseVehiculoFormWizardOptions) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(0)
  const isValidating = useRef(false)

  const form = useForm<VehiculoInput, unknown, VehiculoInput>({
    resolver: zodResolver(vehiculoSchema) as Resolver<VehiculoInput, unknown, VehiculoInput>,
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

  async function goNext() {
    if (isValidating.current) return
    isValidating.current = true
    try {
      const fields = STEP_FIELDS[currentStep]
      const valid = fields.length === 0 || (await form.trigger(fields))
      if (valid) setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    } finally {
      isValidating.current = false
    }
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      let result: ActionResult<unknown>
      if (mode === "create") {
        result = await createVehiculo(data)
      } else {
        if (!vehiculo) {
          toast.error("No se puede guardar: vehículo no encontrado.")
          return
        }
        result = await updateVehiculo(vehiculo.id, data)
      }

      if (result.ok) {
        toast.success(result.message)
        router.push("/dashboard/vehiculos")
      } else {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof VehiculoInput, { message: messages[0] })
          }
        }
      }
    })
  })

  return {
    form,
    onSubmit,
    isPending,
    currentStep,
    goNext,
    goPrev,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === TOTAL_STEPS - 1,
  }
}
