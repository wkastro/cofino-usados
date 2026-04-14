# Composition Patterns Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 3 composition anti-patterns — hidden-class step toggling, form prop drilling, and boolean props on grid components — without changing any visible behavior.

**Architecture:** Pure refactors. No new files, no new abstractions, no logic changes. Issue 1 replaces CSS visibility with conditional rendering. Issue 2 introduces React Hook Form's `FormProvider`/`useFormContext` to stop drilling `register`, `control`, and `errors` through the component tree. Issue 3 replaces boolean props with a generic `actions?: React.ReactNode` slot that lets call sites decide what to render in the grid header.

**Tech Stack:** React 19, Next.js 16, TypeScript, React Hook Form 7 (`FormProvider`, `useFormContext`), Tailwind CSS v4

---

## File Map

| File | Change |
|---|---|
| `features/intercambiar/components/exchange-form.tsx` | Replace `hidden` class with `&&` conditional rendering |
| `features/comprar/hooks/usePurchaseForm.ts` | Return `form` (full `UseFormReturn`) instead of destructured values |
| `features/comprar/components/purchase-checkout.tsx` | Wrap with `FormProvider`, stop passing form props to children |
| `features/comprar/components/payment-method-tabs.tsx` | Use `useFormContext`, remove `control` prop |
| `features/comprar/components/card-form.tsx` | Use `useFormContext`, remove all form props |
| `features/comprar/components/transfer-form.tsx` | Use `useFormContext`, remove all form props |
| `features/filters/components/vehicle-grid.tsx` | Remove boolean/filter props, add `actions` slot |
| `features/recommendations/components/home-recommendations.tsx` | Render `AdvancedFiltersButton`, pass as `actions` |
| `features/filters/components/home-vehicle-grid.tsx` | Render `AdvancedFiltersButton` conditionally, pass as `actions` |
| `features/comprar/components/infinite-vehicle-grid.tsx` | Remove boolean/filter props, add `actions` slot |
| `features/filters/components/vehicle-listing-grid.tsx` | Render `AdvancedFiltersButton` conditionally, pass as `actions` |
| `features/comprar/components/comprar-vehicle-grid.tsx` | Render `AdvancedFiltersButton`, pass as `actions` |
| `features/certificados/components/certificados-vehicle-grid.tsx` | Render `AdvancedFiltersButton`, pass as `actions` |

---

## Task 1: Fix hidden-class step toggling in ExchangeForm

**Files:**
- Modify: `features/intercambiar/components/exchange-form.tsx`

- [ ] **Step 1: Replace `hidden` class with conditional rendering**

Open `features/intercambiar/components/exchange-form.tsx`.

Find this block (around line 85):
```tsx
{/* Step 1: Vehicle Info */}
<div className={step === 0 ? "space-y-5" : "hidden"}>
```
Replace with:
```tsx
{/* Step 1: Vehicle Info */}
{step === 0 && (
<div className="space-y-5">
```
Add a closing `)}` after the closing `</div>` of that step (around line 263, after the wantsExchange conditional block):
```tsx
        </div>
      )}
```

Then find the Step 2 block (around line 266):
```tsx
{/* Step 2: Contact Info */}
<div className={step === 1 ? "space-y-5" : "hidden"}>
```
Replace with:
```tsx
{/* Step 2: Contact Info */}
{step === 1 && (
<div className="space-y-5">
```
Add `)}` after the closing `</div>` of step 2 (around line 326):
```tsx
        </div>
      )}
```

