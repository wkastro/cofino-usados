"use client";

import { usePurchaseForm } from "../hooks/usePurchaseForm";
import { PaymentMethodTabs } from "./payment-method-tabs";
import { CardForm } from "./card-form";
import { TransferForm } from "./transfer-form";
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
  const { register, control, handleSubmit, errors, paymentMethod, onSubmit } =
    usePurchaseForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[1fr_500]"
    >
      {/* Left: Payment form */}
      <div className="space-y-6">
        <PaymentMethodTabs control={control} />

        <div className="rounded-4xl border border-gray-200 p-5 sm:p-8 bg-white">
          {paymentMethod === "card" ? (
            <CardForm register={register} control={control} errors={errors} />
          ) : (
            <TransferForm register={register} control={control} errors={errors} />
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
          submitLabel={
            paymentMethod === "card"
              ? "Confirmar y pagar ahora"
              : "Confirmar y enviar recibo"
          }
        />
      </div>
    </form>
  );
}
