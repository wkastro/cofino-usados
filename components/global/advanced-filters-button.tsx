"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterHorizontalIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import { formatCurrency } from "@/lib/formatters/vehicle";
import type { EtiquetaComercial } from "@/types/filters/filters";

const COMBUSTIBLE_OPTIONS = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diesel", label: "Diésel" },
  { value: "Hibrido", label: "Híbrido" },
  { value: "Electrico", label: "Eléctrico" },
];

interface PriceRange {
  min: number;
  max: number;
}

interface AdvancedFiltersButtonProps {
  className?: string;
  label?: string;
  etiquetas?: EtiquetaComercial[];
  priceRange?: PriceRange;
}

export function AdvancedFiltersButton({
  className,
  label = "Filtros avanzados",
  etiquetas = [],
  priceRange = { min: 0, max: 1000000 },
}: AdvancedFiltersButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useFilterLoading();

  const currentEtiqueta = searchParams.get("etiqueta") ?? "";
  const currentCombustible = searchParams.get("combustible") ?? "";
  const currentPrecioMin = searchParams.get("precioMin");
  const currentPrecioMax = searchParams.get("precioMax");

  const [selectedEtiqueta, setSelectedEtiqueta] = useState(currentEtiqueta);
  const [selectedCombustible, setSelectedCombustible] =
    useState(currentCombustible);
  const [precioMin, setPrecioMin] = useState(
    currentPrecioMin ? Number(currentPrecioMin) : priceRange.min,
  );
  const [precioMax, setPrecioMax] = useState(
    currentPrecioMax ? Number(currentPrecioMax) : priceRange.max,
  );
  const [estadoOpen, setEstadoOpen] = useState(true);
  const [combustibleOpen, setCombustibleOpen] = useState(true);
  const [precioOpen, setPrecioOpen] = useState(true);

  const handleSliderChange = (values: number[]) => {
    setPrecioMin(values[0]);
    setPrecioMax(values[1]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const value = raw ? Math.max(0, Number(raw)) : priceRange.min;
    const clamped = Math.min(value, precioMax);
    setPrecioMin(clamped);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const value = raw ? Math.max(0, Number(raw)) : priceRange.max;
    const clamped = Math.max(value, precioMin);
    setPrecioMax(clamped);
  };

  const isPriceModified =
    precioMin !== priceRange.min || precioMax !== priceRange.max;

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedEtiqueta) {
      params.set("etiqueta", selectedEtiqueta);
    } else {
      params.delete("etiqueta");
    }

    if (selectedCombustible) {
      params.set("combustible", selectedCombustible);
    } else {
      params.delete("combustible");
    }

    if (precioMin !== priceRange.min) {
      params.set("precioMin", String(precioMin));
    } else {
      params.delete("precioMin");
    }

    if (precioMax !== priceRange.max) {
      params.set("precioMax", String(precioMax));
    } else {
      params.delete("precioMax");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

    setOpen(false);
  };

  const clearAdvancedFilters = () => {
    setSelectedEtiqueta("");
    setSelectedCombustible("");
    setPrecioMin(priceRange.min);
    setPrecioMax(priceRange.max);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("etiqueta");
    params.delete("combustible");
    params.delete("precioMin");
    params.delete("precioMax");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedEtiqueta(searchParams.get("etiqueta") ?? "");
      setSelectedCombustible(searchParams.get("combustible") ?? "");
      const paramMin = searchParams.get("precioMin");
      const paramMax = searchParams.get("precioMax");
      setPrecioMin(paramMin ? Number(paramMin) : priceRange.min);
      setPrecioMax(paramMax ? Number(paramMax) : priceRange.max);
    }
    setOpen(isOpen);
  };

  const activeFilterCount =
    [selectedEtiqueta, selectedCombustible].filter(Boolean).length +
    (isPriceModified ? 1 : 0);

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      direction="right"
      handleOnly
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-full font-semibold", className)}
        >
          {label}
          {activeFilterCount > 0 && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            data-icon="inline-start"
            strokeWidth={2}
            className="size-4"
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtros avanzados</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Estado */}
          <Collapsible open={estadoOpen} onOpenChange={setEstadoOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
              <span className="text-sm font-bold uppercase tracking-wide">
                Estado
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className={cn(
                  "size-5 transition-transform",
                  estadoOpen && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 pb-4">
                {etiquetas.map((etiqueta) => (
                  <label
                    key={etiqueta.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedEtiqueta === etiqueta.slug}
                      onCheckedChange={(checked) =>
                        setSelectedEtiqueta(checked ? etiqueta.slug : "")
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {etiqueta.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Combustible */}
          <Collapsible open={combustibleOpen} onOpenChange={setCombustibleOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
              <span className="text-sm font-bold uppercase tracking-wide">
                Combustible
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className={cn(
                  "size-5 transition-transform",
                  combustibleOpen && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 pb-4">
                {COMBUSTIBLE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCombustible === option.value}
                      onCheckedChange={(checked) =>
                        setSelectedCombustible(checked ? option.value : "")
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Precio */}
          <Collapsible open={precioOpen} onOpenChange={setPrecioOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
              <span className="text-sm font-bold uppercase tracking-wide">
                Precio
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className={cn(
                  "size-5 transition-transform",
                  precioOpen && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 pb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(precioMin)}</span>
                  <span>{formatCurrency(precioMax)}</span>
                </div>

                <Slider
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1000}
                  value={[precioMin, precioMax]}
                  onValueChange={handleSliderChange}
                />

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-xs font-semibold">Min</span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={`Q${precioMin.toLocaleString("es-GT")}`}
                      onChange={handleMinInputChange}
                    />
                  </div>
                  <span className="mt-4 text-lg font-bold">—</span>
                  <div className="flex-1">
                    <span className="text-xs font-semibold">Max</span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={`Q${precioMax.toLocaleString("es-GT")}`}
                      onChange={handleMaxInputChange}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DrawerFooter className="flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={clearAdvancedFilters}
          >
            Limpiar
          </Button>
          <Button className="flex-1" onClick={applyFilters}>
            Aplicar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
