import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/forms/field-error";

interface PasswordFieldProps {
  id: string;
  label: React.ReactNode;
  placeholder?: string;
  showPassword: boolean;
  onToggle: () => void;
  inputProps?: React.ComponentProps<"input">;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  toggleClassName?: string;
  errorMessage?: string;
  errorClassName?: string;
}

export function PasswordField({
  id,
  label,
  placeholder,
  showPassword,
  onToggle,
  inputProps,
  containerClassName,
  labelClassName,
  inputClassName,
  toggleClassName,
  errorMessage,
  errorClassName,
}: PasswordFieldProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...inputProps}
          className={cn("pr-12", inputClassName, inputProps?.className)}
        />
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
            toggleClassName
          )}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <FieldError message={errorMessage} className={errorClassName} />
    </div>
  );
}