The complete form body structure after the change:
```tsx
<form
  onSubmit={handleSubmit(onSubmit)}
  className="mt-8 w-full max-w-md space-y-5"
>
  {/* Step 1: Vehicle Info */}
  {step === 0 && (
    <div className="space-y-5">
      {/* ... all step 1 fields unchanged ... */}
    </div>
  )}

  {/* Step 2: Contact Info */}
  {step === 1 && (
    <div className="space-y-5">
      {/* ... all step 2 fields unchanged ... */}
    </div>
  )}

  {/* Action buttons — unchanged */}
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/kstro/Documents/Workshop/aumenta/cofino-usados && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors related to `exchange-form.tsx`.

- [ ] **Step 3: Commit**

```bash
git add features/intercambiar/components/exchange-form.tsx
git commit -m "refactor: replace hidden class with conditional rendering in ExchangeForm"
```

---

## Task 2: FormProvider for PurchaseCheckout form

All 5 files in this task are tightly coupled — the `FormProvider` must be in place before child components switch to `useFormContext`. Change all 5 files before committing.

**Files:**
- Modify: `features/comprar/hooks/usePurchaseForm.ts`
- Modify: `features/comprar/components/purchase-checkout.tsx`
- Modify: `features/comprar/components/payment-method-tabs.tsx`
- Modify: `features/comprar/components/card-form.tsx`
- Modify: `features/comprar/components/transfer-form.tsx`

- [ ] **Step 1: Update `usePurchaseForm` to return the full form object**

Replace the entire content of `features/comprar/hooks/usePurchaseForm.ts`:

```ts
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
```

- [ ] **Step 2: Update `purchase-checkout.tsx` to use `FormProvider`**

Replace the entire content of `features/comprar/components/purchase-checkout.tsx`:

```tsx
"use client";

import { FormProvider } from "react-hook-form";
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
  const { form, paymentMethod, onSubmit } = usePurchaseForm();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px]"
      >
        {/* Left: Payment form */}
        <div className="space-y-6">
          <PaymentMethodTabs />

          <div className="rounded-4xl border border-gray-200 p-5 sm:p-8 bg-white">
            {paymentMethod === "card" ? <CardForm /> : <TransferForm />}
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
    </FormProvider>
  );
}
```

- [ ] **Step 3: Update `payment-method-tabs.tsx` to use `useFormContext`**

Replace the entire content of `features/comprar/components/payment-method-tabs.tsx`:

```tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreditCard, Building2 } from "lucide-react";
import type { PurchaseFormData } from "@/features/comprar/validations/purchase";

const TABS = [
  { value: "card" as const, label: "Tarjeta de credito / debito", icon: CreditCard },
  { value: "transfer" as const, label: "Transferencia bancaria", icon: Building2 },
];

