"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters/vehicle";
import { useLoanCalculator } from "../hooks/useLoanCalculator";
import type { BancoItem, CuotaItem } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";

// js-cache-function-results: hoist formatter to module level
const loanFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface LoanCalculatorProps {
  vehiclePrice: number;
  titulo?:      string;
  descripcion?: string;
  bancos?:      BancoItem[];
  cuotas?:      CuotaItem[];
}

export function LoanCalculator({ vehiclePrice, titulo, descripcion, bancos, cuotas }: LoanCalculatorProps) {
  const {
    bank,
    installments,
    monthlyPayment,
    banks,
    installmentOptions,
    onBankChange,
    onInstallmentsChange,
  } = useLoanCalculator(vehiclePrice, bancos, cuotas);

  return (
    <div id="calculadora" className="rounded-2xl bg-white p-6 md:p-8 flex flex-col items-center text-center md:justify-center">
      <h2 className="text-fs-lg font-semibold font-clash-display tracking-tight">
        {titulo ?? "¿Deseas calcular tus cuotas?"}
      </h2>
      <p className="text-muted-foreground mt-1">
        {descripcion ?? "Ingresa la siguiente información para calcular."}
      </p>

      <div className="w-full mt-6 flex flex-col gap-5 text-left">
        {/* Bank select */}
        <div className="flex flex-col gap-2">
          <Label className="text-fs-base font-semibold">Banco</Label>
          <Select value={bank} onValueChange={onBankChange}>
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder="Selecciona un banco" />
            </SelectTrigger>
            <SelectContent position="popper">
              {banks.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Installments select */}
        <div className="flex flex-col gap-2">
          <Label className="text-fs-base font-semibold">
            Cantidad de cuotas
          </Label>
          <Select value={installments} onValueChange={onInstallmentsChange}>
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder="Seleccione la cantidad de cuotas" />
            </SelectTrigger>
            <SelectContent position="popper">
              {installmentOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option} meses
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Result */}
      <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
        <span className="text-fs-base font-semibold">Total a financiar</span>
        <span className="bg-btn-black inline-block text-fs-base">
          {monthlyPayment
            ? `Q ${loanFormatter.format(monthlyPayment)}/mes`
            : `${formatCurrency(0)}/mes`}
        </span>
      </div>
    </div>
  );
}
