"use client";

import Link from "next/link";
import { Heart, Calculator } from "lucide-react";
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
import { useFavorites } from "@/features/favoritos/context/favorites-context";
import { StarRating } from "@/features/reviews/components/star-rating";
import type { BancoItem, CuotaItem } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";

// server-serialization: accept only the fields needed instead of full VehicleDetail
interface VehicleInfoProps {
  vehiculoId: string;
  nombre: string;
  slug: string;
  precio: number;
  preciodescuento: number | null;
  descripcion: string | null;
  averageRating: number;
  totalReviews: number;
  calculadoraTitulo?: string;
  calculadoraDescripcion?: string;
  calculadoraBancos?: BancoItem[];
  calculadoraCuotas?: CuotaItem[];
}

export function VehicleInfo({ vehiculoId, nombre, slug, precio, preciodescuento, descripcion, averageRating, totalReviews, calculadoraTitulo, calculadoraDescripcion, calculadoraBancos, calculadoraCuotas }: VehicleInfoProps) {
  const [calcOpen, setCalcOpen] = useState(false);
  const precioFinal = preciodescuento ?? precio;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(vehiculoId);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-2xl p-4 md:p-8">
      {/* Header: name + favorite */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-fs-xl font-semibold tracking-tight">
            {nombre}
          </h1>
          {totalReviews > 0 ? (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                <StarRating rating={Math.round(averageRating)} size="sm" />
              </div>
              <span className="text-fs-sm text-muted-foreground">
                {totalReviews}+ Reseñas
              </span>
            </div>
          ) : null}
        </div>
        <button
          aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
          onClick={() => toggleFavorite(vehiculoId)}
          className="transition-transform hover:scale-110 active:scale-95 mt-1"
        >
          <Heart
            className={cn(
              "size-6",
              favorited
                ? "fill-destructive text-destructive"
                : "fill-transparent text-muted-foreground",
            )}
          />
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
            <LoanCalculator
              vehiclePrice={precioFinal}
              titulo={calculadoraTitulo}
              descripcion={calculadoraDescripcion}
              bancos={calculadoraBancos}
              cuotas={calculadoraCuotas}
            />
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
