import { useMemo } from "react";

const MONTHLY_RATE = 0.0025;

interface UseMonthlyPaymentReturn {
  monthlyPayment: number;
}

export function useMonthlyPayment(price: number): UseMonthlyPaymentReturn {
  const monthlyPayment = useMemo(
    () => Math.round(price * MONTHLY_RATE),
    [price],
  );

  return { monthlyPayment };
}
