"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface AdvancedFiltersButtonProps {
  className?: string;
  label?: string;
}

export function AdvancedFiltersButton({
  className,
  label = "Filtros avanzados",
}: AdvancedFiltersButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-full font-semibold", className)}
        >
          {label}
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
      </DrawerContent>
    </Drawer>
  );
}
