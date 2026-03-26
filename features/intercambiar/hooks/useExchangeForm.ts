import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  exchangeSchema,
  EXCHANGE_STEP_1_FIELDS,
} from "@/lib/validations/exchange";
import type { ExchangeFormData } from "@/lib/validations/exchange";

export function useExchangeForm() {
  const [step, setStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      placa: "",
      anio: "",
      marca: "",
      modelo: "",
      kilometraje: "",
      color: "",
      wantsExchange: false,
      exchangeVehicle: "",
      fullName: "",
      email: "",
      phoneCode: "+502",
      phone: "",
      expectedPrice: "",
    },
  });

  const wantsExchange = watch("wantsExchange");
  const selectedBrand = watch("marca");

  async function handleNext() {
    const valid = await trigger([...EXCHANGE_STEP_1_FIELDS]);
    if (valid) setStep(1);
  }

  function onSubmit(_data: ExchangeFormData) {
    // TODO: implement server action for exchange form submission
  }

  return {
    register,
    control,
    handleSubmit,
    errors,
    step,
    setStep,
    wantsExchange,
    selectedBrand,
    handleNext,
    onSubmit,
  };
}
