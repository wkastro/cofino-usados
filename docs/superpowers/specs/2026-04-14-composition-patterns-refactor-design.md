# Composition Patterns Refactor

**Date:** 2026-04-14  
**Scope:** Everything except `features/dashboard/`  
**Approach:** Minimal, targeted fixes — no new logic, no behavior changes

---

## Background

An audit of the codebase against the vercel-composition-patterns skill identified 3 real anti-patterns. The remaining audit findings were false positives (controlled components, hook-managed state passed explicitly) and are intentionally left unchanged.

---

## Issue 1 — `exchange-form.tsx`: Hidden class step toggling

**File:** `features/intercambiar/components/exchange-form.tsx`

**Problem:** Both form steps are always in the DOM. Visibility is toggled with Tailwind's `hidden` class:

```tsx
<div className={step === 0 ? "space-y-5" : "hidden"}>
  {/* Step 1 content — always rendered */}
</div>
<div className={step === 1 ? "space-y-5" : "hidden"}>
  {/* Step 2 content — always rendered */}
</div>
```

This means inactive step fields participate in layout, can receive focus, and may interfere with form validation.

**Fix:** Replace with `&&` conditional rendering:

```tsx
{step === 0 && (
  <div className="space-y-5">
    {/* Step 1 content */}
  </div>
)}
{step === 1 && (
  <div className="space-y-5">
    {/* Step 2 content */}
  </div>
)}
```

**Files changed:** 1  
**New files:** 0

---

## Issue 2 — `purchase-checkout.tsx`: Prop-drilling form state

**Files:**
- `features/comprar/hooks/usePurchaseForm.ts`
- `features/comprar/components/purchase-checkout.tsx`
- `features/comprar/components/payment-method-tabs.tsx`
- `features/comprar/components/card-form.tsx`
- `features/comprar/components/transfer-form.tsx`

**Problem:** `register`, `control`, and `errors` are destructured in `purchase-checkout.tsx` and explicitly drilled into 3 child components. This couples the parent to each child's internal form needs.

```tsx
// purchase-checkout.tsx — current
const { register, control, handleSubmit, errors, paymentMethod, onSubmit } = usePurchaseForm();
<PaymentMethodTabs control={control} />
<CardForm register={register} control={control} errors={errors} />
<TransferForm register={register} control={control} errors={errors} />
```

**Fix:** Use React Hook Form's `FormProvider` / `useFormContext` pattern.

`usePurchaseForm` exposes the full `form` object (the return value of `useForm`):

```ts
// usePurchaseForm.ts — after
return {
  form,           // UseFormReturn<PurchaseFormData>
  paymentMethod,  // watched value
  onSubmit,
};
```

`purchase-checkout.tsx` wraps with `FormProvider`:

```tsx
const { form, paymentMethod, onSubmit } = usePurchaseForm();
return (
  <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} ...>
      <PaymentMethodTabs />
      {paymentMethod === "card" ? <CardForm /> : <TransferForm />}
    </form>
  </FormProvider>
);
```

Child components read form state internally via `useFormContext`:

```tsx
// card-form.tsx — after
export function CardForm() {
  const { register, control, formState: { errors } } = useFormContext<PurchaseFormData>();
  // ... no props needed
}
```

**Files changed:** 5  
**New files:** 0

---

## Issue 3 — Boolean props on grid components

**Files:**
- `features/filters/components/vehicle-grid.tsx`
- `features/comprar/components/infinite-vehicle-grid.tsx`
- `features/filters/components/home-vehicle-grid.tsx`
- `features/recommendations/components/home-recommendations.tsx`
- `features/filters/components/vehicle-listing-grid.tsx`
- `features/comprar/components/comprar-vehicle-grid.tsx`
- `features/certificados/components/certificados-vehicle-grid.tsx`

**Problem:** Both grid components accept a boolean prop plus 4 filter-data props that are only relevant when the button is shown. The grid components know too much about `AdvancedFiltersButton`.

```tsx
// vehicle-grid.tsx — current
interface VehicleGridProps {
  vehicles: VehicleResponse;
  showAdvancedFiltersButton?: boolean; // ← boolean toggle
  etiquetas?: EtiquetaComercial[];     // ← only needed for the button
  priceRange?: RangeValues;            // ← only needed for the button
  minYear?: number;                    // ← only needed for the button
  kilometrajeRange?: RangeValues;      // ← only needed for the button
}
```

**Fix:** Replace with an `actions?: React.ReactNode` slot. The grid renders whatever is passed; the caller decides whether and how to render `AdvancedFiltersButton`.

```tsx
// vehicle-grid.tsx — after
interface VehicleGridProps {
  vehicles: VehicleResponse;
  actions?: React.ReactNode;
}

// Inside: {actions && <div>{actions}</div>} in the header row
```

Call sites move the button rendering up:

```tsx
// comprar-vehicle-grid.tsx — after
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
```

Call sites that currently hide the button (`vehicle-listing-grid.tsx` with `showFilters=false`) simply omit `actions`. The `showFilters` prop on `VehicleListingGrid` can be kept to gate whether `actions` is populated — that boolean lives at the wrapper level (appropriate), not inside the grid (inappropriate).

`certificados-vehicle-grid.tsx` currently shows the button (no etiquetas, but passes price/year/km ranges). After the refactor it explicitly passes `actions={<AdvancedFiltersButton priceRange={...} minYear={...} kilometrajeRange={...} />}`.

**Files changed:** 7  
**New files:** 0

---

## Summary

| Issue | Pattern fixed | Files | New files |
|---|---|---|---|
| `exchange-form.tsx` hidden class | Conditional rendering | 1 | 0 |
| `purchase-checkout.tsx` form prop drilling | FormProvider / useFormContext | 5 | 0 |
| Grid boolean props | `actions` slot | 7 | 0 |
| **Total** | | **13** | **0** |

No new abstractions. No behavior changes. All existing routes, forms, and filter functionality remain identical.
