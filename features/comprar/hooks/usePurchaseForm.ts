"use client";

import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema, type PurchaseFormData } from "@/features/comprar/validations/purchase";

interface UsePurchaseFormReturn {
  register: UseFormRegister<PurchaseFormData>;
  control: Control<PurchaseFormData>;
  handleSubmit: UseFormHandleSubmit<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  isSubmitting: boolean;
  paymentMethod: PurchaseFormData["paymentMethod"];
  onSubmit: (data: PurchaseFormData) => void;
}

export function usePurchaseForm(): UsePurchaseFormReturn {
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
      bankName: "",
      accountNumber: "",
      authNumber: "",
      receipt: undefined,
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
