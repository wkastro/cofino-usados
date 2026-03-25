import { useState, useMemo, useCallback } from "react";

const BANKS = [
  { id: "bi", nombre: "Banco Industrial" },
  { id: "banrural", nombre: "Banrural" },
  { id: "bac", nombre: "BAC Credomatic" },
  { id: "gyt", nombre: "G&T Continental" },
  { id: "interbanco", nombre: "Interbanco" },
];

const INSTALLMENT_OPTIONS = [12, 24, 36, 48, 60, 72];

const ANNUAL_RATE = 0.12;

export function useLoanCalculator(vehiclePrice: number) {
  const [bank, setBank] = useState("");
  const [installments, setInstallments] = useState("");

  const monthlyPayment = useMemo(() => {
    const months = parseInt(installments);
    if (!bank || !months) return null;

    const monthlyRate = ANNUAL_RATE / 12;
    const payment =
      (vehiclePrice * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(payment * 100) / 100;
  }, [bank, installments, vehiclePrice]);

  const onBankChange = useCallback((value: string) => setBank(value), []);
  const onInstallmentsChange = useCallback(
    (value: string) => setInstallments(value),
    [],
  );

  return {
    bank,
    installments,
    monthlyPayment,
    banks: BANKS,
    installmentOptions: INSTALLMENT_OPTIONS,
    onBankChange,
    onInstallmentsChange,
  };
}
