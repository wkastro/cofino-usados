"use client"

import { useRef, useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver, type UseFormReturn, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { vehiculoSchema, type VehiculoInput } from "../validations/vehiculo"
import { createVehiculo, updateVehiculo } from "../actions/vehiculo.actions"
import type { VehiculoAdmin, ActionResult, GaleriaItem } from "../types/vehiculo"

const TOTAL_STEPS = 5

const STEP_FIELDS: Record<number, (keyof VehiculoInput)[]> = {
  0: ["nombre", "placa", "codigo", "anio", "kilometraje", "motor", "color_exterior", "color_interior", "descripcion"],
  1: ["transmisionId", "combustibleId", "traccionId", "estadoId"],
  2: ["precio", "preciodescuento"],
  3: ["marcaId", "categoriaId", "sucursalId", "etiquetaComercialId"],
  4: [],
}

const STEP_LABELS: Record<number, string> = {
  0: "Info General",
  1: "Especificaciones",
  2: "Precios",
  3: "Clasificación",
  4: "Galería",
}

function findFirstStepWithErrors(errorFields: string[]): number {
  for (let step = 0; step < TOTAL_STEPS; step++) {
    if (STEP_FIELDS[step].some((f) => errorFields.includes(f))) return step
  }
  return 0
}

function buildErrorToast(errors: FieldErrors<VehiculoInput>): string {
  const messages = (Object.values(errors) as Array<{ message?: string } | undefined>)
    .map((e) => e?.message)
    .filter((m): m is string => !!m)
    .slice(0, 3)
  return messages.length ? messages.join(" · ") : "Completa los campos requeridos"
}

interface UseVehiculoFormWizardOptions {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
  initialStep?: number
  getGaleria?: () => { portada: string | null; images: GaleriaItem[] }
}

interface UseVehiculoFormWizardReturn {
  form: UseFormReturn<VehiculoInput, unknown, VehiculoInput>
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  isPending: boolean
  currentStep: number
  goNext: () => Promise<void>
  goPrev: () => void
  isFirstStep: boolean
  isLastStep: boolean
  notifyPlacaDuplicada: (duplicada: boolean) => void
}

export function useVehiculoFormWizard({
  mode,
  vehiculo,
  initialStep = 0,
  getGaleria,
}: UseVehiculoFormWizardOptions): UseVehiculoFormWizardReturn {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(initialStep)
  const isValidating = useRef(false)
  const placaDuplicadaRef = useRef(false)

  const form = useForm<VehiculoInput, unknown, VehiculoInput>({
    resolver: zodResolver(vehiculoSchema) as Resolver<VehiculoInput, unknown, VehiculoInput>,
    defaultValues: {
      nombre: vehiculo?.nombre ?? "",
      codigo: vehiculo?.codigo ?? "",
      placa: vehiculo?.placa ?? "",
      precio: vehiculo?.precio ?? 0,
      preciodescuento: vehiculo?.preciodescuento ?? null,
      kilometraje: vehiculo?.kilometraje ?? 0,
      motor: vehiculo?.motor ?? "",
      anio: vehiculo?.anio ?? new Date().getFullYear(),
      estadoId: vehiculo?.estadoId ?? "",
      transmisionId: vehiculo?.transmisionId ?? "",
      combustibleId: vehiculo?.combustibleId ?? "",
      traccionId: vehiculo?.traccionId ?? "",
      color_interior: vehiculo?.color_interior ?? "",
      color_exterior: vehiculo?.color_exterior ?? "",
      descripcion: vehiculo?.descripcion ?? "",
      marcaId: vehiculo?.marcaId ?? "",
      sucursalId: vehiculo?.sucursalId ?? "",
      categoriaId: vehiculo?.categoriaId ?? "",
      etiquetaComercialId: vehiculo?.etiquetaComercialId ?? "",
    },
  })

  function notifyPlacaDuplicada(duplicada: boolean) {
    placaDuplicadaRef.current = duplicada
  }

  async function goNext() {
    if (isValidating.current) return
    isValidating.current = true
    try {
      const fields = STEP_FIELDS[currentStep]
      const rhfValid = fields.length === 0 || (await form.trigger(fields))
      const placaOk = currentStep !== 0 || !placaDuplicadaRef.current
      if (rhfValid && placaOk) setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    } finally {
      isValidating.current = false
    }
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = form.handleSubmit(
    (data) => {
      startTransition(async () => {
        let result: ActionResult<{ id: string; slug: string } | undefined>
        if (mode === "create") {
          const galeria = getGaleria?.()
          result = await createVehiculo(data, galeria)
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
          if (result.fieldErrors) {
            const errorFields = Object.keys(result.fieldErrors)
            const firstStep = findFirstStepWithErrors(errorFields)
            setCurrentStep(firstStep)
            toast.error(`Corrige los errores en "${STEP_LABELS[firstStep]}"`)
          } else {
            toast.error(result.message)
          }
        }
      })
    },
    (errors) => {
      const errorFields = Object.keys(errors)
      const firstStep = findFirstStepWithErrors(errorFields)
      setCurrentStep(firstStep)
      toast.error(buildErrorToast(errors))
    },
  )

  return {
    form,
    onSubmit,
    isPending,
    currentStep,
    goNext,
    goPrev,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === TOTAL_STEPS - 1,
    notifyPlacaDuplicada,
  }
}