export function PaymentMethodTabs() {
  const { control } = useFormContext<PurchaseFormData>();

  return (
    <Controller
      control={control}
      name="paymentMethod"
      render={({ field }) => (
        <div className="flex rounded-full bg-gray-200 p-1">
          {TABS.map((tab) => {
            const isActive = field.value === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => field.onChange(tab.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? "bg-brand-dark text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.value === "card" ? "Tarjeta" : "Transferencia"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
```

- [ ] **Step 4: Update `card-form.tsx` to use `useFormContext`**

Replace the entire content of `features/comprar/components/card-form.tsx`:

```tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/forms/field-error";
import type { PurchaseFormData } from "@/features/comprar/validations/purchase";

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() + i)
);

export function CardForm() {
  const { register, control, formState: { errors } } = useFormContext<PurchaseFormData>();

  return (
    <div className="space-y-5">
      <h3 className="text-fs-md font-semibold">
        Informacion de la tarjeta
      </h3>

      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número de la tarjeta</Label>
        <Input
          id="cardNumber"
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          {...register("cardNumber")}
          aria-invalid={!!errors.cardNumber}
        />
        <FieldError message={errors.cardNumber?.message} />
      </div>

      {/* Card Name */}
      <div className="space-y-2">
        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
        <Input
          id="cardName"
          placeholder="Ingresa el nombre en la tarjeta"
          {...register("cardName")}
          aria-invalid={!!errors.cardName}
        />
        <FieldError message={errors.cardName?.message} />
      </div>

      {/* Expiration + CVV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Expiración</Label>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="expMonth"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.expMonth}>
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              control={control}
              name="expYear"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.expYear}>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError message={errors.expMonth?.message || errors.expYear?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="***"
            maxLength={4}
            {...register("cvv")}
            aria-invalid={!!errors.cvv}
          />
          <FieldError message={errors.cvv?.message} />
        </div>
      </div>

      {/* NIT */}
      <div className="space-y-2">
        <Label htmlFor="nit">NIT / Consumidor Final</Label>
        <Input
          id="nit"
          placeholder="Ingresa el NIT o CF"
          {...register("nit")}
          aria-invalid={!!errors.nit}
        />
        <FieldError message={errors.nit?.message} />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!errors.acceptTerms}
              />
              <Label htmlFor="acceptTerms" className="text-fs-sm leading-tight font-normal">
                Acepto los{" "}
                <span className="font-medium underline">Terminos y condiciones</span>
              </Label>
            </div>
          )}
        />
        <FieldError message={errors.acceptTerms?.message} />

        <Controller
          control={control}
          name="acceptNoRefund"
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="acceptNoRefund"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!errors.acceptNoRefund}
              />
              <Label htmlFor="acceptNoRefund" className="text-fs-sm leading-tight font-normal">
                Si se reserva el vehiculo no se devuelve el 100%
              </Label>
            </div>
          )}
        />
        <FieldError message={errors.acceptNoRefund?.message} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Update `transfer-form.tsx` to use `useFormContext`**

Replace the entire content of `features/comprar/components/transfer-form.tsx`:

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/field-error";
import type { PurchaseFormData } from "@/features/comprar/validations/purchase";

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.pdf";

export function TransferForm() {
  const { register, control, formState: { errors } } = useFormContext<PurchaseFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-5">
      <h3 className="text-fs-md font-semibold">Detalles de la transferencia</h3>

      {/* Bank Name & Account Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">Nombre del banco</Label>
          <Input
            id="bankName"
            placeholder="Ingresa el nombre del banco"
            {...register("bankName")}
            aria-invalid={!!errors.bankName}
          />
          <FieldError message={errors.bankName?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Número de cuenta</Label>
          <Input
            id="accountNumber"
            placeholder="Ingresa el nombre de cuenta"
            {...register("accountNumber")}
            aria-invalid={!!errors.accountNumber}
          />
          <FieldError message={errors.accountNumber?.message} />
        </div>
      </div>

      {/* Auth Number */}
      <div className="space-y-2">
        <Label htmlFor="authNumber">Número de autorización</Label>
        <Input
          id="authNumber"
          placeholder="Ingresa el número de autorización"
          {...register("authNumber")}
          aria-invalid={!!errors.authNumber}
        />
        <FieldError message={errors.authNumber?.message} />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Sube tu recibo</Label>
        <Controller
          control={control}
          name="receipt"
          render={({ field: { onChange } }) => (
            <button
              type="button"
              onClick={handleZoneClick}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-gray-100 p-8 transition-colors hover:bg-gray-200 cursor-pointer"
            >
              <Upload className="size-6 text-gray-600" />
              <p className="text-fs-sm font-semibold">
                {fileName ?? "Click para subir el archivo"}
              </p>
              <p className="text-fs-xs text-gray-400">JPG, PDF, PNG</p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    setFileName(file.name);
                  }
                }}
              />
            </button>
          )}
        />
        <FieldError message={errors.receipt?.message} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd /Users/kstro/Documents/Workshop/aumenta/cofino-usados && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors in any of the 5 modified files.

- [ ] **Step 7: Commit**

```bash
git add \
  features/comprar/hooks/usePurchaseForm.ts \
  features/comprar/components/purchase-checkout.tsx \
  features/comprar/components/payment-method-tabs.tsx \
  features/comprar/components/card-form.tsx \
  features/comprar/components/transfer-form.tsx
git commit -m "refactor: use FormProvider in PurchaseCheckout, remove form prop drilling"
```

---

## Task 3: Actions slot for VehicleGrid

`VehicleGrid` loses 5 filter-related props and gains `actions?: React.ReactNode`. Its 2 call sites (`home-vehicle-grid.tsx`, `home-recommendations.tsx`) are updated atomically.

