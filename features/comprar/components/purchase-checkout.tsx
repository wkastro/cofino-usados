"use client";

import { usePurchaseForm } from "../hooks/usePurchaseForm";
import { PaymentMethodTabs } from "./payment-method-tabs";
import { CardForm } from "./card-form";
import { VehicleSummary } from "./vehicle-summary";

interface PurchaseCheckoutProps {
  vehicle: {
    nombre: string;
    marca: string;
    sucursal: string;
    imagen: string;
  };
}

export function PurchaseCheckout({ vehicle }: PurchaseCheckoutProps) {
  const { register, control, handleSubmit, errors, isSubmitting, paymentMethod, onSubmit } =
    usePurchaseForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12"
    >
      {/* Left: Payment form */}
      <div className="space-y-6">
        <PaymentMethodTabs control={control} />

        <div className="rounded-2xl border border-gray-200 p-5 sm:p-8">
          {paymentMethod === "card" ? (
            <CardForm register={register} control={control} errors={errors} />
          ) : (
            <div className="space-y-4 py-8 text-center">
              <p className="text-fs-md font-medium">Transferencia bancaria</p>
              <p className="text-fs-sm text-gray-500">
                Instrucciones de transferencia seran enviadas a tu correo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Vehicle summary */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <VehicleSummary
          nombre={vehicle.nombre}
          marca={vehicle.marca}
          sucursal={vehicle.sucursal}
          imagen={vehicle.imagen}
        />
      </div>
    </form>
  );
}
