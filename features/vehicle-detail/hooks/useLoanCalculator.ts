import { useState, useMemo, useCallback } from "react";
import type { BancoItem, CuotaItem } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";

const DEFAULT_BANKS: readonly BancoItem[] = [
  { id: "bi",  nombre: "Banco Industrial"  },
  { id: "bac", nombre: "BAC Credomatic"    },
  { id: "gyt", nombre: "G&T Continental"   },
];

const DEFAULT_INSTALLMENT_OPTIONS: readonly number[] = [24, 60, 90];

const ANNUAL_RATE = 0.12;

interface UseLoanCalculatorReturn {
  bank:               string;
  installments:       string;
  monthlyPayment:     number | null;
  banks:              readonly BancoItem[];
  installmentOptions: readonly number[];
  onBankChange:       (value: string) => void;
  onInstallmentsChange: (value: string) => void;
}

export function useLoanCalculator(
  vehiclePrice:  number,
  bancosConfig?: BancoItem[],
  cuotasConfig?: CuotaItem[],
): UseLoanCalculatorReturn {
  const [bank, setBank]               = useState("");
  const [installments, setInstallments] = useState("");

  const banks = useMemo<readonly BancoItem[]>(
    () => {
      const valid = bancosConfig?.filter((b) => b.id && b.nombre)
      return valid?.length ? valid : DEFAULT_BANKS
    },
    [bancosConfig],
  );

  const installmentOptions = useMemo<readonly number[]>(
    () => cuotasConfig?.length
      ? cuotasConfig.map((c) => Number(c.meses)).filter((n) => !isNaN(n) && n > 0)
      : DEFAULT_INSTALLMENT_OPTIONS,
    [cuotasConfig],
  );

  const monthlyPayment = useMemo(() => {
    const months = parseInt(installments);
    if (!bank || !months) return null;

    const monthlyRate = ANNUAL_RATE / 12;
    const payment =
      (vehiclePrice * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(payment * 100) / 100;
  }, [bank, installments, vehiclePrice]);

  const onBankChange         = useCallback((value: string) => setBank(value), []);
  const onInstallmentsChange = useCallback((value: string) => setInstallments(value), []);

  return {
    bank,
    installments,
    monthlyPayment,
    banks,
    installmentOptions,
    onBankChange,
    onInstallmentsChange,
  };
}