**Files:**
- Modify: `features/filters/components/vehicle-grid.tsx`
- Modify: `features/filters/components/home-vehicle-grid.tsx`
- Modify: `features/recommendations/components/home-recommendations.tsx`

- [ ] **Step 1: Update `vehicle-grid.tsx`**

Replace the entire content of `features/filters/components/vehicle-grid.tsx`:

```tsx
"use client";

import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
import Link from "next/link";

interface VehicleGridProps {
  vehicles: VehicleResponse;
  actions?: React.ReactNode;
}

export function VehicleGrid({
  vehicles,
  actions,
}: VehicleGridProps): React.ReactElement {
  const { isPending } = useFilterLoading();

  if (isPending) {
    return <VehicleCardSkeletonGrid />;
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-[#111111] tracking-tight">
            Autos recomendados
          </h2>
          {actions}
        </div>

        {vehicles.vehiculos.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div
              aria-label="Vehículos disponibles"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-8 md:mb-16"
            >
              {vehicles.vehiculos.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="vehicle-card-item w-full flex justify-center"
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/comprar" className="bg-btn-black inline-block">
                Ver más vehículos
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `home-vehicle-grid.tsx`**

Replace the entire content of `features/filters/components/home-vehicle-grid.tsx`:

```tsx
import { VehicleGrid } from "@/features/filters/components/vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import { getCachedVehiculos, getCachedEtiquetas, getCachedPriceRange, getCachedMinYear, getCachedKilometrajeRange } from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

interface HomeVehicleGridProps {
  searchParams: Promise<SearchParams>;
  showAdvancedFiltersButton?: boolean;
}

export async function HomeVehicleGrid({
  searchParams,
  showAdvancedFiltersButton = true,
}: HomeVehicleGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = parseSearchParamsToFilters(resolvedParams);

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedVehiculos(1, filters),
    getCachedEtiquetas(),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <VehicleGrid
      vehicles={vehicles}
      actions={
        showAdvancedFiltersButton ? (
          <AdvancedFiltersButton
            etiquetas={etiquetaOptions}
            priceRange={priceRange}
            minYear={minYear}
            kilometrajeRange={kilometrajeRange}
          />
        ) : undefined
      }
    />
  );
}
```

- [ ] **Step 3: Update `home-recommendations.tsx`**

Replace the entire content of `features/recommendations/components/home-recommendations.tsx`:

```tsx
import type React from "react";
import { getCachedHomeRecommendations } from "../actions/recommendations.cached";
import { VehicleGrid } from "@/features/filters/components/vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import {
  getCachedEtiquetas,
  getCachedPriceRange,
  getCachedMinYear,
  getCachedKilometrajeRange,
} from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

interface HomeRecommendationsProps {
  searchParams: Promise<SearchParams>;
}

