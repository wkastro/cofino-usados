# Comprar Checkout Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vehicle reservation checkout page at `/comprar/[slug]` with a payment form (card/transfer tabs) and a vehicle summary sidebar, matching the provided design.

**Architecture:** Dynamic route `/comprar/[slug]` fetches the vehicle by slug server-side via `getCachedVehicleBySlug`. The page renders two main sections: a client-side payment form (left) and a server-rendered vehicle summary (right). The reservation price is static (Q20,000), IVA is 12%, total is calculated. Form uses react-hook-form + Zod validation.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, react-hook-form, Zod, shadcn/ui components

---

## File Structure

```
lib/validations/purchase.ts              — Zod schema for payment form
features/comprar/hooks/usePurchaseForm.ts — Form state management hook
features/comprar/components/payment-method-tabs.tsx — Card/Transfer tab switcher
features/comprar/components/card-form.tsx — Credit/debit card form fields
features/comprar/components/vehicle-summary.tsx — Right sidebar with vehicle info + pricing
features/comprar/components/purchase-checkout.tsx — Main layout composing all components
app/comprar/[slug]/page.tsx              — Dynamic route server component
app/comprar/page.tsx                     — DELETE (replaced by dynamic route)
features/vehicle-detail/components/vehicle-info.tsx — UPDATE "Reserva ahora" link
```

---

### Task 1: Create Zod validation schema

**Files:**
- Create: `lib/validations/purchase.ts`

- [ ] **Step 1: Create the validation schema**

```typescript
import { z } from "zod/v4";

export const purchaseSchema = z.object({
  paymentMethod: z.enum(["card", "transfer"]),
  cardNumber: z.string().min(16, "Ingresa un numero de tarjeta valido"),
  cardName: z.string().min(3, "Ingresa el nombre en la tarjeta"),
  expMonth: z.string().min(1, "Requerido"),
  expYear: z.string().min(4, "Requerido"),
  cvv: z.string().min(3, "CVV invalido").max(4),
  nit: z.string().min(1, "Ingresa el NIT o CF"),
  acceptTerms: z.literal(true, { message: "Debes aceptar los terminos" }),
  acceptNoRefund: z.literal(true, { message: "Debes aceptar esta condicion" }),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;

export const CARD_FIELDS = [
  "cardNumber",
  "cardName",
  "expMonth",
  "expYear",
  "cvv",
] as const;
```

- [ ] **Step 2: Commit**

```bash
git add lib/validations/purchase.ts
git commit -m "feat(comprar): add Zod validation schema for purchase form"
```

---

### Task 2: Create usePurchaseForm hook

**Files:**
- Create: `features/comprar/hooks/usePurchaseForm.ts`

- [ ] **Step 1: Create the hook**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add features/comprar/hooks/usePurchaseForm.ts
git commit -m "feat(comprar): add usePurchaseForm hook with react-hook-form + Zod"
```

---

### Task 3: Create PaymentMethodTabs component

**Files:**
- Create: `features/comprar/components/payment-method-tabs.tsx`

- [ ] **Step 1: Create the tab switcher component**

This component renders two tab buttons: "Tarjeta de credito / debito" and "Transferencia bancaria". It uses react-hook-form's Controller to bind to the `paymentMethod` field.

```typescript
"use client";

import { type Control, Controller } from "react-hook-form";
import { CreditCard, Building2 } from "lucide-react";
import type { PurchaseFormData } from "@/lib/validations/purchase";

interface PaymentMethodTabsProps {
  control: Control<PurchaseFormData>;
}

const TABS = [
  { value: "card" as const, label: "Tarjeta de credito / debito", icon: CreditCard },
  { value: "transfer" as const, label: "Transferencia bancaria", icon: Building2 },
];

