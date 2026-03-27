import type React from "react";
import { notFound } from "next/navigation";
import { getCachedVehicleBySlug } from "@/app/actions/vehiculo.cached";
import { VehicleGallery } from "@/features/vehicle-detail/components/vehicle-gallery";
import { VehicleInfo } from "@/features/vehicle-detail/components/vehicle-info";
import { VehicleSpecs } from "@/features/vehicle-detail/components/vehicle-specs";
import { LoanCalculator } from "@/features/vehicle-detail/components/loan-calculator";
import type { VehicleImage } from "@/types/vehiculo/vehiculo";

const fallbackImages: VehicleImage[] = [
  { id: "img-001", url: "/single/cover_single_vehicle1.jpg", orden: 1 },
  { id: "img-002", url: "/single/cover_single_vehicle2.jpg", orden: 1 },
  { id: "img-003", url: "/single/cover_single_vehicle3.jpg", orden: 1 },
];

interface VehicleDetailProps {
  params: Promise<{ slug: string }>;
}

export async function VehicleDetail({ params }: VehicleDetailProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const vehicle = await getCachedVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <>
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <VehicleGallery images={fallbackImages} vehicleName={vehicle.nombre} />
        <VehicleInfo vehicle={vehicle} />
      </div>

      {/* Specs + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-10 lg:mt-14">
        <VehicleSpecs vehicle={vehicle} />
        <LoanCalculator vehiclePrice={vehicle.preciosiniva} />
      </div>
    </>
  );
}