export async function HomeRecommendations({
  searchParams,
}: HomeRecommendationsProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = parseSearchParamsToFilters(resolvedParams);

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedHomeRecommendations(filters),
    getCachedEtiquetas(),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <VehicleGrid
      vehicles={{
        vehiculos: vehicles,
        total: vehicles.length,
        pages: 1,
        page: 1,
      }}
      actions={
        <AdvancedFiltersButton
          etiquetas={etiquetaOptions}
          priceRange={priceRange}
          minYear={minYear}
          kilometrajeRange={kilometrajeRange}
        />
      }
    />
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/kstro/Documents/Workshop/aumenta/cofino-usados && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors in any of the 3 modified files.

- [ ] **Step 5: Commit**

```bash
git add \
  features/filters/components/vehicle-grid.tsx \
  features/filters/components/home-vehicle-grid.tsx \
  features/recommendations/components/home-recommendations.tsx
git commit -m "refactor: replace VehicleGrid boolean props with actions slot"
```

---

## Task 4: Actions slot for InfiniteVehicleGrid

`InfiniteVehicleGrid` loses `showFilters` and the 4 filter-data props, gains `actions?: React.ReactNode`. Its 3 call sites are updated atomically.

**Files:**
- Modify: `features/comprar/components/infinite-vehicle-grid.tsx`
- Modify: `features/filters/components/vehicle-listing-grid.tsx`
- Modify: `features/comprar/components/comprar-vehicle-grid.tsx`
- Modify: `features/certificados/components/certificados-vehicle-grid.tsx`

- [ ] **Step 1: Update `infinite-vehicle-grid.tsx`**

Replace the entire content of `features/comprar/components/infinite-vehicle-grid.tsx`:

```tsx
"use client";

import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { LoadMoreIndicator } from "./load-more-indicator";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import { useInfiniteVehicles } from "@/features/comprar/hooks/useInfiniteVehicles";
import { useIntersectionObserver } from "@/features/comprar/hooks/useIntersectionObserver";
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { VehicleFilters } from "@/types/filters/filters";

interface InfiniteVehicleGridProps {
  initialData: VehicleResponse;
  pageSize: number;
  filters: VehicleFilters;
  title?: string;
  actions?: React.ReactNode;
}

export function InfiniteVehicleGrid({
  initialData,
  pageSize,
  filters,
  title = "Autos recomendados",
  actions,
}: InfiniteVehicleGridProps) {
  const { isPending } = useFilterLoading();
  const { vehicles, isLoading, hasMore, loadMore } = useInfiniteVehicles({
    initialData,
    pageSize,
    filters,
  });

  const sentinelRef = useIntersectionObserver(loadMore, hasMore && !isLoading);

  if (isPending) {
    return <VehicleCardSkeletonGrid count={pageSize} />;
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-[#111111] tracking-tight">
            {title}
          </h2>
          {actions}
        </div>

        {vehicles.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div
              aria-label="Vehículos disponibles"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
            >
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="vehicle-card-item w-full flex justify-center"
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>

            {isLoading && <LoadMoreIndicator />}

            <div ref={sentinelRef} aria-hidden="true" />
          </>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `vehicle-listing-grid.tsx`**

Replace the entire content of `features/filters/components/vehicle-listing-grid.tsx`:

```tsx
import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import {
  getCachedVehiculos,
  getCachedEtiquetas,
  getCachedPriceRange,
  getCachedMinYear,
  getCachedKilometrajeRange,
} from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams, VehicleFilters } from "@/types/filters/filters";

const DEFAULT_PAGE_SIZE = 9;

interface VehicleListingGridProps {
  searchParams: Promise<SearchParams>;
  lockedFilters?: Partial<VehicleFilters>;
  title?: string;
  pageSize?: number;
  showFilters?: boolean;
}

export async function VehicleListingGrid({
  searchParams,
  lockedFilters,
  title,
  pageSize = DEFAULT_PAGE_SIZE,
  showFilters = true,
}: VehicleListingGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const sanitizedParams = { ...resolvedParams };
  if (lockedFilters) {
    // NOTE: VehicleFilters uses camelCase numeric keys (e.g. precioMin) while
    // SearchParams uses hyphenated string keys (e.g. "precio-min"). This loop
    // only correctly sanitizes keys that exist verbatim in both types (etiqueta,
    // marca, categoria, transmision, combustible). If a numeric filter is ever
    // locked, add explicit URL param key mapping here.
    for (const key of Object.keys(lockedFilters) as (keyof typeof sanitizedParams)[]) {
      delete sanitizedParams[key];
    }
  }
  const filters: VehicleFilters = {
    ...parseSearchParamsToFilters(sanitizedParams),
    ...lockedFilters,
  };

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] =
    await Promise.all([
      getCachedVehiculos(1, filters, pageSize),
      lockedFilters != null && "etiqueta" in lockedFilters
        ? Promise.resolve([])
        : getCachedEtiquetas(),
      getCachedPriceRange(),
      getCachedMinYear(),
      getCachedKilometrajeRange(),
    ]);

  return (
    <InfiniteVehicleGrid
      initialData={vehicles}
      pageSize={pageSize}
      filters={filters}
      title={title}
      actions={
        showFilters ? (
          <AdvancedFiltersButton
            etiquetas={etiquetaOptions}
            priceRange={priceRange}
            minYear={minYear}
            kilometrajeRange={kilometrajeRange}
          />
        ) : undefined
      }
    />
  );
}
```

- [ ] **Step 3: Update `comprar-vehicle-grid.tsx`**

Replace the entire content of `features/comprar/components/comprar-vehicle-grid.tsx`:

```tsx
import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import { getCachedVehiculos, getCachedEtiquetas, getCachedPriceRange, getCachedMinYear, getCachedKilometrajeRange } from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

