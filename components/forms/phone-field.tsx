import * as React from "react";
import {
  Control,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/field-error";
import { cn } from "@/lib/utils";

interface PhoneCodeOption {
  value: string;
  label: string;
}

interface PhoneFieldProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  phoneCodeName: Path<T>;
  phoneName: Path<T>;
  phoneRegisterOptions?: Parameters<UseFormRegister<T>>[1];
  phoneCodeOptions: PhoneCodeOption[];
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  selectTriggerClassName?: string;
  inputClassName?: string;
  inputPlaceholder?: string;
  errorMessage?: string;
  errorClassName?: string;
}

export function PhoneField<T extends FieldValues>({
  control,
  register,
  phoneCodeName,
  phoneName,
  phoneRegisterOptions,
  phoneCodeOptions,
  label,
  labelClassName,
  containerClassName,
  selectTriggerClassName,
  inputClassName,
  inputPlaceholder,
  errorMessage,
  errorClassName,
}: PhoneFieldProps<T>) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <Label htmlFor={phoneName} className={labelClassName}>
          {label}
        </Label>
      ) : null}
      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name={phoneCodeName}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn("w-24 shrink-0", selectTriggerClassName)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {phoneCodeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          id={phoneName}
          placeholder={inputPlaceholder}
          {...register(phoneName, phoneRegisterOptions)}
          className={inputClassName}
        />
      </div>
      <FieldError message={errorMessage} className={errorClassName} />
    </div>
  );
}
