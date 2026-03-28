const MONTHLY_RATE = 0.0025;

interface UseMonthlyPaymentReturn {
  monthlyPayment: number;
}

// rerender-simple-expression-in-memo: simple multiplication doesn't need useMemo
export function useMonthlyPayment(price: number): UseMonthlyPaymentReturn {
  const monthlyPayment = Math.round(price * MONTHLY_RATE);

  return { monthlyPayment };
}
