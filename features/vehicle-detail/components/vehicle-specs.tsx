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

interface VehicleSpecsProps {
  transmision: string;
  combustible: string;
  kilometraje: number;
  motor: string | null;
  anio: number;
  traccion: string;
  sucursalNombre: string;
}

function buildSpecs(props: VehicleSpecsProps) {
  return [
    { icon: Settings2, label: "Transmisión",  value: props.transmision },
    { icon: EvCharger,  label: "Combustible",  value: props.combustible },
    { icon: Milestone,  label: "Kilometraje",  value: formatKilometers(props.kilometraje) },
    { icon: Gauge,      label: "Motor",        value: formatMotor(props.motor) },
    { icon: Calendar1,  label: "Año",          value: String(props.anio) },
    { icon: CarFront,   label: "Tracción",     value: props.traccion },
    { icon: MapPin,     label: "Ubicación",    value: props.sucursalNombre },
  ];
}

export function VehicleSpecs(props: VehicleSpecsProps) {
  const specs = buildSpecs(props);

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
