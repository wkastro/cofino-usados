import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  exchangeSchema,
  EXCHANGE_STEP_1_FIELDS,
} from "@/lib/validations/exchange";
import type { ExchangeFormData } from "@/lib/validations/exchange";

interface UseExchangeFormReturn {
  register: UseFormRegister<ExchangeFormData>;
  control: Control<ExchangeFormData>;
  handleSubmit: UseFormHandleSubmit<ExchangeFormData>;
  errors: FieldErrors<ExchangeFormData>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  wantsExchange: boolean;
  selectedBrand: string;
  handleNext: () => Promise<void>;
  onSubmit: (data: ExchangeFormData) => void;
}

export function useExchangeForm(): UseExchangeFormReturn {
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
