import {
  Settings2,
  Milestone,
  Gauge,
  Calendar1,
  CarFront,
  MapPin,
  EvCharger,
} from "lucide-react";
import { formatKilometers, formatMotor } from "@/lib/formatters/vehicle";
import type { VehicleDetail } from "@/types/vehiculo/vehiculo";

interface VehicleSpecsProps {
  vehicle: VehicleDetail;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    {
      icon: Settings2,
      label: "Transmisión",
      value: vehicle.transmision,
    },
    {
      icon: EvCharger,
      label: "Combustible",
      value: vehicle.combustible,
    },
    {
      icon: Milestone,
      label: "Kilometraje",
      value: formatKilometers(vehicle.kilometraje),
    },
    {
      icon: Gauge,
      label: "Motor",
      value: formatMotor(vehicle.motor),
    },
    {
      icon: Calendar1,
      label: "Año",
      value: String(vehicle.anio),
    },
    {
      icon: CarFront,
      label: "Tracción",
      value: vehicle.traccion,
    },
    {
      icon: MapPin,
      label: "Ubicación",
      value: vehicle.sucursal.nombre,
    },
  ];

  return (
    <div className="rounded-2xl bg-muted/50 p-6 md:p-8">
      <h2 className="text-fs-lg font-semibold font-clash-display tracking-tight">
        Detalles del auto
      </h2>
      <p className="text-muted-foreground mt-1">
        Especificaciones técnicas y ubicación del vehículo.
      </p>

      <ul className="mt-6 flex flex-col divide-y divide-border">
        {specs.map((spec) => (
          <li key={spec.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <spec.icon className="size-5 shrink-0 text-foreground" strokeWidth={1.5} />
            <span className="text-fs-base font-semibold w-32 shrink-0">
              {spec.label}
            </span>
            <span className="text-fs-base text-muted-foreground capitalize">
              {spec.value.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
