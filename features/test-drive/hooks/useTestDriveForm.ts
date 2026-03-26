import { useState } from "react";
import { useForm } from "react-hook-form";
import { TEST_DRIVE_STEP_1_FIELDS } from "@/lib/constants/test-drive";
import type { TestDriveFormData } from "@/lib/validations/test-drive";

export function useTestDriveForm() {
  const [step, setStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TestDriveFormData>({
    defaultValues: {
      phoneCode: "+502",
      acceptContact: false,
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
