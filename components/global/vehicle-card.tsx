"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Info,
  MapPin,
  Users,
  Settings2,
  Milestone,
  Gauge,
  ShieldCheck,
  CarFront
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface VehicleCardProps {
  id: string | number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  precioOriginal?: number;
  precioMensual: number;
  imagen: string;
  badge?: string;
  isFavorito?: boolean;
  onFavoritoToggle?: (id: string | number) => void;
  onComprar?: (id: string | number) => void;
  esEntregaInmediata?: boolean;
  agencia: string;
  specs: {
    transmision: string;
    capacidad: number;
    kilometraje: number;
    motor: string;
    blindaje: string | boolean;
    traccion: string;
  };
}

export function VehicleCard({
  id,
  marca,
  modelo,
  anio,
  precio,
  precioOriginal,
  precioMensual,
  imagen,
  badge,
  isFavorito: externalIsFavorito,
  onFavoritoToggle,
  onComprar,
  esEntregaInmediata = true,
  agencia,
  specs,
}: VehicleCardProps) {
  // Manejador interno en caso no se controle externamente
  const [internalFavorito, setInternalFavorito] = useState(false);
  const isHeartActive = externalIsFavorito !== undefined ? externalIsFavorito : internalFavorito;

  const handleFavoritoClick = () => {
    if (onFavoritoToggle) {
      onFavoritoToggle(id);
    } else {
      setInternalFavorito(!internalFavorito);
    }
  };

  const handleComprarClick = (e: React.MouseEvent) => {
    if (onComprar) {
      e.preventDefault();
      onComprar(id);
    }
  };

  const formatCurrency = (value: number) => {
    return `Q${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)}`;
  };

  const formatKilometers = (value: number) => {
    return `${new Intl.NumberFormat("en-US").format(value)} km`;
  };

  const renderBlindaje = (blindaje: string | boolean) => {
    if (typeof blindaje === "boolean") {
      return blindaje ? "Blindado" : "Sin blindaje";
    }
    return blindaje;
  };

  return (
    <article className="group relative w-full max-w-[24rem] rounded-[1.25rem] bg-card text-card-foreground border border-border p-6 pb-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden">
      {/* HEADER */}
      <div className="flex items-start justify-between relative z-10 w-full mb-2.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-fs-md font-semibold">
              {modelo} {anio}
            </h2>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-destructive">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-muted-foreground">{marca}</p>
        </div>
        <button
          onClick={handleFavoritoClick}
          aria-label={isHeartActive ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="transition-transform hover:scale-110 active:scale-95 duration-200 mt-0.5"
        >
          <Heart
            className={cn(
              "h-6 w-6 transition-all",
              isHeartActive ? "fill-destructive text-destructive" : "fill-transparent text-muted-foreground/50"
            )}
            strokeWidth={isHeartActive ? 0 : 2}
          />
        </button>
      </div>

      {/* IMAGEN */}
      <div className="relative h-44 w-full mix-blend-multiply dark:mix-blend-normal my-2">
        <Image
          src={imagen || "/car.png"}
          alt={`Vehículo usado ${marca} ${modelo} del año ${anio} a la venta`}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-contain"
          priority
        />
      </div>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <div className="mt-3 grid grid-cols-3 gap-y-4 gap-x-2">
        <div className="flex items-center gap-2">
          <Settings2 className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-[0.85rem] text-muted-foreground capitalize">{specs.transmision}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-[0.85rem] text-muted-foreground">+{specs.capacidad} Personas</span>
        </div>
        <div className="flex items-center gap-2">
          <Milestone className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-[0.85rem] text-muted-foreground">{formatKilometers(specs.kilometraje)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-[0.85rem] text-muted-foreground">Motor {specs.motor}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-[0.85rem] text-muted-foreground capitalize">{renderBlindaje(specs.blindaje)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CarFront className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-[0.85rem] text-muted-foreground capitalize">{specs.traccion}</span>
        </div>
      </div>

      {/* DISPONIBILIDAD */}
      <div className="mt-5 mb-1 min-h-5">
        {esEntregaInmediata && (
          <p className="text-[0.85rem] text-muted-foreground/80 font-normal">
            Listo para entrega inmediata*
          </p>
        )}
      </div>

      {/* FOOTER - PRECIO Y BOTÓN */}
      <div className="mt-1 flex items-end justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-fs-md font-semibold text-foreground tracking-tight leading-none">
              {formatCurrency(precio)}
            </span>
            {precioOriginal && (
              <span className="text-[0.95rem] text-muted-foreground line-through font-medium">
                {formatCurrency(precioOriginal)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1.5" title="Cuota incluye seguro y gastos administrativos según historial crediticio">
            <span className="text-[0.85rem] text-muted-foreground/80">Desde</span>
            <span className="text-[0.85rem] text-muted-foreground font-medium">{formatCurrency(precioMensual)} / mes</span>
            <Info className="h-[0.8rem] w-[0.8rem] text-muted-foreground/60 transition-colors cursor-help ml-0.5 relative -top-px" />
          </div>
        </div>

        {onComprar ? (
          <button
            onClick={handleComprarClick}
            aria-label={`Comprar ${marca} ${modelo}`}
            className="rounded-[2rem] bg-brand-dark px-7 py-2.5 text-[0.95rem] font-bold text-brand-dark-foreground transition-transform hover:scale-[1.02] active:scale-95 mb-0.5"
          >
            ¡Compra ya!
          </button>
        ) : (
          <Link
            href={`/comprar/${id}`}
            aria-label={`Comprar ${marca} ${modelo}`}
            className="rounded-[2rem] bg-brand-dark px-7 py-2.5 text-[0.95rem] font-bold text-brand-dark-foreground transition-transform hover:scale-[1.02] active:scale-95 mb-0.5"
          >
            ¡Compra ya!
          </Link>
        )}
      </div>

      {/* AGENCIA */}
      <div className="mt-6 border-t border-border -mx-6 px-6 pt-3 pb-1">
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <MapPin className="h-[1.1rem] w-[1.1rem] stroke-[1.5]" />
          <span className="text-[0.85rem] font-normal">Agencia {agencia}</span>
        </div>
      </div>
    </article>
  );
}
