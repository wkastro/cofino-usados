"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Info,
  MapPin,
  Milestone,
  Settings2,
  Calendar1,
  Gauge,
  CarFront,
  EvCharger,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatBlindaje,
  formatCurrency,
  formatKilometers,
  formatMotor,
} from "@/lib/formatters/vehicle";
import { useFavorites } from "@/features/favoritos/context/favorites-context";
import type { Vehiculo } from "@/types/vehiculo/vehiculo";

interface VehicleCardProps {
  vehicle: Vehiculo;
}

export function VehicleCard({ vehicle }: VehicleCardProps): React.ReactElement {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(vehicle.id);

  return (
    <article className="group relative w-full max-w-[24rem] rounded-lg bg-card text-card-foreground border border-border p-6 pb-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden">
      {/* HEADER */}
      <div className="flex items-start justify-between relative z-10 w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-fs-base font-semibold">
              {vehicle.nombre} {vehicle.anio}
            </h2>
            {vehicle.etiquetas.at(0)?.etiqueta && (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-destructive">
                {vehicle.etiquetas.at(0)?.etiqueta.nombre}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{vehicle.marca.nombre}</p>
        </div>
        <button
          onClick={() => toggleFavorite(vehicle.id)}
          aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="transition-transform hover:scale-110 active:scale-95 duration-200 mt-0.5"
        >
          <Heart
            className={cn(
              "h-6 w-6 transition-all",
              favorited
                ? "fill-destructive text-destructive"
                : "fill-transparent text-muted-foreground/50",
            )}
            strokeWidth={favorited ? 0 : 2}
          />
        </button>
      </div>

      {/* IMAGEN */}
      <div className="relative h-44 w-full mix-blend-multiply dark:mix-blend-normal my-2">
        <Image
          src={"/car.png"}
          alt={`Vehículo usado ${vehicle.marca} del año ${vehicle.anio} a la venta`}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2">
          <Settings2 className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-fs-sm text-muted-foreground capitalize">
            {vehicle.transmision.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar1 className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-fs-sm text-muted-foreground">
            {vehicle.anio}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Milestone className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-fs-sm text-muted-foreground">
            {formatKilometers(vehicle.kilometraje)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-fs-sm text-muted-foreground">
            Motor {formatMotor(vehicle.motor)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <EvCharger className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-fs-sm text-muted-foreground capitalize">
            {formatBlindaje(vehicle.combustible)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CarFront className="h-[1.1rem] w-[1.1rem] stroke-[1.5] text-muted-foreground" />
          <span className="text-fs-sm text-muted-foreground capitalize">
            {vehicle.traccion}
          </span>
        </div>
      </div>

      {/* DISPONIBILIDAD */}
      <div className="mt-5 mb-1 min-h-5">
        {true && (
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
              {formatCurrency(vehicle.preciosiniva)}
            </span>
            {vehicle.preciosiniva && (
              <span className="text-[0.95rem] text-muted-foreground line-through font-medium">
                {formatCurrency(vehicle.precio)}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-1 mt-1.5"
            title="Cuota incluye seguro y gastos administrativos según historial crediticio"
          >
            <span className="text-[0.85rem] text-muted-foreground/80">
              Desde
            </span>
            <span className="text-[0.85rem] text-muted-foreground font-medium">
              {formatCurrency(vehicle.precio)} / mes
            </span>
            <Info className="h-[0.8rem] w-[0.8rem] text-muted-foreground/60 transition-colors cursor-help ml-0.5 relative -top-px" />
          </div>
        </div>

        <Link
          href={`/catalogo/${vehicle.slug}`}
          aria-label={`Comprar ${vehicle.marca}`}
          className="bg-btn-black"
        >
          ¡Compra ya!
        </Link>
      </div>

      {/* AGENCIA */}
      <div className="mt-6 border-t border-border -mx-6 px-6 pt-3 pb-1">
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <MapPin className="h-[1.1rem] w-[1.1rem] stroke-[1.5]" />
          <span className="text-[0.85rem] font-normal">
            Agencia {vehicle.sucursal.nombre}
          </span>
        </div>
      </div>
    </article>
  );
}
