"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/forms/field-error";
import { PhoneField } from "@/components/forms/phone-field";
import { AUTH_PHONE_CODES_EXTENDED } from "@/lib/constants/auth";
import { useExchangeForm } from "../hooks/useExchangeForm";

const YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i),
);

const BRANDS = [
  "Toyota",
  "BYD",
  "Lexus",
  "Land Rover",
  "Audi",
  "Renault",
  "Hyundai",
  "Kia",
  "Nissan",
  "Honda",
];

const MODELS_BY_BRAND: Record<string, string[]> = {
  Toyota: ["Corolla", "RAV4", "Hilux", "Yaris", "Fortuner", "Land Cruiser"],
  BYD: ["Dolphin", "Seal", "Atto 3", "Tang", "Han"],
  Lexus: ["RX", "NX", "ES", "IS", "UX"],
  "Land Rover": ["Defender", "Range Rover", "Discovery", "Evoque"],
  Audi: ["A3", "A4", "Q3", "Q5", "Q7"],
  Renault: ["Duster", "Koleos", "Captur", "Megane"],
  Hyundai: ["Tucson", "Santa Fe", "Creta", "Accent"],
  Kia: ["Sportage", "Seltos", "Sorento", "Forte"],
  Nissan: ["Sentra", "Kicks", "X-Trail", "Frontier"],
  Honda: ["Civic", "CR-V", "HR-V", "Accord"],
};

const EXCHANGE_VEHICLES = [
  "Toyota RAV4 2024",
  "Toyota Corolla 2024",
  "BYD Dolphin 2024",
  "Hyundai Tucson 2024",
  "Kia Sportage 2024",
];

export function ExchangeForm() {
  const {
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
  } = useExchangeForm();

  return (
    <div className="flex flex-col items-center px-6 py-10 lg:py-0 lg:px-12">
      <h2 className="font-semibold text-center">
        Tu auto vale más en Cofiño
      </h2>
      <p className="mt-2 text-muted-foreground text-center max-w-sm">
        Vendelo de forma segura, rápida y con el respaldo de expertos.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 w-full max-w-md space-y-5"
      >
        {/* Step 1: Vehicle Info */}
        {step === 0 && (
        <div className="space-y-5">
          {/* Placa */}
          <div className="space-y-2">
            <Label htmlFor="placa" className="font-bold">
              Placa del auto<span className="text-destructive">*</span>
            </Label>
            <Input
              id="placa"
              placeholder="Ej: 0195GPT"
              aria-invalid={!!errors.placa}
              {...register("placa")}
            />
            <FieldError message={errors.placa?.message} />
          </div>

          {/* Año */}
          <div className="space-y-2">
            <Label htmlFor="anio" className="font-bold">
              Año<span className="text-destructive">*</span>
            </Label>
            <Controller
              name="anio"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.anio}>
                    <SelectValue placeholder="Selecciona el año" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.anio?.message} />
          </div>

          {/* Marca */}
          <div className="space-y-2">
            <Label htmlFor="marca" className="font-bold">
              Marca<span className="text-destructive">*</span>
            </Label>
            <Controller
              name="marca"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full" aria-invalid={!!errors.marca}>
                    <SelectValue placeholder="Selecciona la marca" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {BRANDS.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.marca?.message} />
          </div>

          {/* Modelo */}
          <div className="space-y-2">
            <Label htmlFor="modelo" className="font-bold">
              Modelo<span className="text-destructive">*</span>
            </Label>
            <Controller
              name="modelo"
              control={control}
              render={({ field }) => {
                const models = MODELS_BY_BRAND[selectedBrand] ?? [];
                return (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.modelo}
                    >
                      <SelectValue placeholder="Selecciona el modelo" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {models.length > 0 ? (
                        models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="otro" disabled>
                          Selecciona una marca primero
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            <FieldError message={errors.modelo?.message} />
          </div>

          {/* Kilometraje */}
          <div className="space-y-2">
            <Label htmlFor="kilometraje" className="font-bold">
              Kilometraje<span className="text-destructive">*</span>
            </Label>
            <Input
              id="kilometraje"
              type="number"
              placeholder="Ingresa le kilometraje"
              aria-invalid={!!errors.kilometraje}
              {...register("kilometraje")}
            />
            <FieldError message={errors.kilometraje?.message} />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color" className="font-bold">
              Color<span className="text-destructive">*</span>
            </Label>
            <Input
              id="color"
              placeholder="Ingresa el color"
              aria-invalid={!!errors.color}
              {...register("color")}
            />
            <FieldError message={errors.color?.message} />
          </div>

          {/* Exchange toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="wantsExchange" className="font-bold cursor-pointer">
              Quiero intercambiar mi auto
            </Label>
            <Controller
              name="wantsExchange"
              control={control}
              render={({ field }) => (
                <Switch
                  id="wantsExchange"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Conditional exchange vehicle select */}
          {wantsExchange && (
            <div className="space-y-2">
              <Label htmlFor="exchangeVehicle" className="font-bold">
                ¿Por cuál auto deseo intercambiar?
              </Label>
              <Controller
                name="exchangeVehicle"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el auto" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {EXCHANGE_VEHICLES.map((vehicle) => (
                        <SelectItem key={vehicle} value={vehicle}>
                          {vehicle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>
        )}

        {/* Step 2: Contact Info */}
        {step === 1 && (
        <div className="space-y-5">
          {/* Nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-bold">
              Nombre completo<span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Ingrese su nombre completo"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            <FieldError message={errors.fullName?.message} />
          </div>

          {/* Correo electrónico */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">
              Correo electrónico<span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingrese su correo electrónico"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Teléfono */}
          <PhoneField
            control={control}
            register={register}
            phoneCodeName="phoneCode"
            phoneName="phone"
            phoneCodeOptions={AUTH_PHONE_CODES_EXTENDED}
            label={
              <span className="font-bold">
                Teléfono<span className="text-destructive">*</span>
              </span>
            }
            inputPlaceholder="5987 - 2409"
            errorMessage={errors.phone?.message}
          />

          {/* Precio de expectativa */}
          <div className="space-y-2">
            <Label htmlFor="expectedPrice" className="font-bold">
              Precio de expectativa<span className="text-destructive">*</span>
            </Label>
            <Input
              id="expectedPrice"
              type="number"
              placeholder="Ingresar cifra"
              aria-invalid={!!errors.expectedPrice}
              {...register("expectedPrice")}
            />
            <FieldError message={errors.expectedPrice?.message} />
          </div>
        </div>
        )}

        {/* Action buttons */}
        {step === 0 ? (
          <div className="flex justify-center pt-4">
            <button type="button" onClick={handleNext} className="bg-btn-black">
              Siguiente
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="bg-btn-white border border-foreground"
            >
              Anterior
            </button>
            <button type="submit" className="bg-btn-black">
              Finalizar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
