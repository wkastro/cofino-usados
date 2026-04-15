# Galería — Eliminar con confirmación + Drag-and-drop

**Fecha:** 2026-04-15  
**Branch:** file-upload  
**Archivo principal:** `features/dashboard/vehiculos/components/vehiculo-form/steps/step-galeria.tsx`

---

## Resumen

Dos mejoras al componente `StepGaleria` del dashboard:

1. **Botón eliminar mejorado + AlertDialog de confirmación** — El botón destructivo en el hover overlay recibe mejor contraste y tamaño; al hacer clic abre un `AlertDialog` de shadcn antes de ejecutar `removeGaleriaImage`.
2. **Drag-and-drop para reordenar** — Reemplaza el botón `ArrowUp` con `@dnd-kit/sortable`, usando un handle `GripVertical` en el overlay. Al soltar llama a `reorderGaleriaImages`.

---

## Componentes afectados

| Archivo | Cambio |
|---|---|
| `features/dashboard/components/ui/alert-dialog.tsx` | Nuevo — instalar con shadcn CLI |
| `features/dashboard/vehiculos/components/vehiculo-form/steps/step-galeria.tsx` | Refactor principal |

---

## Diseño detallado

### 1. AlertDialog de confirmación

- Instalar `alert-dialog` con `npx shadcn@latest add alert-dialog --path features/dashboard/components/ui`
- Estado local `imageToDelete: GaleriaItem | null` controla qué imagen está pendiente de confirmar
- Clic en TrashIcon → `setImageToDelete(img)` (abre el dialog)
- Confirmar → `handleRemove(imageToDelete.id)` + `setImageToDelete(null)`
- Cancelar → `setImageToDelete(null)`
- El AlertDialog vive fuera del grid, controlado por `open={imageToDelete !== null}`

### 2. UI del botón eliminar

- Mantener posición actual (hover overlay, misma zona)
- Aumentar `size` a `size-8` (de `size-7`)
- Usar `variant="destructive"` con `className` explícito para fondo rojo sólido: `bg-destructive hover:bg-destructive/90 text-white`
- Ícono `TrashIcon` a `size-4` (de `size-3`)

### 3. Drag-and-drop con @dnd-kit/sortable

- Envolver el grid con `<DndContext>` + `<SortableContext items={images.map(i => i.id)}>`
- Cada card pasa a ser un componente `SortableGaleriaItem` con `useSortable(id)`
- Handle: botón con `GripVertical` (size-4) en el overlay junto al botón eliminar, con `{...attributes} {...listeners}` del hook `useSortable`
- `onDragEnd`: recalcular orden con `arrayMove` de `@dnd-kit/sortable`, actualizar estado local optimista, luego llamar `reorderGaleriaImages`
- Rollback optimista si la acción falla (igual que el `handleMoveUp` actual)
- Eliminar `handleMoveUp` y el botón `ArrowUpIcon`

### 4. Interacción hover overlay

El overlay mantiene su comportamiento actual (`opacity-0 group-hover:opacity-100`). Contendrá:
- `GripVertical` handle (izquierda)
- `TrashIcon` button (derecha)

---

## Dependencias

- `@dnd-kit/core` ✅ ya instalado
- `@dnd-kit/sortable` ✅ ya instalado  
- `@dnd-kit/modifiers` ✅ ya instalado
- `alert-dialog` shadcn component — instalar

---

## Comportamiento edge cases

- **Imagen `pending-*`** (sin vehiculoId): elimina directo de estado local sin dialog (ya no hay reversibilidad posible)
- **`isBusy`**: handle de drag deshabilitado mientras hay upload o transición pendiente
- **Una sola imagen**: handle visible pero no hay efecto al soltar (arrayMove no cambia nada)
