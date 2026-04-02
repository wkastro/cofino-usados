"use client";

import { type Control, Controller } from "react-hook-form";
import { CreditCard, Building2 } from "lucide-react";
import type { PurchaseFormData } from "@/features/comprar/validations/purchase";

interface PaymentMethodTabsProps {
  control: Control<PurchaseFormData>;
}

const TABS = [
  { value: "card" as const, label: "Tarjeta de credito / debito", icon: CreditCard },
  { value: "transfer" as const, label: "Transferencia bancaria", icon: Building2 },
];

export function PaymentMethodTabs({ control }: PaymentMethodTabsProps) {
  return (
    <Controller
      control={control}
      name="paymentMethod"
      render={({ field }) => (
        <div className="flex rounded-full bg-gray-200 p-1">
          {TABS.map((tab) => {
            const isActive = field.value === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => field.onChange(tab.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? "bg-brand-dark text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.value === "card" ? "Tarjeta" : "Transferencia"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
