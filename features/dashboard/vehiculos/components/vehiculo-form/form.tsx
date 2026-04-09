"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/features/dashboard/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/card"
import { useVehiculoFormWizard } from "../../hooks/useVehiculoFormWizard"
import { Stepper } from "./stepper"
import { StepInfoGeneral } from "./steps/step-info-general"
import { StepEspecificaciones } from "./steps/step-especificaciones"
import { StepPrecios } from "./steps/step-precios"
import { StepClasificacion } from "./steps/step-clasificacion"
import { StepGaleria } from "./steps/step-galeria"
import { localUrlAdapter } from "./upload-adapter"
import type { VehiculoAdmin, VehiculoRelationOptions } from "../../types/vehiculo"

const STEP_LABELS = ["Info General", "Especificaciones", "Precios", "Clasificación", "Galería"]

const STEP_DESCRIPTIONS: Record<number, string> = {
  0: "Información básica e identificación del vehículo.",
  1: "Transmisión, combustible, tracción y estado.",
  2: "Precios con y sin IVA.",
  3: "Marca, categoría, sucursal y etiqueta comercial.",
  4: "Imágenes del vehículo.",
}

interface VehiculoFormProps {
  mode: "create" | "edit"
  vehiculo?: VehiculoAdmin
  options: VehiculoRelationOptions
}

export function VehiculoForm({ mode, vehiculo, options }: VehiculoFormProps) {
  const {
    form,
    onSubmit,
    isPending,
    currentStep,
    goNext,
    goPrev,
    isFirstStep,
    isLastStep,
  } = useVehiculoFormWizard({ mode, vehiculo })

  const { register, control, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/vehiculos">
            <ArrowLeftIcon className="size-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Nuevo vehículo" : `Editar: ${vehiculo?.nombre}`}
        </h1>
      </div>

      {/* Stepper */}
      <Stepper steps={STEP_LABELS} currentStep={currentStep} />

      {/* Step Card */}
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{STEP_LABELS[currentStep]}</CardTitle>
            <CardDescription>{STEP_DESCRIPTIONS[currentStep]}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <StepInfoGeneral register={register} errors={errors} />
            )}
            {currentStep === 1 && (
              <StepEspecificaciones control={control} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepPrecios register={register} errors={errors} />
            )}
            {currentStep === 3 && (
              <StepClasificacion control={control} errors={errors} options={options} />
            )}
            {currentStep === 4 && (
              <StepGaleria
                vehiculoId={vehiculo?.id ?? null}
                initialImages={vehiculo?.galeria ?? []}
                adapter={localUrlAdapter}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={isFirstStep}
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Anterior
          </Button>
          {isLastStep ? (
            <Button type="submit" disabled={isPending}>
              {isPending
                ? mode === "create" ? "Creando..." : "Guardando..."
                : mode === "create" ? "Crear vehículo" : "Guardar cambios"}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Siguiente
              <ArrowRightIcon className="size-4 ml-1" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
