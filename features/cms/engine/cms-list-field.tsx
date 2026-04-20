"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Label } from "@/features/dashboard/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/features/dashboard/components/ui/alert-dialog"
import type { FieldDefinition } from "@/features/cms/types/block"
import { CmsFieldRenderer } from "./cms-field-renderer"

interface SortableItemProps {
  id: string
  index: number
  name: string
  itemFields: FieldDefinition[]
  onRemove: () => void
}

function SortableItem({ id, index, name, itemFields, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-3 space-y-3 bg-background">
      <div className="flex items-center justify-between">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground select-none text-sm"
        >
          ⠿ Item {index + 1}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="text-sm text-destructive hover:text-destructive/80"
            >
              Eliminar
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este elemento?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción es irreversible. El elemento será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {itemFields.map((subField) => (
        <div key={subField.key} className="space-y-1">
          <Label>{subField.label}</Label>
          <CmsFieldRenderer field={subField} name={`${name}.${index}.${subField.key}`} />
        </div>
      ))}
    </div>
  )
}

interface CmsListFieldProps {
  field: FieldDefinition
  name: string
}

export function CmsListField({ field, name }: CmsListFieldProps) {
  const { control } = useFormContext()
  const { fields, append, remove, move } = useFieldArray({ control, name })
  const sensors = useSensors(useSensor(PointerSensor))

  const itemFields = field.itemFields ?? []
  const defaultItem = Object.fromEntries(itemFields.map((f) => [f.key, ""]))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = fields.findIndex((f) => f.id === active.id)
    const to = fields.findIndex((f) => f.id === over.id)
    if (from !== -1 && to !== -1) move(from, to)
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              index={index}
              name={name}
              itemFields={itemFields}
              onRemove={() => remove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => append(defaultItem)}
        className="inline-flex items-center gap-1 rounded-md border border-dashed border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground"
      >
        + Agregar {field.label}
      </button>
    </div>
  )
}
