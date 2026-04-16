"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/features/dashboard/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/card";
import { useVehiculoFormWizard } from "../../hooks/useVehiculoFormWizard";
import { Stepper } from "./stepper";
import { StepInfoGeneral } from "./steps/step-info-general";
import { StepEspecificaciones } from "./steps/step-especificaciones";
import { StepPrecios } from "./steps/step-precios";
import { StepClasificacion } from "./steps/step-clasificacion";
import { StepGaleria } from "./steps/step-galeria";
import type {
  VehiculoAdmin,
  VehiculoRelationOptions,
} from "../../types/vehiculo";

const STEPS = [
  {
    label: "Info General",
    description: "Información básica e identificación del vehículo.",
  },
  {
    label: "Especificaciones",
    description: "Transmisión, combustible, tracción y estado.",
  },
  { label: "Precios", description: "Precios con y sin IVA." },
  {
    label: "Clasificación",
    description: "Marca, categoría, sucursal y etiqueta comercial.",
  },
  { label: "Galería", description: "Imágenes del vehículo." },
];

interface VehiculoFormProps {
  mode: "create" | "edit";
  vehiculo?: VehiculoAdmin;
  options: VehiculoRelationOptions;
  initialStep?: number;
}

export function VehiculoForm({
  mode,
  vehiculo,
  options,
  initialStep,
}: VehiculoFormProps) {
  const {
    form,
    onSubmit,
    isPending,
    currentStep,
    goNext,
    goPrev,
    isFirstStep,
    isLastStep,
  } = useVehiculoFormWizard({ mode, vehiculo, initialStep });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            asChild
          >
            <Link href="/dashboard/vehiculos">
              <ArrowLeftIcon className="size-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <Link
            href="/dashboard/vehiculos"
            className="hover:text-foreground transition-colors"
          >
            Vehículos
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {mode === "create"
              ? "Nuevo vehículo"
              : (vehiculo?.nombre ?? "Editar")}
          </span>
        </div>
      </div>

      {/* Stepper */}
      <Stepper steps={STEPS.map((s) => s.label)} currentStep={currentStep} />

      {/* Step Card */}
      <form>
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  {STEPS[currentStep].label}
                </CardTitle>
                <CardDescription className="mt-0.5 text-sm">
                  {STEPS[currentStep].description}
                </CardDescription>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                {currentStep + 1} / {STEPS.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {currentStep === 0 && (
              <StepInfoGeneral register={register} errors={errors} />
            )}
            {currentStep === 1 && (
              <StepEspecificaciones
                control={control}
                errors={errors}
                transmisiones={options.transmisiones}
                combustibles={options.combustibles}
                tracciones={options.tracciones}
                estados={options.estados}
              />
            )}
            {currentStep === 2 && (
              <StepPrecios register={register} errors={errors} />
            )}
            {currentStep === 3 && (
              <StepClasificacion
                control={control}
                errors={errors}
                options={options}
              />
            )}
            {currentStep === 4 && (
              <StepGaleria
                vehiculoId={vehiculo?.id ?? null}
                initialImages={vehiculo?.galeria ?? []}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={isFirstStep}
          >
            <ArrowLeftIcon className="mr-1 size-4" />
            Anterior
          </Button>
          {isLastStep ? (
            <Button type="button" onClick={onSubmit} disabled={isPending}>
              {isPending
                ? mode === "create"
                  ? "Creando..."
                  : "Guardando..."
                : mode === "create"
                  ? "Crear vehículo"
                  : "Guardar cambios"}
            </Button>
          ) : (
            <Button type="button" onClick={() => void goNext()}>
              Siguiente
              <ArrowRightIcon className="ml-1 size-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
