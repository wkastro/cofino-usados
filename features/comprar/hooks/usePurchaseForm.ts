"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema, type PurchaseFormData } from "@/lib/validations/purchase";

export function usePurchaseForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      cardName: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      nit: "",
      acceptTerms: false as unknown as true,
      acceptNoRefund: false as unknown as true,
    },
  });

  const paymentMethod = watch("paymentMethod");

  function onSubmit(data: PurchaseFormData) {
    console.log("Purchase submitted:", data);
    // TODO: server action for payment processing
  }

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    paymentMethod,
    onSubmit,
  };
}
