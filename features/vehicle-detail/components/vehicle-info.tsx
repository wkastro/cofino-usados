"use client";

import Link from "next/link";
import { Heart, Star, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters/vehicle";
import { useMonthlyPayment } from "@/features/vehicle-detail/hooks/useMonthlyPayment";
import type { VehicleDetail } from "@/types/vehiculo/vehiculo";

interface VehicleInfoProps {
  vehicle: VehicleDetail;
}

export function VehicleInfo({ vehicle }: VehicleInfoProps) {
  const { monthlyPayment } = useMonthlyPayment(vehicle.preciosiniva);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-2xl p-4 md:p-8">
      {/* Header: name + favorite */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-fs-xl font-semibold tracking-tight">
            {vehicle.nombre}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
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
      {vehicle.descripcion && (
        <p className="text-muted-foreground text-fs-base leading-relaxed">
          {vehicle.descripcion}
        </p>
      )}

      {/* Pricing */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-fs-xxl font-semibold font-clash-display tracking-tight">
            {formatCurrency(vehicle.preciosiniva)}
          </span>
          <span className="text-fs-base text-muted-foreground line-through">
            {formatCurrency(vehicle.precio)}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-fs-base font-medium">
            {formatCurrency(monthlyPayment)} / mes
          </span>
          <Link
            href="#calculadora"
            className="bg-btn-black inline-flex items-center gap-1.5 !px-4 !py-1.5 !text-fs-sm"
          >
            <Calculator className="size-4" />
            Calculadora de cuotas
          </Link>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href={`/test-drive?vehiculo=${vehicle.slug}`}
          className="bg-btn-lime flex-1 text-center"
        >
          Agendar cita
        </Link>
        <Link href="/comprar" className="bg-btn-black flex-1 text-center">
          Reserva ahora
        </Link>
      </div>
    </div>
  );
}
