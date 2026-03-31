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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import type { EtiquetaComercial } from "@/types/filters/filters";

interface AdvancedFiltersButtonProps {
  className?: string;
  label?: string;
  etiquetas?: EtiquetaComercial[];
}

export function AdvancedFiltersButton({
  className,
  label = "Filtros avanzados",
  etiquetas = [],
}: AdvancedFiltersButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useFilterLoading();

  const currentEtiqueta = searchParams.get("etiqueta") ?? "";

  const [selectedEtiqueta, setSelectedEtiqueta] = useState(currentEtiqueta);
  const [estadoOpen, setEstadoOpen] = useState(true);

  const handleEtiquetaToggle = (slug: string, checked: boolean) => {
    setSelectedEtiqueta(checked ? slug : "");
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedEtiqueta) {
      params.set("etiqueta", selectedEtiqueta);
    } else {
      params.delete("etiqueta");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

    setOpen(false);
  };

  const clearAdvancedFilters = () => {
    setSelectedEtiqueta("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("etiqueta");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedEtiqueta(searchParams.get("etiqueta") ?? "");
    }
    setOpen(isOpen);
  };

  const hasActiveAdvancedFilters = currentEtiqueta !== "";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-full font-semibold", className)}
        >
          {label}
          {hasActiveAdvancedFilters && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
              1
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
                        handleEtiquetaToggle(etiqueta.slug, checked === true)
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
