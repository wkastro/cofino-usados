import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleSummaryProps {
  nombre: string;
  marca: string;
  sucursal: string;
  imagen: string;
}

const RESERVATION_PRICE = 20000;
const IVA_RATE = 0.12;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export function VehicleSummary({
  nombre,
  marca,
  sucursal,
  imagen,
}: VehicleSummaryProps) {
  const iva = RESERVATION_PRICE * IVA_RATE;
  const total = RESERVATION_PRICE + iva;

  return (
    <div className="flex flex-col gap-6">
      {/* Vehicle image with overlay */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
        <Image
          src={imagen}
          alt={nombre}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h2 className="text-fs-md font-semibold text-white">{nombre}</h2>
          <p className="text-fs-sm text-white/80">{marca}</p>
        </div>
      </div>

      {/* Location & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-fs-sm font-medium text-gray-500">Ubicacion</p>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 text-gray-400" />
            <span className="text-fs-sm font-medium">{sucursal}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-fs-sm font-medium text-gray-500">Fecha</p>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-gray-400" />
            <span className="text-fs-sm font-medium">{formatDate()}</span>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-fs-sm font-medium">Reserva de automovil</p>
            <p className="text-fs-sm font-medium">{nombre}</p>
          </div>
          <p className="text-fs-md font-semibold">
            Q {formatPrice(RESERVATION_PRICE)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-fs-sm">
            IVA <span className="text-gray-500">(impuesto al valor agregado)</span>
          </p>
          <p className="text-fs-md font-semibold">
            Q {formatPrice(iva)}
          </p>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-fs-sm font-medium tracking-widest uppercase">Total</p>
            <p className="text-fs-lg font-bold">
              Q {formatPrice(total)}
            </p>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="dark"
        size="lg"
        className="w-full rounded-full py-6 text-fs-base font-semibold"
      >
        Confirmar y pagar ahora
      </Button>
    </div>
  );
}
