import Hero from "@/features/sections/home/hero";
import { VehicleGrid } from "@/components/sections/VehicleGrid";
import { VehicleCardProps } from "@/components/global/vehicle-card";
import demoCarsData from "@/lib/data/cars.json";

export default function Home() {
  // Aquí podemos ver que convertimos la data al tipo esperado VehicleCardProps
  // en lugar de depender implícitamente del JSON
  const vehicles: VehicleCardProps[] = demoCarsData as VehicleCardProps[];

  return (
    <>
      <Hero />
      <VehicleGrid vehicles={vehicles} />
    </>
  );
}