export function PaymentMethodTabs({ control }: PaymentMethodTabsProps) {
  return (
    <Controller
      control={control}
      name="paymentMethod"
      render={({ field }) => (
        <div className="flex rounded-full bg-gray-100 p-1">
          {TABS.map((tab) => {
            const isActive = field.value === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => field.onChange(tab.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-fs-sm font-medium transition-colors ${
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

- [ ] **Step 2: Commit**

```bash
git add features/comprar/components/payment-method-tabs.tsx
git commit -m "feat(comprar): add PaymentMethodTabs component"
```

---

### Task 4: Create CardForm component

**Files:**
- Create: `features/comprar/components/card-form.tsx`

- [ ] **Step 1: Create the card form fields component**

This component renders the credit card information fields: card number, name, expiration (month/year selects), CVV, and NIT. It also includes the two checkboxes for terms acceptance.

```typescript
"use client";

import { type Control, type UseFormRegister, type FieldErrors, Controller } from "react-hook-form";
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
import type { PurchaseFormData } from "@/lib/validations/purchase";

interface CardFormProps {
  register: UseFormRegister<PurchaseFormData>;
  control: Control<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() + i)
);

export function CardForm({ register, control, errors }: CardFormProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-fs-md font-semibold italic">
        Informacion de la tarjeta
      </h3>

      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Numero de la tarjeta</Label>
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Expiracion</Label>
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
                    <SelectValue placeholder="Ano" />
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

- [ ] **Step 2: Commit**

```bash
git add features/comprar/components/card-form.tsx
git commit -m "feat(comprar): add CardForm component with validation"
```

---

### Task 5: Create VehicleSummary component

**Files:**
- Create: `features/comprar/components/vehicle-summary.tsx`

- [ ] **Step 1: Create the vehicle summary sidebar**

This is a server component that displays the vehicle image with name/brand overlay, location, date, reservation price, IVA (12%), and total. It also renders the submit button.

```typescript
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleSummaryProps {
  nombre: string;
  marca: string;
  sucursal: string;
  imagen: string;
}

const RESERVATION_PRICE = 20000;
const IVA_RATE = 0.12;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export function VehicleSummary({
  nombre,
  marca,
  sucursal,
  imagen,
}: VehicleSummaryProps) {
  const iva = RESERVATION_PRICE * IVA_RATE;
  const total = RESERVATION_PRICE + iva;

  return (
    <div className="flex flex-col gap-6">
      {/* Vehicle image with overlay */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
        <Image
          src={imagen}
          alt={nombre}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h2 className="text-fs-md font-semibold text-white">{nombre}</h2>
          <p className="text-fs-sm text-white/80">{marca}</p>
        </div>
      </div>

      {/* Location & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-fs-sm font-medium text-gray-500">Ubicacion</p>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 text-gray-400" />
            <span className="text-fs-sm font-medium">{sucursal}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-fs-sm font-medium text-gray-500">Fecha</p>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-gray-400" />
            <span className="text-fs-sm font-medium">{formatDate()}</span>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-fs-sm font-medium">Reserva de automovil</p>
            <p className="text-fs-sm font-medium">{nombre}</p>
          </div>
          <p className="text-fs-md font-semibold">
            Q {formatPrice(RESERVATION_PRICE)}
            <span className="text-fs-sm align-super">00</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-fs-sm">
            IVA <span className="text-gray-500">(impuesto al valor agregado)</span>
          </p>
          <p className="text-fs-md font-semibold">
            Q {formatPrice(iva)}
            <span className="text-fs-sm align-super">00</span>
          </p>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-fs-sm font-medium tracking-widest uppercase">Total</p>
            <p className="text-fs-lg font-bold">
              Q {formatPrice(total)}
              <span className="text-fs-sm align-super">00</span>
            </p>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="dark"
        size="lg"
        className="w-full rounded-full py-6 text-fs-base font-semibold"
      >
        Confirmar y pagar ahora
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add features/comprar/components/vehicle-summary.tsx
git commit -m "feat(comprar): add VehicleSummary component with pricing breakdown"
```

---

### Task 6: Create PurchaseCheckout client component

**Files:**
- Create: `features/comprar/components/purchase-checkout.tsx`

- [ ] **Step 1: Create the main checkout layout component**

This client component composes PaymentMethodTabs, CardForm, and VehicleSummary into the two-column layout. It wraps everything in a `<form>` managed by usePurchaseForm.

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add features/comprar/components/purchase-checkout.tsx
git commit -m "feat(comprar): add PurchaseCheckout layout component"
```

---

### Task 7: Create dynamic route and wire everything

**Files:**
- Create: `app/comprar/[slug]/page.tsx`
- Delete: `app/comprar/page.tsx`
- Modify: `features/vehicle-detail/components/vehicle-info.tsx:94`

- [ ] **Step 1: Create the dynamic route page**

```typescript
import { notFound } from "next/navigation";
import { getCachedVehicleBySlug } from "@/app/actions/vehiculo.cached";
import { Container } from "@/components/layout/container";
import { PurchaseCheckout } from "@/features/comprar/components/purchase-checkout";

export default async function BuyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getCachedVehicleBySlug(slug);

  if (!vehicle) return notFound();

  const firstImage = vehicle.galeria?.[0]?.url ?? "/compra.jpg";

  return (
    <Container className="py-8 lg:py-12">
      <PurchaseCheckout
        vehicle={{
          nombre: vehicle.nombre,
          marca: vehicle.marca.nombre,
          sucursal: vehicle.sucursal.nombre,
          imagen: firstImage,
        }}
      />
    </Container>
  );
}
```

- [ ] **Step 2: Delete old page.tsx**

Delete `app/comprar/page.tsx` — replaced by `app/comprar/[slug]/page.tsx`.

- [ ] **Step 3: Update "Reserva ahora" link in vehicle-info.tsx**

Change line 94 from:
```tsx
<Link href="/comprar" className="bg-btn-black flex-1 text-center">
```
To:
```tsx
<Link href={`/comprar/${vehicle.slug}`} className="bg-btn-black flex-1 text-center">
```

- [ ] **Step 4: Update auth.ts route protection**

The existing `pathname.startsWith("/comprar")` already covers `/comprar/[slug]` since it's a prefix match. No changes needed.

- [ ] **Step 5: Commit**

```bash
git add app/comprar/[slug]/page.tsx features/vehicle-detail/components/vehicle-info.tsx
git rm app/comprar/page.tsx
git commit -m "feat(comprar): add dynamic route /comprar/[slug] with vehicle data fetching"
```

---

### Task 8: Verify build

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 3: Fix any issues found, commit fixes**
