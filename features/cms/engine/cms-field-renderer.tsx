"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Input }    from "@/features/dashboard/components/ui/input"
import { Textarea } from "@/features/dashboard/components/ui/textarea"
import { Switch }   from "@/features/dashboard/components/ui/switch"
import { Label }    from "@/features/dashboard/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/select"
import type { FieldDefinition } from "@/features/cms/types/block"
import { CmsS3Field }   from "./cms-s3-field"
import { CmsListField } from "./cms-list-field"

interface CmsFieldRendererProps {
  field: FieldDefinition
  name: string
}

export function CmsFieldRenderer({ field, name }: CmsFieldRendererProps) {
  const { register, control } = useFormContext()

  if (field.type === "s3-image" || field.type === "s3-video" || field.type === "s3-document") {
    return <CmsS3Field field={field} name={name} />
  }

  if (field.type === "list") {
    return <CmsListField field={field} name={name} />
  }

  if (field.type === "boolean") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: f }) => (
          <div className="flex items-center gap-2">
            <Switch checked={!!f.value} onCheckedChange={f.onChange} id={name} />
            <Label htmlFor={name}>{field.label}</Label>
          </div>
        )}
      />
    )
  }

  if (field.type === "select" && field.options) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: f }) => (
          <Select value={f.value ?? ""} onValueChange={f.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Seleccionar ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options!.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    )
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <Textarea
        {...register(name)}
        placeholder={field.label}
        rows={field.type === "richtext" ? 6 : 3}
      />
    )
  }

  return (
    <Input
      {...register(name, { valueAsNumber: field.type === "number" })}
      type={
        field.type === "number" ? "number" :
        field.type === "color"  ? "color"  :
        field.type === "date"   ? "date"   :
        "text"
      }
      placeholder={field.label}
    />
  )
}
