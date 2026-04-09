# Spec: Vehiculo Form Wizard

**Date:** 2026-04-09
**Status:** Approved

## Overview

Rediseño del formulario de crear/editar vehículo como un wizard multi-paso con validación por paso y submit único al final. Aplica tanto al modo `create` como `edit`.

## Steps

| # | Nombre | Campos validados al avanzar |
|---|--------|-----------------------------|
| 1 | Info General | nombre, placa, anio, kilometraje |
| 2 | Especificaciones | transmision, combustible, traccion |
| 3 | Precios | precio, preciosiniva |
| 4 | Clasificación | marcaId, categoriaId, sucursalId |
| 5 | Galería | (opcional, no bloquea avance) |

Campos opcionales (motor, colores, descripcion, etiqueta, codigo) no bloquean el avance en ningún paso.

## Architecture

### State Management

Se extiende el hook `useVehiculoForm.ts` a `useVehiculoFormWizard` (mismo archivo o nuevo archivo, mismo schema Zod). Agrega:

- `currentStep: number` (0–4)
- `goNext()` — llama `form.trigger(camposDelPaso)`, avanza solo si todos pasan
- `goPrev()` — retrocede sin validar
- `isFirstStep`, `isLastStep` — helpers para botones de navegación

El submit (`onSubmit`) sigue siendo idéntico al actual, llamado únicamente desde el último paso.

### File Structure

```
features/dashboard/vehiculos/
  hooks/
    useVehiculoFormWizard.ts        # Nuevo (extiende useVehiculoForm)
  components/
    vehiculo-form/
      form.tsx                      # Rediseño completo — monta el wizard
      stepper.tsx                   # Componente visual del stepper (nuevo)
      steps/
        step-info-general.tsx       # Paso 1
        step-especificaciones.tsx   # Paso 2
        step-precios.tsx            # Paso 3
        step-clasificacion.tsx      # Paso 4
        step-galeria.tsx            # Paso 5 (reemplaza galeria-manager en el wizard)
      upload-adapter.ts             # Interfaz UploadAdapter + LocalUrlAdapter
```

## Validation Per Step

`goNext()` usa `form.trigger(fields)` con los campos del paso actual. Si algún campo falla, los errores se muestran inline y el stepper no avanza. Ejemplo:

```ts
const STEP_FIELDS: Record<number, (keyof VehiculoInput)[]> = {
  0: ["nombre", "placa", "anio", "kilometraje"],
  1: ["transmision", "combustible", "traccion"],
  2: ["precio", "preciosiniva"],
  3: ["marcaId", "categoriaId", "sucursalId"],
  4: [], // galería no bloquea
}
```

## Gallery & Upload Abstraction

```ts
interface UploadAdapter {
  upload(file: File): Promise<{ url: string }>
}
```

- `LocalUrlAdapter` — implementación actual: pide URL manual (sin cambio de comportamiento)
- `S3Adapter` — futura implementación, solo hay que swapear el adapter en `step-galeria.tsx`

Comportamiento por modo:
- **create**: imágenes se guardan después del submit principal (vehículo creado primero, imágenes asociadas después) — igual que hoy
- **edit**: galería opera en tiempo real (add/remove/reorder) — igual que hoy

## UI Components

Solo componentes ya disponibles en `features/dashboard/components/ui/`:

- `Separator` — línea entre pasos en el stepper
- `Badge` — número de paso (filled=activo, outline+check=completado, ghost=pendiente)
- `Button` — navegación Anterior / Siguiente / Guardar
- `Card`, `CardHeader`, `CardContent` — contenedor del paso actual
- `Progress` — barra de progreso opcional debajo del stepper

### Stepper Layout

```
[1]───────[2]───────[3]───────[4]───────[5]
Info   Specs    Precios   Clasif.   Galería

┌─────────────────────────────────────────┐
│ Card con el contenido del paso actual   │
└─────────────────────────────────────────┘

[← Anterior]                  [Siguiente →]
                        (último paso: [Guardar])
```

Labels de campos: texto pequeño uppercase sobre el input, estilo limpio sin CardTitle por campo.

## Out of Scope

- Navegación no-lineal entre pasos (no se puede saltar)
- Guardado automático de borrador entre pasos
- S3 integration (solo interfaz preparada)
