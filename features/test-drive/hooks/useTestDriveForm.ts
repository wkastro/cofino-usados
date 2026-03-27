import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TEST_DRIVE_STEP_1_FIELDS } from "@/lib/constants/test-drive";
import { testDriveSchema, type TestDriveFormData } from "@/lib/validations/test-drive";

interface UseTestDriveFormReturn {
  register: UseFormRegister<TestDriveFormData>;
  control: Control<TestDriveFormData>;
  handleSubmit: UseFormHandleSubmit<TestDriveFormData>;
  errors: FieldErrors<TestDriveFormData>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  handleNext: () => Promise<void>;
  onSubmit: (data: TestDriveFormData) => void;
}

export function useTestDriveForm(): UseTestDriveFormReturn {
  const [step, setStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TestDriveFormData>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      phoneCode: "+502",
    },
  });

  async function handleNext() {
    const valid = await trigger([...TEST_DRIVE_STEP_1_FIELDS]);
    if (valid) setStep(1);
  }

  function onSubmit(_data: TestDriveFormData) {
    // TODO: implement server action for test drive form submission
  }

  return {
    register,
    control,
    handleSubmit,
    errors,
    step,
    setStep,
    handleNext,
    onSubmit,
  };
}
