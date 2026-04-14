"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema, type PurchaseFormData } from "@/features/comprar/validations/purchase";

interface UsePurchaseFormReturn {
  form: UseFormReturn<PurchaseFormData>;
  paymentMethod: PurchaseFormData["paymentMethod"];
  onSubmit: (data: PurchaseFormData) => void;
}

export function usePurchaseForm(): UsePurchaseFormReturn {
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      cardName: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      nit: "",
      bankName: "",
      accountNumber: "",
      authNumber: "",
      receipt: undefined,
      acceptTerms: false as unknown as true,
      acceptNoRefund: false as unknown as true,
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  function onSubmit(data: PurchaseFormData) {
    console.log("Purchase submitted:", data);
    // TODO: server action for payment processing
  }

  return { form, paymentMethod, onSubmit };
}
