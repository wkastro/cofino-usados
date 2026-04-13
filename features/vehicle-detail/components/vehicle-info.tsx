"use client";

import Link from "next/link";
import { Heart, Star, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters/vehicle";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoanCalculator } from "./loan-calculator";

const STAR_INDICES = [0, 1, 2, 3, 4];

// server-serialization: accept only the fields needed instead of full VehicleDetail
interface VehicleInfoProps {
  nombre: string;
  slug: string;
  precio: number;
  preciodescuento: number | null;
  descripcion: string | null;
}

export function VehicleInfo({ nombre, slug, precio, preciodescuento, descripcion }: VehicleInfoProps) {
  const [calcOpen, setCalcOpen] = useState(false);
  const precioFinal = preciodescuento ?? precio;

  return (
    <div className="flex flex-col gap-5 bg-white rounded-2xl p-4 md:p-8">
      {/* Header: name + favorite */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-fs-xl font-semibold tracking-tight">
            {nombre}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {STAR_INDICES.map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < 4
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-amber-400",
                  )}
                />
              ))}
            </div>
            <span className="text-fs-sm text-muted-foreground">
              440+ Reseñas
            </span>
          </div>
        </div>
        <button
          aria-label="Agregar a favoritos"
          className="transition-transform hover:scale-110 active:scale-95 mt-1"
        >
          <Heart className="size-6 fill-destructive text-destructive" />
        </button>
      </div>

      {/* Description */}
      {descripcion ? (
        <p className="text-muted-foreground text-fs-base leading-relaxed">
          {descripcion}
        </p>
      ) : null}

      {/* Pricing */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-fs-xxl font-semibold font-clash-display tracking-tight">
            {formatCurrency(precioFinal)}
          </span>
          {preciodescuento != null ? (
            <span className="text-fs-base text-muted-foreground line-through">
              {formatCurrency(precio)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setCalcOpen(true)}
            className="bg-btn-black inline-flex items-center gap-1.5 px-4 py-1.5 text-fs-sm"
          >
            <Calculator className="size-4" />
            Calculadora de cuotas
          </button>
        </div>

        <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="sr-only">Calculadora de cuotas</DialogTitle>
            </DialogHeader>
            <LoanCalculator vehiclePrice={precioFinal} />
          </DialogContent>
        </Dialog>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href={`/test-drive?vehiculo=${slug}`}
          className="bg-btn-lime flex-1 text-center"
        >
          Agendar cita
        </Link>
        <Link href={`/comprar/${slug}/reservar`} className="bg-btn-black flex-1 text-center">
          Reserva ahora
        </Link>
      </div>
    </div>
  );
}