const COMPRAR_PAGE_SIZE = 9;

interface ComprarVehicleGridProps {
  searchParams: Promise<SearchParams>;
}

export async function ComprarVehicleGrid({
  searchParams,
}: ComprarVehicleGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = parseSearchParamsToFilters(resolvedParams);

  const [vehicles, etiquetaOptions, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedVehiculos(1, filters, COMPRAR_PAGE_SIZE),
    getCachedEtiquetas(),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <InfiniteVehicleGrid
      initialData={vehicles}
      pageSize={COMPRAR_PAGE_SIZE}
      filters={filters}
      actions={
        <AdvancedFiltersButton
          etiquetas={etiquetaOptions}
          priceRange={priceRange}
          minYear={minYear}
          kilometrajeRange={kilometrajeRange}
        />
      }
    />
  );
}
```

- [ ] **Step 4: Update `certificados-vehicle-grid.tsx`**

Replace the entire content of `features/certificados/components/certificados-vehicle-grid.tsx`:

```tsx
import { InfiniteVehicleGrid } from "@/features/comprar/components/infinite-vehicle-grid";
import { AdvancedFiltersButton } from "@/features/filters/components/advanced-filters-button";
import {
  getCachedVehiculos,
  getCachedPriceRange,
  getCachedMinYear,
  getCachedKilometrajeRange,
} from "@/app/actions/vehiculo.cached";
import { parseSearchParamsToFilters } from "@/lib/filters/parse-search-params";
import type { SearchParams } from "@/types/filters/filters";

const CERTIFICADOS_PAGE_SIZE = 9;
const CERTIFICADOS_ETIQUETA_SLUG = "autos-certificados";

interface CertificadosVehicleGridProps {
  searchParams: Promise<SearchParams>;
}

export async function CertificadosVehicleGrid({
  searchParams,
}: CertificadosVehicleGridProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;
  const filters = {
    ...parseSearchParamsToFilters(resolvedParams),
    etiqueta: CERTIFICADOS_ETIQUETA_SLUG,
  };

  const [vehicles, priceRange, minYear, kilometrajeRange] = await Promise.all([
    getCachedVehiculos(1, filters, CERTIFICADOS_PAGE_SIZE),
    getCachedPriceRange(),
    getCachedMinYear(),
    getCachedKilometrajeRange(),
  ]);

  return (
    <InfiniteVehicleGrid
      initialData={vehicles}
      pageSize={CERTIFICADOS_PAGE_SIZE}
      filters={filters}
      title="Autos Certificados"
      actions={
        <AdvancedFiltersButton
          priceRange={priceRange}
          minYear={minYear}
          kilometrajeRange={kilometrajeRange}
        />
      }
    />
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd /Users/kstro/Documents/Workshop/aumenta/cofino-usados && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors in any of the 4 modified files.

- [ ] **Step 6: Commit**

```bash
git add \
  features/comprar/components/infinite-vehicle-grid.tsx \
  features/filters/components/vehicle-listing-grid.tsx \
  features/comprar/components/comprar-vehicle-grid.tsx \
  features/certificados/components/certificados-vehicle-grid.tsx
git commit -m "refactor: replace InfiniteVehicleGrid boolean props with actions slot"
```
