"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/features/dashboard/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Pasos del formulario" className="w-full">
      {/* Mobile: compact progress bar + label */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">{steps[currentStep]}</span>
          <span className="tabular-nums text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step list */}
      <ol className="hidden sm:flex items-start">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          return (
            <li
              key={label}
              aria-current={isActive ? "step" : undefined}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                {/* Circle */}
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ring-2 ring-offset-background",
                    isCompleted &&
                      "bg-primary text-primary-foreground ring-primary",
                    isActive &&
                      "bg-background text-primary ring-primary",
                    !isCompleted &&
                      !isActive &&
                      "bg-muted text-muted-foreground ring-transparent",
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap transition-colors",
                    isActive && "text-foreground",
                    isCompleted && "text-primary",
                    !isCompleted && !isActive && "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-px flex-1 self-start transition-colors",
                    index < currentStep ? "bg-primary" : "bg-muted",
                  )}
                  style={{ marginTop: "0.875rem" }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
