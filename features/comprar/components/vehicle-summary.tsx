import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import { formatPriceWhole, getPriceDecimals, formatDate } from "@/lib/formatters/vehicle";

interface VehicleSummaryProps {
  nombre: string;
  marca: string;
  sucursal: string;
  imagen: string;
  submitLabel?: string;
}

const RESERVATION_PRICE = 20000;
const IVA_RATE = 0.025;

function PriceSuperscript({ value }: { value: number }) {
  return (
    <span className="text-fs-md font-semibold">
      Q {formatPriceWhole(value)}
      <sup className="text-fs-xs align-super">{getPriceDecimals(value)}</sup>
    </span>
  );
}

export function VehicleSummary({
  nombre,
  marca,
  sucursal,
  imagen,
  submitLabel = "Confirmar y pagar ahora",
}: VehicleSummaryProps) {
  const iva = RESERVATION_PRICE * IVA_RATE;
  const total = RESERVATION_PRICE + iva;

  return (
    <div className="flex flex-col bg-white rounded-4xl border border-gray-200 overflow-hidden">
      {/* Vehicle image with overlay */}
      <div className="relative aspect-video lg:aspect-16/7 w-full overflow-hidden">
        <Image
          src={imagen}
          alt={nombre}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
          <h2 className="text-fs-md font-semibold text-white">{nombre}</h2>
          <p className=" text-white/80">{marca}</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Location & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="font-semibold">Ubicación</p>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 text-gray-400" />
              <span className="text-fs-sm">{sucursal}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold">Fecha</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-gray-400" />
              <span className="text-fs-sm">{formatDate()}</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Price breakdown */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">Reserva de automóvil</p>
              <p className="text-fs-sm">{nombre}</p>
            </div>
            <PriceSuperscript value={RESERVATION_PRICE} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold">
              IVA{" "}
              <span className="text-fs-xs text-gray-400">
                (impuesto al valor agregado)
              </span>
            </p>
            <PriceSuperscript value={iva} />
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <p className="font-semibold tracking-widest uppercase">Total</p>
            <span className="text-fs-xl font-semibold">
              Q {formatPriceWhole(total)}
              <sup className="text-fs-sm align-super">{getPriceDecimals(total)}</sup>
            </span>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button type="submit" className="bg-btn-black">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
